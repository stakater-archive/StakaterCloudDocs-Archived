# Backup and Restore

Back up and restore applications on Stakater App Agility Platform (AAP)

## Service viewpoint

### Backup

Stakater App Agility Platforms divides backups into two:

1. Manifests backup
2. Volumes backup

These Manifests and Volume Backups are stored on the Cloud Provider under your account.

#### Manifests Backup

| Namespaces       | Backup Frequency | Backup Retention |
| ---------------- | ---------------- | ---------------- |
|  All Namespaces  |    Every 6 hrs   | Last 12 Backup(s)   | 

#### Volumes Backup

Stakater only takes backups of the managed applications:

| Tool                       | Backup Frequency |   Backup Retention   |
| -------------------------- | ---------------- | -------------------- |
| Nexus                      |    Every 6 hrs   |   Last 1 Backup(s)   | 
| Prometheus (Cluster)       |    Every 6 hrs   |   Last 1 Backup(s)   |
| Promehteus (Applications)  |    Every 6 hrs   |   Last 1 Backup(s)   |
| Elasticsearch              |    Every 6 hrs   |   Last 1 Backup(s)   |
| Vault                      |    Every 6 hrs   |   Last 1 Backup(s)   | 
| Sonarqube                  |    Every 6 hrs   |   Last 1 Backup(s)   | 
| CodeReadyWorkspaces        |    Every 6 hrs   |   Last 1 Backup(s)   | 
| RHSSO (KeyCloak)           |    Every 6 hrs   |   Last 1 Backup(s)   | 
| ArgoCD                     |    Every 6 hrs   |   Last 1 Backup(s)   | 

If you want to change backup frequency/retention times for your specific needs, contact support.

### Restore

Resources can be restored on demand. Please contact support and specify the following 

- Time to restore back to.
- Namespaces to include/exclude from backup
- Resources to include/exclude from backup
- LabelSelector to filter objects to restore
- Whether to include cluster resources or not
- Whether to restore PVs or not

## Technical viewpoint

Stakater App Agility Platform uses managed velero operator to provision the velero server. This backup and restore process can be used for both disaster recovery and cluster migration.

### Backup

Using Schedules and Read-Only Backup Storage Locations & Volume Snapshot Locations.

First things first, create needed backup locations.
These are including the backup destination storage information(address and credentials)
- Backupstoragelocation CR
ex:
~~~
  spec:
    config:
      region: eu-central-1
    objectStorage:
      bucket: *********
    provider: aws
~~~
- VolumeSnapshotlocation CR
ex:
~~~
  spec:
    config:
      region: eu-central-1
    provider: aws
~~~
Then schedule the backup by using the backup locations and specifying the various filters for backup target.
- Create Shedule CR
ex:
~~~
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
  status:
    lastBackup: "2020-10-09T06:00:11Z"
    phase: Enabled
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
~~~

#### backup target Filters
You can use [resource filtering](https://velero.io/docs/main/resource-filtering/) options to backup specific resources. Typical ones are following;
- labelSelector: Specify the labels for the backup target resources
   MatchExpression has several operators such as In, NotIn, Exists and DoesNotExist.
- includeClusterResources:(Boolean) Set true to include PV
- includedNamespaces: Specify the namespaces in which backup target resources are included
- includedResources: Specify the resource types for the backup target resources
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
    --namespace velero \
    --type merge \
    --patch '{"spec":{"accessMode":"ReadOnly"}}'
~~~
Create a restore with your most recent Velero Backup:
~~~
velero restore create --from-backup <SCHEDULE NAME>-<TIMESTAMP>
~~~

When ready, revert your backup storage location to read-write mode:
~~~
kubectl patch backupstoragelocation <STORAGE LOCATION NAME> \
   --namespace velero \
   --type merge \
   --patch '{"spec":{"accessMode":"ReadWrite"}}'
~~~

#### restore target filter

If you want to restore specific resources, you can use [resource filtering](https://velero.io/docs/main/resource-filtering/).
For example, you can restore resources in `web` namespace:
```
velero restore create --from-backup <SCHEDULE NAME>-<TIMESTAMP> --include-namespaces web
```
**NOTE**: You have to select the resource filters properly. For example, if the target application has cluster-scope resources, then you cannot use `--include-namespaces` only.
