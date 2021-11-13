# Roles

## SAAP Cluster Admin

![image](./images/tenant-operator-sca-overview.png)
fig 1. Shows how SAAP Cluster Admin manages tenants using Tenant Operator

SAAP Cluster Admin are admins of a cluster. They are responsible for the configuration and maintainance of tenants and quotas. More more details [SAAP ClusterAdmin](https://docs.cloud.stakater.com/content/sre/authentication-authorization/saap-authorization-roles.html#_1-saap-cluster-admin-sca)

## Owner

![image](./images/tenant-operator-owner-overview.png)
fig 2. Shows how tenant owners manage there tenant using Tenant Operator

Owner role will have admin access on there namespaces and they can also create new namespaces.

### Access Permissions

* Role and Cluster RoleBindings access in `Project` :
  * delete
  * create
  * list
  * get
  * update
  * patch

### Quotas Permissions

* Limitranges and resourcequotas access in `Project`
  * get
  * list
  * watch

* daemonsets access in `Project`
  * create
  * delete
  * get
  * list
  * patch
  * update
  * watch

### Resources Permissions

* CRUD access on template, template instance and template group instance of Tenant Operator custom resources
* CRUD access on imagestreamtags in `Project`
* Get access on customresourcedefinitions in `Project`
* Get, list, watch access on builds,buildconfigs in `Project`
* CRUD access on following resources in `Project`:
  * prometheuses
  * prometheusrules
  * servicemonitors
  * podmonitors
  * thanosrulers
* Permission to create namespaces.
* Restricted to perform actions on cluster resource quotas and limits.

*Owners will also inhert roles from `Edit` and `View`.

## Edit

![image](./images/tenant-operator-edit-overview.png)
fig 3. Shows editors role in a tenant using Tenant Operator

Edit role will have edit access on there namespaces + except for Role and RoleBinding

## View

![image](./images/tenant-operator-view-overview.png)
fig 4. Shows viewers role in a tenant using Tenant Operator

view role will have view access on there namespace
