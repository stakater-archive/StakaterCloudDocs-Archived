# Integration Config

Integration config is used to configure settings of muti-tenancy for tenant operator.

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  openshift:
    annotations:
      project:
        openshift.io/node-selector: node-role.kubernetes.io/worker=
    labels:
      group:
        role: customer-reader
      project:
        workload-monitoring: 'true'
  rhsso:
    enabled: true
    endpoint:
      secretReference:
        name: auth-secrets
        namespace: openshift-auth
      url: >-
        https://iam-keycloak-auth.apps.prod.abcdefghi.kubeapp.cloud/
  vault:
    enabled: true
    endpoint:
      secretReference:
        name: vault-root-token
        namespace: vault
      url: >-
        https://vault.apps.prod.abcdefghi.kubeapp.cloud/
    sso:
      accessorID: auth_oidc_aa6aa9aa
      clientName: vault
  clusterAdminGroups:
    - cluster-admins
  managedNamespacePrefixes:
    - default
    - openshift
    - stakater
    - kube
  managedServiceAccountPrefixes:
    - 'system:serviceaccount:openshift'
    - 'system:serviceaccount:stakater'
    - 'system:serviceaccount:kube'
  namespaceAccessPolicy:
    deny:
      managedNamespaces:
        groups:
          - cluster-admins
        users:
          - system:serviceaccount:openshift-argocd:argocd-application-controller
          - adam@stakater.com
```

Following are the different components that can be used to configure multi-tenancy in a cluster via tenant operator.

## Openshift

We can use `openshift.annotations` and `openshift.labels` to automatically add `labels` and `annotations` to  **Openshift.Projects** and **Openshift.Groups** which are managed via `tenant operator`.

```yaml
openshift:
  annotations:
    project:
      openshift.io/node-selector: node-role.kubernetes.io/worker=
  labels:
    group:
      role: customer-reader
    project:
      workload-monitoring: 'true'
```

Whenever a project is made it will have the labels and annotations as mentioned above.

```yaml
kind: Project
apiVersion: project.openshift.io/v1
metadata:
  name: bluesky-build
  annotations:
    openshift.io/node-selector: node-role.kubernetes.io/worker=
  labels:
    workload-monitoring: 'true'
    stakater.com/tenant: bluesky
spec:
  finalizers:
    - kubernetes
status:
  phase: Active
```

```yaml
kind: Group
apiVersion: user.openshift.io/v1
metadata:
  name: bluesky-owner-group
  labels:
    role: customer-reader
users:
  - andrew@stakater.com
```

## RHSSO (Red Hat Single Sign-On)

Red Hat Single Sign-On [RHSSO](https://access.redhat.com/products/red-hat-single-sign-on) is based on the Keycloak project and enables you to secure your web applications by providing Web single sign-on (SSO) capabilities based on popular standards such as SAML 2.0, OpenID Connect and OAuth 2.0.

If `RHSSO` is configured on a cluster, than RHSSO configuration can be enabled.

```yaml
rhsso:
  enabled: true
  endpoint:
    secretReference:
      name: auth-secrets
      namespace: openshift-auth
    url: https://iam-keycloak-auth.apps.prod.abcdefghi.kubeapp.cloud/
```

If enabled, than admins have to provide secret and URL of RHSSO.

- `secretReference.name:` Will contain the name of the secret.
- `secretReference.namespace:` Will contain the namespace of the secret.
- `url:` Will contain the URL of RHSSO.

## Vault

[Vault](https://www.vaultproject.io/) is used to secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API.

If `vault` is configured on a cluster, than vault configuration can be enabled.

```yaml
vault:
  enabled: true
  endpoint:
    secretReference:
      name: vault-root-token
      namespace: vault
    url: >-
      https://vault.apps.prod.abcdefghi.kubeapp.cloud/
  sso:
    accessorID: auth_oidc_aa6aa9aa
    clientName: vault
```

If enabled, than admins have to provide secret, URL and sso accessorID of vault.

- `secretReference.name:` Will contain the name of the secret.
- `secretReference.namespace:` Will contain the namespace of the secret.
- `url:` Will contain the URL of vault.
- `sso.accessorID:` Will contain the sso accessorID.
- `sso.clientName:` Will contain the clientname.

## Cluster Admin Groups

`clusterAdminGroups:` Contains `group` names which Tenant Operator will ignore during CRUD operation of namespaces(but a valid tenant label must be present).

## Managed Namespace Prefixes

`managedNamespacePrefixes:` Contains namespace prefixes which Tenant Operator will ignore.

## Managed ServiceAccount Prefixes

`managedServiceAccountPrefixes:` Contains ServiceAccount prefixes which Tenant Operator will ignore during namespace CRUD operation

## Namespace Access Policy

`namespaceAccessPolicy.Deny:` Can be used to restrict privileged *users/groups* CRUD operation over managed namespaces.

```yaml
namespaceAccessPolicy:
  deny:
    managedNamespaces:
      groups:
        - cluster-admins
      users:
        - system:serviceaccount:openshift-argocd:argocd-application-controller
        - adam@stakater.com
```
