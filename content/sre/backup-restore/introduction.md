## Introduction

[Velero](https://velero.io/) is a solution for supporting Kubernetes cluster disaster recovery, data migration and data protection by backing up Kubernetes cluster resources and persistent volumes to externally supported storage backend on-demand or by schedule.

The major functions include:
- Backup Kubernetes resources and persistent volumes for supported storage providers.
- Restore Kubernetes resources and persistent volumes for supported storage providers.
- When backing up persistent volumes w/o supported storage provider, Velero leverages [restic](https://github.com/restic/restic) as an agnostic solution to back up this sort of persistent volumes under some known limitations.

User can leverage these fundamental functions to achieve user stories:
- Backup whole Kubernetes cluster resources then restore if any Kubernetes resources loss.
- Backup selected Kubernetes resources then restore if the selected Kubernetes resources loss.
- Backup selected Kubernetes resources and persistent volumes then restore if the Kubernetes selected Kubernetes resources loss or data loss.
- Replicate or migrate a cluster for any purpose, for example replicating a production cluster to a development cluster for testing.

Velero consists of below components:
- A Velero server that runs on your Kubernetes cluster.
- A restic deployed on each worker nodes that run on your Kubernetes cluster (optional).
- A command-line client that runs locally.

### Limitations

- Velero doesn't overwrite objects in-cluster if they already exist.
- Velero supports a single set of credentials _per provider_. It's not yet possible to use different credentials for different object storage locations for the same provider.
- Volume snapshots are limited by where your provider allows you to create snapshots. For example, AWS and Azure do not allow you to create a volume snapshot in a different region than where the volume is located. If you try to take a Velero backup using a volume snapshot location with a different region than where your cluster's volume is, the backup will fail.
- It is not yet possible to send a single Velero backup to multiple backup storage locations simultaneously, or a single volume snapshot to multiple locations simultaneously. However, you can set up multiple backups manually or scheduled that differ only in the storage locations.
- Cross-provider snapshots are not supported. If you have a cluster with more than one type of volume (e.g. NFS and Ceph), but you only have a volume snapshot location configured for NFS, then Velero will _only_ snapshot the NFS volumes.
- `Restic` data is stored under a prefix/subdirectory of the main Velero bucket and will go into the bucket corresponding backup storage location selected by the user at backup creation time.
- When performing cluster migration, the new cluster number of nodes should be equal or greater than the original cluster.

For more information about storage and snapshot locations, refer to link:https://velero.io/docs/v1.4/locations/[Velero: Backup Storage Locations and Volume Snapshot Locations]
