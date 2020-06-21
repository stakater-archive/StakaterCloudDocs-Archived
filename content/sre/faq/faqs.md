# Frequently asked questions

## Product

### What is difference between SKS & SRO?

There is i no difference; just two different product offerings name.

SKS - Stakater Kubernetes Service
SRO - Stakater Red Hat OpenShift

### Which clouds are supported by SKS/SRO?

We currently support Azure, AWS and Google

### What does Stakater Red Hat OpenShift (SRO) include?

Each SRO (Stakater Red Hat OpenShift) cluster comes with a fully-managed control plane (master nodes), infra nodes and application nodes. Installation, management, maintenance, and upgrades are performed by Stakater SRE. Operational services (such as logging, metrics, monitoring, etc.) are available as well and are fully managed by Stakater SRE.

### What is the current version of Red Hat OpenShift running in Stakater Red Hat OpenShift (SRO)?

OpenShift Container Platform 4.4

### How is Stakater Red Hat OpenShift (SRO) different than Red Hat OpenShift Container Platform?

Stakater Red Hat OpenShift (SRO) uses the same code base as Red Hat OpenShift Container Platform, but is installed in an opinionated way—optimized for performance, scalability, and security. Stakater Red Hat OpenShift (SRO) is hosted on Microsoft Azure, AWS and/or Google public cloud managed by Stakater. Some options and administrative functions are restricted or unavailable on Azure Red Hat OpenShift. A Red Hat OpenShift Container Platform subscription entitles you to host and manage the software on your own infrastructure.

### Is there any element in SRO shared with other customers? Or is everything independent?

Each Stakater Red Hat OpenShift cluster is dedicated to a given customer and lives within the customer's subscription/account.

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

### How do I make configuration changes to my cluster?

An administrative user has the ability to add/remove users and projects, manage project quotas, view cluster usage statistics, and change the default project template. Admins can also scale a cluster up or down, and even delete an existing cluster.

You need to open a support case; until we allow customers to have cluster admins.

### Can logs of underlying VMs be streamed out to a customer log analysis system?

Syslog, CRI-O logs, journal, and dmesg are handled by the managed service and are not exposed to customers.

### Can logs of applications streamed out to a customer log analysis system?

Yes they can be stream out.

## Customization

### What authentication mechanisms are supported?

All supported mechanisms for authentication that are supported by OpenShift Container Platform are supported.

### Can I bring my own VPC/VNet?

No. Currently it's not supported

### Can I add RHEL workers to my cluster?

No. In order to maintain our ability to provide seamless updates to your clusters, only Red Hat Enterprise Linux CoreOS (RHCOS) workers are supported by Azure Red Hat OpenShift.

### Which Red Hat OpenShift Container Platform rights do we have? Cluster-admin? Project-admin?

Project-admin credentials are provided to you when you order your cluster. In future releases we will support Cluster-admin as well.

### What virtual machine sizes can I use?

You are free to choose the types of virtual machine when ordering the cluster.

## Purchasing

### Is Stakater Red Hat OpenShift (SRO) available for purchase in all countries?

Stakater Red Hat OpenShift (SRO) is available for purchase in all countries where Azure, AWS or Google is commercially available.

### How can I purchase Stakater Red Hat OpenShift (SRO)?

Stakater Red Hat OpenShift can be purchased by sending an email to hello@stakater.com and someone from our sales team will contact you.

### Can I try Stakater Red Hat OpenShift (SRO) before I buy?

Stakater Red Hat OpenShift (SRO) is available on a pay-as-you-go basis. At the moment we do not offer a free trial or a proof of concept (PoC) for Stakater Red Hat OpenShift (SRO).

### Will I receive an invoice from Stakater?

Customers will be directly billed by Stakater only.

### Do I need to sign a separate contract with Red Hat to use the service?

No, you don’t need to sign a contract with Red Hat. Customers will be billed by Stakater only.

## Developers

### Can end users utilize images/containers that require root user privileges?

Currently, we do not allow users to run processes within containers that require root user privileges for security reasons [see here](https://docs.docker.com/engine/security/security/).

### Are Red Hat JBoss Middleware services available on Stakater Red Hat OpenShift (SRO)?

A number of Red Hat JBoss Middleware Services are available as add-ons for Stakater Red Hat OpenShift (SRO), including:

- Red Hat JBoss Enterprise Application Platform
- Red Hat JBoss Web Server (included)
- Red Hat JBoss A-MQ
- Red Hat Process Automation Manager
- Red Hat JBoss BPM Suite Intelligent Process Server
- Red Hat JBoss Decision Manager
- Red Hat JBoss BRMS Decision Server
- Red Hat JBoss Data Grid
- Red Hat JBoss Data Virtualization
- Red Hat JBoss Fuse Integration Services
- Red Hat Single Sign-On.
