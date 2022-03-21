# Tenant-Operator Features


## Access Control

RBAC is one of the most complicated and error-prone parts of Kubernetes. With Tenant-Operator, you can rest assured that RBAC is configured with a "least privilege" mindset and all rules are kept up-to-date with zero manual effort.

Tenant-Operator provides several ClusterRoles that are automatically bound to the Tenants Namespaces used for managing access to the Namespaces and the resources they contain. You can also modify  the default roles or create new roles to have full control and customize access control for your users and teams.

Tenant-Operator also is able to leverage existing OpenShift groups or external groups synced from 3rd party identity management system for maintaining Tenant membership in your organizations current user management system. 

## Self-Service

With Tenant-Operator, you can empower your users to safely provision namespaces for themselves and their teams (typically mapped to SSO groups). Team-owned namespaces and the resources inside of them count towards the team's quotas rather than the user's individual limits and are automatically shared with all team members according to the access rules you configure in tenant-operator.

Also by leveraging Tenant-Operators templating mechanism, namespaces can be provisioned and automatically pre populated with any kind of resource or multiple resources such as network policies, docker pull secrets or even Helm charts etc 

## HashiCorp Vault Multi Tenancy

Tenant-Operator is not only providing strong Multi Tenanacy for the OpenShift internals but also extends the tenants permission model to HashiCorp Vault where it can create vault paths and greatly ease the overhead of managing RBAC in Vault.

## ArgoCD Multitenancy 

Tenant-Operator is not only providing strong Multi Tenanacy for the OpenShift internals but also extends the tenants permission model to ArgoCD were it can provision AppProjects and Allowed Repositories for your tenants greatly ease the overhead of managing RBAC in ArgoCD.

## Cost/Resource Optimization 

Tenant-Operator provides a mechanism for defining Resource Quotas at the tenant scope, meaning all namespaces belonging to a particular tenant share the defined quota, which is why you are able to safely enable dev teams to self serve their namespaces whilst being confident that they can only use the resources allocated based on budget and business needs.

## Sandboxed Dev spaces

Tenant-Operator can be configured to automatically provision a namespace for every member of the specific tenant, that will also be pre loaded with any selected templates and consume the same pool of resources from the tenants quota creating safe sandboxed dev spaces that teams can use as scratch space for rapid prototyping and development. 

## Templates and Template distribution

Tenant-operator allows admins/users to define templates for namespaces, so that others can instantiate these templates to provision namespaces with batteries loaded. A template could pre-populate a namespace for certain use cases or with basic tooling required. Templates allow you to define Kubernetes manifests, Helm chart and more to be applied when the template is used to create a Space.

Tenant-operator even allows to parameterize these templates for flexibility and ease of use and also with the option to enforce templates that must be present in a tenants or all tenants namespaces for configuring secure defaults. 
 
## Everything as Code/GitOps Ready

Tenant-Operator is designed and built to be 100% OpenShift native and to be configured and managed the same familiar way as native OpenShift resources so is perfect for modern shops that are dedicated to GitOps as it is fully configurable using Custom Resources 

