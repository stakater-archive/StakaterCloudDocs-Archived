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
