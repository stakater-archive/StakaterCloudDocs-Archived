# Roles in SAAP

Depending on responsibilities of a role, specific roles can be assigned to user groups, which enable them to achieve there daily tasks. Below is a list of roles provided by SAAP for different user groups

Namespaces are divided into two sub-categories:

- **Stakater owned** : created by the Stakater team , consist of projects/namespaces with format openshift*,stakater*,kube*,redhat*,default
- **Customer owned** : created by the customer
- 
## 1.SAAP Cluster Admin (SCA)

SAAP Cluster Admin (SCA):

###  Operators Permissions:
- can view OperatorHub in console
- can create/view/delete CRs for [curated operators](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) e.g.
  - AMQ Certificate Manager Operator
  - Openshift Pipelines Operator
- can install operators from a [curated list](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) provided by the OperatorHub. This makes the operator available to all developers on your cluster to create Custom Resources and applications using that Operator.
- can view installed operators from a selected namespace by using the web console/CLI
- can not install privileged and custom operators

###  Projects Permissions:
- can create/view/edit/delete all resources in customer owned namespaces
- can only view resources in Stakater owned namespaces

### Storage
- can not view information about nodes and PVs in the cluster, as this is managed by the stakater team
- cant not delete storage classes

### Networking
- can create/view/delete NetworkPolicy objects
- can view routes in all namespaces
- can view/update dns resources for DNS Forwarder apigroups
- can not view/create/delete ingresses in Managed Projects/Namespaces 

### Monitoring
- can view openshift haproxy router metrics
- can view monitoring web applications
- can view customer owned 

### Compute
- can view machines and machinesets
- can crete/view/delete project.config.openshift.io CR
- can start anyuid and nonroot SSCs
- can not view nodes, machine configs, machine config pools, imagestreams
- can not delete machines, machinesets

###  User Management
- can view users/groups
- can view service accounts/roles/role bindings in customer owned namespaces
- can create/view/delete on UserIdentityMappings
- can create/verify tokens and access
- can not view service accounts/roles/role bindings in Stakater owned namespaces 

### Administration:
- can create/edit/delete resource quotas and limits on the cluster
- can access the reserved ‘saap-customer-admin’ project on the cluster, which allows for the creation of ServiceAccounts with elevated privileges and gives the ability to update default limits and quotas for projects on the cluster
- create/edit/delete clusterresourcequotas  

Only the mentioned permissions above are present for the role, for any other permission required the user need to raise a case with Stakater Support team.

## How to request this role from Stakater Support
If any user needs to be given saap-cluster-admin role , they can raise a request with Stakater team to assign the desired role to that user.

## Items to be provided to Stakater Support
- User Email that needs to be assigned this group
