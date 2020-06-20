# Frequently asked questions

## Operations

### What is the Stakater Kubernetes Service (SKS) maintenance process?

There are three types of maintenance for SKS: upgrades, backup and restoration of etcd data, and cloud provider-initiated maintenance.

- Upgrades include software upgrades and CVEs.
- Backup and management of etcd data is an automated process that may require cluster downtime depending on the action. If the etcd database is being restored from a backup there will be downtime. We back up etcd hourly and retain the last 6 hours of backups.
- Cloud provider-initiated maintenance includes network, storage, and regional outages. The maintenance is dependent on the cloud provider and relies on provider-supplied updates.
