# Operations

### Which services are performed by Stakater Operations?

Stakater is responsible for provisioning, managing, and upgrading the Red Hat OpenShift (container) platform as well as monitoring the core cluster infrastructure for availability. And Stakater is not responsible for managing the application lifecycle of applications that run on the platform.

### What is the Stakater Agility Platform maintenance process?

There are three types of maintenance for Stakater Agility Platform: upgrades, backup and restoration of etcd data, and cloud provider-initiated maintenance.

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

### How do I make configuration changes to my cluster?

An administrative user has the ability to add/remove users and projects, manage project quotas, view cluster usage statistics, and change the default project template. Admins can also scale a cluster up or down, and even delete an existing cluster.

You need to open a support case; until we allow customers to have cluster admins.

### Can logs of underlying VMs be streamed out to a customer log analysis system?

Syslog, CRI-O logs, journal, and dmesg are handled by the managed service and are not exposed to customers.

### Can logs of applications streamed out to a customer log analysis system?

Yes they can be stream out.
