# Authorization Roles for SAAP

Depending on responsibilities of a role, specific roles can be assigned to customer groups, which enable them to achieve there daily tasks.Below is a list of roles provided by SAAP for different customer groups

## 1. saap-cluster-admin:
###  Operators Permissions:
- Customer can view OperatorHub in console
- Customer can create/view/delete CRs for [curated operators](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) e.g
  - AMQ Certificate Manager Operator
  - Openshift Pipelines Operator
- Customer can install Operators from a [curated list](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) provided by the OperatorHub. This makes the Operator available to all developers on your cluster to create Custom Resources and applications using that Operator.
- Customer is not allowed to install Privileged and custom Operators
- Customer can view installed Operators from a selected namespace by using the web console/CLI.
###  Projects Permissions:
- Customer have admin access to all customer-created projects on the cluster
- Customer has view access to openshift*,stakater*,kube*,redhat*,default projects because these are managed by the stakater team
### Storage
- Customer is able to view information about specific nodes and PVs in the cluster, including quotas and limits on the cluster
- Customer is not allowed to delete Storage Class
### Networking
- Customer can create/view/delete NetworkPolicy objects
- DNS Forwarder
### Monitoring
- Customer can view openshift haproxy router metrics
- Customer can view monitoring web applications
- Customer can view project status (nice UX from use monitoring web applications)
### Compute
- Customer can view  machines, machinesets
- Customer cannot view Nodes,machine configs, machine config pools,imagestreams
- Customer cannot delete machines,machinesets
- Manage project.config.openshift.io CR
- Start - anyuid and nonroot SSCs
###  User Management
- Customer can view Users/Groups
- Customer can view Service Accounts/Roles/Role Bindings in user created projects
- Customer cannot view Service Accounts/Roles/Rold Bindings in openshift* ,stakater*,kube*,redhat*,default namespaces
- Allow create/view/delete on UserIdentityMappings
- Customer can create/verify tokens and access
### Administration:
- Customer can create/edit/delete resource quotas and limits on the cluster
- Customer can access the reserved ‘saap-customer-admin’ project on the cluster, which allows for the creation of ServiceAccounts with elevated privileges and gives the ability to update default limits and quotas for projects on the cluster
- Customer can create/edit/delete clusterresourcequotas  

Only the mentioned permissions above are present for the role, for any other permission required the customer need to raise a case with Stakater Support team.

## How to request this role from Stakater Support
If customer requires a user to be given saap-customer-cluster-admin role , they can raise a request with Stakater team. Stakater team will add the user to the group and inform customer.
## Items to be provided to Stakater Support
- User Email that needs to be assigned this group