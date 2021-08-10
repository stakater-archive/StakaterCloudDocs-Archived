# Authorization Roles for SAAP

Depending on responsibilities of a role, specific roles can be assigned to user groups, which enable them to achieve there daily tasks. Below is a list of roles provided by SAAP for different user groups
Namespaces are divided into two sub-categories
- **Managed Projects/Namespaces** : managed by the stakater team , consist of projects/namespaces with format openshift*,stakater*,kube*,redhat*,default
- **Non-Managed Projects/Namespaces** : created by Users
## 1.SAAP Cluster Admin (SCA)

SAAP Cluster Admin (SCA) can:
###  Operators Permissions:
- view OperatorHub in console
- create/view/delete CRs for [curated operators](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) e.g.
  - AMQ Certificate Manager Operator
  - Openshift Pipelines Operator
- install Operators from a [curated list](https://docs.cloud.stakater.com/content/sre/authentication-authorization/curated-list-operators.html) provided by the OperatorHub. This makes the Operator available to all developers on your cluster to create Custom Resources and applications using that Operator.
- not install Privileged and custom Operators
- view installed Operators from a selected namespace by using the web console/CLI.
###  Projects Permissions:
- create/view/edit/delete all resource in all Non-Managed projects/namespaces on the cluster
- view all resources in Managed Projects/Namespaces
### Storage
- create/view/delete quotas and limits on the cluster
- not view information about nodes and PVs in the cluster, as this is managed by the stakater team
- not delete Storage Class
### Networking
- create/view/delete NetworkPolicy objects
- view routes in all projects
- not view/create/delete ingresses in Managed Projects/Namespaces 
- view/update dnses resource for DNS Forwarder apigroups
### Monitoring
- view openshift haproxy router metrics
- view monitoring web applications
- view project/namespaces status Non-Managed Projects/Namespaces
### Compute
- view  machines, machinesets
- not view Nodes,machine configs, machine config pools,imagestreams
- not delete machines,machinesets
- crete/view/delete project.config.openshift.io CR
- start anyuid and nonroot SSCs
###  User Management
- view Users/Groups
- view Service Accounts/Roles/Role Bindings in Non-Managed Namespaces/Projects
- not view Service Accounts/Roles/Role Bindings in Managed Namespaces/Projects 
- create/view/delete on UserIdentityMappings
- create/verify tokens and access
### Administration:
- create/edit/delete resource quotas and limits on the cluster
- access the reserved ‘saap-customer-admin’ project on the cluster, which allows for the creation of ServiceAccounts with elevated privileges and gives the ability to update default limits and quotas for projects on the cluster
- create/edit/delete clusterresourcequotas  

Only the mentioned permissions above are present for the role, for any other permission required the user need to raise a case with Stakater Support team.

## How to request this role from Stakater Support
If any user needs to be given saap-cluster-admin role , they can raise a request with Stakater team to assign the desired role to that user.
## Items to be provided to Stakater Support
- User Email that needs to be assigned this group