# Restore PVC data with GitOps

Restore PVC data when its managed in gitops by Argocd.

## Prerequisite

Setup velero-cli [doc](./velero-cli.md)

## Take backup

To take backup with velero you have two options:

### Option # 1 - Via Cli

~~~
velero backup create <NAME-OF-BACKUP> --include-namespaces <APPLICATION-NAMESPACE> --namespace openshift-velero
~~~

### Option # 2 - Via CR

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

To restore backup with velero you have two options:

### Option # 1 - Via Cli

~~~
velero restore create --from-backup <NAME-OF-BACKUP> --namespace openshift-velero
~~~

### Option # 2 - Via CR

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

## Scale up Statefulset again

Scale up Stateful set so new pod can be attached to restored pvc

```
oc scale statefulsets <name> --replicas 0
```

## Validate

Validate the data exists

## Enable self heal again

Enable self heal so argocd start managing resources again. 

```
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

```
