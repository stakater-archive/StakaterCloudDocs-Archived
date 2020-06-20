# Frequently asked questions

## Operations

### Which services are performed by Stakater Operations?

Stakater is responsible for provisioning, managing, and upgrading the Red Hat OpenShift (container) platform as well as monitoring the core cluster infrastructure for availability. And Stakater is not responsible for managing the application lifecycle of applications that run on the platform.

### What is the Stakater Kubernetes Service (SKS) maintenance process?

There are three types of maintenance for SKS: upgrades, backup and restoration of etcd data, and cloud provider-initiated maintenance.

- Upgrades include software upgrades and CVEs.
- Backup and management of etcd data is an automated process that may require cluster downtime depending on the action. If the etcd database is being restored from a backup there will be downtime. We back up etcd hourly and retain the last 6 hours of backups.
- Cloud provider-initiated maintenance includes network, storage, and regional outages. The maintenance is dependent on the cloud provider and relies on provider-supplied updates.

### What is the general upgrade process?

Running an upgrade should be a safe process to run and should not disrupt cluster services. The SRE can trigger the upgrade process when new versions are available or CVEs are outstanding. Available updates are tested in a staging environment and then applied to production clusters. Following best practices helps ensure minimal to no downtime. 

Planned maintenance is not prescheduled with the customer. Notifications may be sent via email if communication to the customer is required.

### How will the host operating systems and OpenShift software be updated?

The host operating systems and OpenShift software are updated through our general upgrade process.

### Which UNIX rights (in IaaS) are available for Masters/Infra/Worker Nodes?

Node access is forbidden.

### How to add new worker nodes to the cluster?

You need to open a support case; until the feature is added to portal
