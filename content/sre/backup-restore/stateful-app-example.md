# Backup and Restore a Stateful App using Velero

## Prerequisite

You need velero CLI setup, follow the velero-cli [doc](./velero-cli.md)

## Prepare manifests for app

You will need the following manifest to deploy the sample app.

Security Context Constraints to have proper permissions to your app

~~~
kind: SecurityContextConstraints
apiVersion: v1
allowHostPorts: true
allowedCapabilities:
- '*'
defaultAddCapabilities: [] 
fsGroup: 
  type: RunAsAny
groups: 
- system:cluster-admins
- system:nodes
metadata:
  name: privileged-app-test
priority: null
readOnlyRootFilesystem: false
requiredDropCapabilities: [] 
runAsUser: 
  type: RunAsAny
seLinuxContext: 
  type: RunAsAny
seccompProfiles:
- '*'
supplementalGroups: 
  type: RunAsAny
users: 
- system:serviceaccount:cassandra-app:default
volumes:
- '*'
~~~

Create a namespace:
~~~
apiVersion: v1
kind: Namespace
metadata:
  name: cassandra-app
~~~

Create the Stateful app:
~~~
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cassandra
  namespace: cassandra-app
  labels:
    app: cassandra
spec:
  serviceName: cassandra
  replicas: 1
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      terminationGracePeriodSeconds: 180
      containers:
      - name: cassandra
        image: gcr.io/google-samples/cassandra:v11
        ports:
        - containerPort: 7000
          name: intra-node
        - containerPort: 7001
          name: tls-intra-node
        - containerPort: 7199
          name: jmx
        - containerPort: 9042
          name: cql
        resources:
          limits:
            cpu: "500m"
            memory: 2Gi
          requests:
            cpu: "500m"
            memory: 1Gi
        securityContext:
          capabilities:
            add:
              - IPC_LOCK
        lifecycle:
          preStop:
            exec:
              command:
              - /bin/sh
              - -c
              - nodetool drain
        env:
          - name: MAX_HEAP_SIZE
            value: 512M
          - name: HEAP_NEWSIZE
            value: 100M
# Make sure the DNS name matches the namespace
          - name: CASSANDRA_SEEDS
            value: "cassandra-0.cassandra.cassandra-app.svc.cluster.local"
          - name: CASSANDRA_CLUSTER_NAME
            value: "Demo-Cluster"
          - name: CASSANDRA_DC
            value: "Demo-DataCenter"
          - name: CASSANDRA_RACK
            value: "Demo-Rack"
          - name: POD_IP
            valueFrom:
              fieldRef:
                fieldPath: status.podIP
        readinessProbe:
          exec:
            command:
            - /bin/bash
            - -c
            - /ready-probe.sh
          initialDelaySeconds: 15
          timeoutSeconds: 5
        volumeMounts:
        - name: cassandra-data
          mountPath: /cassandra_data
  volumeClaimTemplates:
  - metadata:
      name: cassandra-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: standard
      resources:
        requests:
          storage: 1Gi
~~~

Create the service for the app:
~~~
apiVersion: v1
kind: Service
metadata:
  labels:
    app: cassandra
  name: cassandra
  namespace: cassandra-app
spec:
  clusterIP: None
  selector:
    app: cassandra
~~~

Note: If you see some error or failed app, please try to ensure CASSANDRA_SEEDS value in your stateful app.

## Deploy app, populate data and verify

Deploy all the above manifests. Once on a successful deployment, you can check the app status using:

~~~
kubectl exec -it cassandra-0 -n cassandra-app -- nodetool status
~~~

and you should see something like this:

~~~
Datacenter: Demo-DataCenter
===========================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address       Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.130.4.200  150.08 KiB  32           100.0%            2516974e-3065-4acd-9762-f7b740867cd4  Demo-Rack
~~~

Now we will populate data, run the command to connect into pod:

~~~
kubectl exec -it cassandra-0 -n cassandra-app -- cqlsh
~~~

Now you should be connected to `cqlsh` utility in the app pod, running the commands to populate data:

~~~
cqlsh> CREATE KEYSPACE demodb WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };

cqlsh> use demodb;

cqlsh:demodb> CREATE TABLE emp(emp_id int PRIMARY KEY, emp_name text, emp_city text, emp_sal varint,emp_phone varint);

cqlsh:demodb> INSERT INTO emp (emp_id, emp_name, emp_city, emp_phone, emp_sal) VALUES (100, 'Cormac', 'Cork', 999, 1000000);

cqlsh:demodb> select * from emp;

 emp_id | emp_city | emp_name | emp_phone | emp_sal
--------+----------+----------+-----------+---------
    100 |     Cork |   Cormac |       999 | 1000000

(1 rows)
cqlsh:demodb> exit
~~~

If everything goes well, your output should resemble to the one record above.

## Take backup and destroy app

To take velero backup, use velero command:

~~~
velero backup create cassandra-backup --include-namespaces cassandra-app --namespace <VELERO_NAMESAPCE>
~~~

or you can use Backup CR:

~~~
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: cassandra-backup
  namespace: openshift-velero
spec:
  includedNamespaces:
  - cassandra-app
  includedResources:
  - '*'
  storageLocation: default
  ttl: 2h0m0s
~~~

Now delete the app namespace `cassandra-app` and this should delete everything in the namespace including deployed app and its Volume.

## Restore and verify app

To perform a velero restore, use velero command:

~~~
velero restore create --from-backup cassandra-backup --namespace <VELERO_NAMESAPCE>
~~~

Or we can use Restore CR to perform a restore:

~~~
apiVersion: velero.io/v1
kind: Restore
metadata:
  name: cassandra-backup-restore
  namespace: openshift-velero
spec:
  backupName: cassandra-backup
  excludedResources:
    - nodes
    - events
    - events.events.k8s.io
    - backups.velero.io
    - restores.velero.io
    - resticrepositories.velero.io
  includedNamespaces:
    - '*'
~~~

After a successful restore, we should be able to see a pod of our app running and should be able to link to its shell. Check the status again:

~~~
kubectl exec -it cassandra-0 -n cassandra-app -- nodetool status
~~~

and you should see the status as before:

~~~
Datacenter: Demo-DataCenter
===========================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address       Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.130.4.200  150.08 KiB  32           100.0%            2516974e-3065-4acd-9762-f7b740867cd4  Demo-Rack
~~~

We will again exec in the app using:

~~~
kubectl exec -it cassandra-0 -n cassandra -- cqlsh
~~~

Check for the populated data:

~~~
cqlsh> use demodb;

cqlsh:demodb> select * from emp;

 emp_id | emp_city | emp_name | emp_phone | emp_sal
--------+----------+----------+-----------+---------
    100 |     Cork |   Cormac |       999 | 1000000

(1 rows)
cqlsh:demodb> exit
~~~

With a correct restore, the above data should be same as before.
