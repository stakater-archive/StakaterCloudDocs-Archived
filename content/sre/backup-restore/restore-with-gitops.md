# Restore PVC data with GitOps

Restore PVC data when its managed in gitops by Argocd.

## 1. Prerequisite

Setup velero-cli [doc](./velero-cli.md)

## 2. Take backup

To take backup with velero you have two options:

### 2.1: Option # 1 - Via Cli

~~~
velero backup create <NAME-OF-BACKUP> --include-namespaces <APPLICATION-NAMESPACE> --namespace openshift-velero
~~~

### 2.2: Option # 2 - Via CR

~~~
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: <NAME-OF-BACKUP>
  namespace: openshift-velero
spec:
  includedNamespaces:
  - <APPLICATION-NAMESPACE>
  includedResources:
  - '*'
  storageLocation: default
  ttl: 2h0m0s
~~~

## 3. Disable self heal in Argocd:

Disalbe self heal in argocd application that is managing PVC so it does not recreate resources from gitops.

```
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
```

## 4. Delete PVC 

Scale down statefulset pod so PVC can be deleted

```
oc scale statefulsets <NAME> --replicas 0
```

Delete the PVC which you want to restore data so that its created again by velero.

``` 
oc delete pvc <PVC-NAME> -n <NAMESPACE> 
```

## 5. Restore Velero Backup

To restore backup with velero you have two options:

### 5.1: Option # 1 - Via Cli

~~~
velero restore create --from-backup <NAME-OF-BACKUP> --namespace openshift-velero
~~~

### 5.2: Option # 2 - Via CR

~~~
apiVersion: velero.io/v1
kind: Restore
metadata:
  name: <NAME-OF-BACKUP>
  namespace: openshift-velero
spec:
  backupName: <NAME-OF-BACKUP>
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

## 6. Scale up Statefulset again

Scale up Stateful set so new pod can be attached to restored pvc

```
oc scale statefulsets <NAME> --replicas 0
```

## 7. Validate

Validate the data exists in the database.

## 8. Enable self heal again

Enable self heal so argocd start managing resources again. 

```
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

```
