# SRE Authorization Roles for SAAP

## saap-sre-cluster-admin:
###  Operators Permissions:
- Customer can view OperatorHub in console
- Customer can managed CRs for curated operators e.g
  - AMQ Certificate Manager Operator
  - Openshift Pipelines Operator
- Can install Operators from a curated list provided by the OperatorHub. This makes the Operator available to all developers on your cluster to create Custom Resources and applications using that Operator.
- Privileged and custom Operators cannot be installed
- Cluster administrators can delete installed Operators from a selected namespace by using the web console/CLI.

###  Project Permissions:
- Have admin access to all customer-created projects on the cluster
- Customer has read-only access to openshift*,stakater*,kube*,redhat*,default projects because these are managed by the stakater team
- Nodes & Quotas Permissions:
- Can manage resource quotas and limits on the cluster
- Can add/manage NetworkPolicy objects
- Are able to view information about specific nodes and PVs in the cluster, including schequotas and limits on the cluster
- Can access the reserved ‘dedicated-admin’ project on the cluster, which allows for the creation of ServiceAccounts with elevated privileges and gives the ability to update default limits and quotas for projects on the cluster
- Allow crud for saap-customer-admin on clusterresourcequotas


###  Resources Permissions
- Customer can GET openshift haproxy router metrics
- Customer can use monitoring web applications
- Customer can see project status (nice UX from use monitoring web applications)
- Customer can create verify tokens and access
- Allow manage UserIdentityMappings
- DNS Forwarder
- Read permissions of imagestreams
- Manage project.config.openshift.io CR
- Start - anyuid and nonroot SSCs
- Allow viewing of machines, machinesets 
