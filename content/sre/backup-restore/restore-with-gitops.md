# Restore PVC data with GitOps

Restore PVC data when its managed in gitops by Argocd.

## Prerequisite

You need to have velero CLI installed and backup taken of namespace.

## Disable self heal in Argocd:

Disalbe self heal in argocd application that is managing PVC so it does not recreate resources from gitops.

```
  syncPolicy:
    automated:
      prune: true
      selfHeal: false

```

## Delete PVC 

Scale down statefulset pod so PVC can be deleted
```
oc scale statefulsets <name> --replicas 0
```

Delete the PVC which you want to restore data so that its created again by velero.

``` 
oc delete pvc <pvc-name> -n <namespace> 
```


## Restore Velero Backup

Perform a velero restore, use velero command:
~~~
velero restore create --from-backup cassandra-backup --namespace <VELERO_NAMESAPCE>
~~~
Or use Restore CR to perform a restore:
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

After a successful restore, you should be able to see pod up and running with restored backup data

## Scale up Statefulset again

Scale up Stateful set so new pod can be attached to restored pvc
```
oc scale statefulsets <name> --replicas 0
```

## Enable self heal again

Enable self heal so argocd start managing resources again. 

```
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

```