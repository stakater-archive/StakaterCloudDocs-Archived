# Backup and Restore

Back up and restore applications on Stakater App Agility Platform (AAP)

## Prerequisite
You need velero CLI setup, follow the velero-cli [doc](./velero-cli.md)

## Service viewpoint

### Backup

Stakater App Agility Platforms divides backups into two:

1. Customer backups
2. Platform Tools backups

These Backups are stored on the Cloud Provider under your account.
#### Customer Backups

There are 3 default backup schedules for customers that are deployed with offered velero tool

| Schedule                       | Backup Frequency |   Backup Retention   | Backup Scope |
| -------------------------- | ---------------- | -------------------- | ---------------- |
| Daily Customer Workload Backup | Every 24 hrs |   Last 7 Backup(s) | Objects + PV Snapshots |
| Hourly Full Cluster Object Backup | Every hour | Last 24 Backup(s) | Objects |
| Weekly Full Backup | Once Every week | Last 4 Backup(s)   | Objects + PV Snapshots |

#### Platform Tools backups

Stakater only takes backups of the managed applications:

| Tool                       | Backup Frequency |   Backup Retention   |
| -------------------------- | ---------------- | -------------------- |
| Nexus                      |    Every 24 hrs   |   Last 3 Backup(s)   | 
| Prometheus (Cluster)       |    Every 24 hrs   |   Last 3 Backup(s)   |
| Promehteus (Applications)  |    Every 24 hrs   |   Last 3 Backup(s)   |
| Elasticsearch              |    Every 24 hrs   |   Last 3 Backup(s)   |
| Vault                      |    Every 24 hrs   |   Last 3 Backup(s)   | 
| Sonarqube                  |    Every 24 hrs   |   Last 3 Backup(s)   | 
| CodeReadyWorkspaces        |    Every 24 hrs   |   Last 3 Backup(s)   | 
| RHSSO (KeyCloak)           |    Every 24 hrs   |   Last 3 Backup(s)   | 
| ArgoCD                     |    Every 24 hrs   |   Last 3 Backup(s)   | 

If you want to change backup frequency/retention times for your specific needs, contact support.

### Restore

Resources can be restored on demand. Please contact support and specify the following 

- Time to restore back to.
- Namespaces to include/exclude from backup
- Resources to include/exclude from backup
- LabelSelector to filter objects to restore
- Whether to include cluster resources or not
- Whether to restore PVs or not (Not applicable on Object Only Backups)

## Technical viewpoint

Stakater App Agility Platform uses managed velero operator to provision the velero server. This backup and restore process can be used for both disaster recovery and cluster migration.

### Backup

Using Schedules and Read-Only Backup Storage Locations & Volume Snapshot Locations.

First things first, Velero needs a backupStorageLocation where backups can be stored
These are including the backup destination storage information
- Backupstoragelocation CR
ex:
~~~
apiVersion: velero.io/v1
kind: BackupStorageLocation
metadata:
  name: default
  namespace: openshift-velero
  spec:
    config:
      region: eu-central-1
    objectStorage:
      bucket: *********
    provider: aws
~~~
- VolumeSnapshotlocation CR (Not needed when using CSI Plugin for backups)
ex:
~~~
apiVersion: velero.io/v1
kind: VolumeSnapshotLocation
metadata:
  name: default
  namespace: openshift-velero
  spec:
    config:
      region: eu-central-1
    provider: aws
~~~
Then schedule the backup by using the backup locations and specifying the various filters for backup target.
- Create Shedule CR
ex:
~~~
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: backup-schedule
  namespace: openshift-velero
  spec:
    schedule: 0 */6 * * *
    template:
      labelSelector:
        matchExpressions:
        - key: app
          operator: In
          values:
        - nexus
      includeClusterResources: true
      includedNamespaces:
      - '*'
      includedResources:
      - '*'
      snapshotVolumes: true
      storageLocation: default
      ttl: 24h0m0s
      volumeSnapshotLocations:
      - default
~~~
Or you can specify a single Backup using a backup CR.
- Create a Backup CR
ex:
~~~
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: data-backup
  namespace: openshift-velero
spec:
  includedNamespaces:
  - openshift-stakater-3scale
  includedResources:
  - '*'
  storageLocation: default
  ttl: 72h0m0s
  volumeSnapshotLocations:
  - default
~~~
##### Different Schedule Definitons and their meanings
Changing some parameters in Schedule CR, changes the backup behavior
- snapshotVolumes: (boolean)
  - true (makes velero to take native volume snapshots)
  - false (no native velero snapshots taken)
  - Not Specify (Defaults to auto behavior define within velero)
  Note: You don't specify this parameter with velero CSI plugin

- includeClusterResources: (boolea)
  - true (includes all cluster level resource, snapshotVolumes needs to be true to take PV snapshots)
  - false (exclude cluster level resources, including PVs. So there will be no snapshots)

- Excluding both `snapshotVolumes` and `includeClusterResources` will have default behavior of taking snapshots for only included namespaces PVs.

#### Backup target Filters
You can use [resource filtering](https://velero.io/docs/main/resource-filtering/) options to backup specific resources. Typical ones are following;
- labelSelector: Specify the labels for the backup target resources
   MatchExpression has several operators such as In, NotIn, Exists and DoesNotExist.
- includeClusterResources:(Boolean) Set true to include cluster level resources like PV etc.
- includedNamespaces: Specify the namespaces in which backup target resources are included
- includedResources: Specify the resource types for the backup target resources
- excludeNamespaces: Specify the namespaces to exlcude from backup
- excludeResources: Specify the resource types to exclude from backup
**NOTE**: You have to select the resource filters properly. For example, if the target application has cluster-scope resources, then you cannot use `--include-namespaces` only.

#### backup destination
- snapshotVolumes:(Boolean) Set true for volume snapshotting
- storageLocation: Backupstoragelocation CR name
- volumeSnapshotLocations: VolumeSnapshotlocation CR name

#### retention policy
- ttl: The backup retention period

### Restore

Restore on the same cluster or the other cluster in the case of cluster broken.
Update your backup storage location to read-only mode (this prevents backup objects from being created or deleted in the backup storage location during the restore process):
~~~
kubectl patch backupstoragelocation <STORAGE LOCATION NAME> \
    --namespace openshift-velero \
    --type merge \
    --patch '{"spec":{"accessMode":"ReadOnly"}}'
~~~
Create a restore with your most recent Velero Backup:
~~~
velero restore create --from-backup <BACKUP NAME>
~~~

When ready, revert your backup storage location to read-write mode:
~~~
kubectl patch backupstoragelocation <STORAGE LOCATION NAME> \
   --namespace openshift-velero \
   --type merge \
   --patch '{"spec":{"accessMode":"ReadWrite"}}'
~~~

#### restore target filter

If you want to restore specific resources, you can use [resource filtering](https://velero.io/docs/main/resource-filtering/).
For example, you can restore resources in `web` namespace:
```
velero restore create --from-backup <BACKUP NAME> --include-namespaces web --namespace openshift-velero
```
**NOTE**: You have to select the resource filters properly. For example, if the target application has cluster-scope resources, then you cannot use `--include-namespaces` only.
