## Limitations

- Velero doesn't overwrite objects in-cluster if they already exist.
- Velero supports a single set of credentials _per provider_. It's not yet possible to use different credentials for different object storage locations for the same provider.
- Volume snapshots are limited by where your provider allows you to create snapshots. For example, AWS and Azure do not allow you to create a volume snapshot in a different region than where the volume is located. If you try to take a Velero backup using a volume snapshot location with a different region than where your cluster's volume is, the backup will fail.
- It is not yet possible to send a single Velero backup to multiple backup storage locations simultaneously, or a single volume snapshot to multiple locations simultaneously. However, you can set up multiple backups manually or scheduled that differ only in the storage locations.
- Cross-provider snapshots are not supported. If you have a cluster with more than one type of volume (e.g. NFS and Ceph), but you only have a volume snapshot location configured for NFS, then Velero will _only_ snapshot the NFS volumes.
- `Restic` data is stored under a prefix/subdirectory of the main Velero bucket and will go into the bucket corresponding backup storage location selected by the user at backup creation time.
- When performing cluster migration, the new cluster number of nodes should be equal or greater than the original cluster.

For more information about storage and snapshot locations, refer to link:https://velero.io/docs/v1.4/locations/[Velero: Backup Storage Locations and Volume Snapshot Locations]
