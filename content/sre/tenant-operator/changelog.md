# Changelog

## 0.3.13

### Changes

- Tenant Operator now creates a default Integration Config if one is not found by it. Default Integration Config will not restrict any namespace to be managed by Tenant Operator.

## 0.3.12

### Changes

- General enhancements and improvements

## 0.3.11

### Changes

- Fix Quota's conversion webhook converting the wrong LimitRange field

## 0.3.10

### Changes

- Fix Quota's LimitRange to its intended design by being an optional field

## 0.3.9

### Changes

- Add ability to prevent certain resources from syncing via ArgoCD

## 0.3.8

### Changes

- Add default annotation to OpenShift Projects that show description about the Project

## 0.3.7

### Changes

- Fix a typo in Tenant Operator's helm release

## 0.3.6

### Changes

- Fix ArgoCD's `destinationNamespaces` created by Tenant Operator

## 0.3.5

### Changes

- Change sandbox creation from 1 for each group to 1 for each user in a group

## 0.3.4

### Changes

- Support creation of sandboxes for each group

## 0.3.3

### Changes

- Add ability to create namespaces from a list of namespace prefixes listed in the Tenant CR

## 0.3.2

### Changes

- Restructure Quota CR, more details in [relevant docs](./customresources.html#_1-tenant)
- Add support for adding LimitRanges in Quota
- Add conversion webhook to convert existing v1alpha1 versions of quota to v1beta1

## 0.3.1

### Changes

- Add ability to create ArgoCD AppProjects per tenant, more details in [relevant docs](./argocd.html)

## 0.3.0

### Changes

- Add support to add groups in addition to users as tenant members

## 0.2.33

### Changes

- Restructure Tenant spec, more details in [relevant docs](./customresources.html#_2-tenant)
- Add conversion webhook to convert existing v1alpha1 versions of tenant to v1beta1

## 0.2.32

### Changes

- Restructure integration config spec, more details in [relevant docs](./integration-config.html)
- Allow cluster admins to perform CRUD operations on namespaces that don't have tenant label
- Allow users to input custom regex in certain fields inside of integration config, more details in [relevant docs](./integration-config.html#openshift)

## 0.2.31

### Changes

- Add limit range for kube-rbac-proxy
