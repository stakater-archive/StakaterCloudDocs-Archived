# Integration Config

Integration config is used to configure settings of multi-tenancy for tenant operator.

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  openshift:
    project:
      labels:
        stakater.com/workload-monitoring: "true"
      annotations:
        openshift.io/node-selector: node-role.kubernetes.io/worker=
    group:
      labels:
        role: customer-reader
    sandbox:
      labels:
        stakater.com/kind: sandbox
    clusterAdminGroups:
      - cluster-admins
    privilegedNamespaces:
      - default
      - ^openshift-*
      - ^kube-*
    privilegedServiceAccounts:
      - ^system:serviceaccount:openshift-*
      - ^system:serviceaccount:kube-*
    namespaceAccessPolicy:
      deny:
        privilegedNamespaces:
          users:
            - system:serviceaccount:openshift-argocd:argocd-application-controller
            - adam@stakater.com
          groups:
            - cluster-admins
  argocd:
    namespace: openshift-operators
    namespaceResourceBlacklist:
      - group: '' # all groups
        kind: ResourceQuota
    clusterResourceWhitelist:
      - group: tronador.stakater.com
        kind: EnvironmentProvisioner
  rhsso:
    enabled: true
    endpoint:
      url: https://iam-keycloak-auth.apps.prod.abcdefghi.kubeapp.cloud/
      secretReference:
        name: auth-secrets
        namespace: openshift-auth
  vault:
    enabled: true
    endpoint:
      url: https://vault.apps.prod.abcdefghi.kubeapp.cloud/
      secretReference:
        name: vault-root-token
        namespace: vault
    sso:
      clientName: vault
      accessorID: <ACCESSOR_ID_TOKEN>
```

Following are the different components that can be used to configure multi-tenancy in a cluster via tenant operator.

## Openshift
``` yaml
openshift:
  project:
    labels:
      stakater.com/workload-monitoring: "true"
    annotations:
      openshift.io/node-selector: node-role.kubernetes.io/worker=
  group:
    labels:
      role: customer-reader
  sandbox:
    labels:
      stakater.com/kind: sandbox
  clusterAdminGroups:
    - cluster-admins
  privilegedNamespaces:
    - default
    - ^openshift-*
    - ^kube-*
  privilegedServiceAccounts:
    - ^system:serviceaccount:openshift-*
    - ^system:serviceaccount:kube-*
  namespaceAccessPolicy:
    deny:
      privilegedNamespaces:
        users:
          - system:serviceaccount:openshift-argocd:argocd-application-controller
          - adam@stakater.com
        groups:
          - cluster-admins
```

### Project, group and sandbox
We can use the `openshift.project`, `openshift.group` and `openshift.sandbox` fields to automatically add `labels` and `annotations` to  the **Projects** and **Groups** managed via `tenant operator`.

```yaml
  openshift:
    project:
      labels:
        stakater.com/workload-monitoring: "true"
      annotations:
        openshift.io/node-selector: node-role.kubernetes.io/worker=
    group:
      labels:
        role: customer-reader
    sandbox:
      labels:
        stakater.com/kind: sandbox
```

If we want to add default *labels/annotations* to sandbox namespaces of tenants than we just simply add them in `openshift.project.labels`/`openshift.project.annotations` respectively.

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

### Cluster Admin Groups

`clusterAdminGroups:` Contains names of the groups that are allowed to perform CRUD operations on namespaces present on the cluster. Users in the specified group(s) will be able to perform these operations without the tenant-operator getting in their way

### Privileged Namespaces

`privilegedNamespaces:` Contains the list of `namespaces` ignored by the tenant-operator. The tenant-operator will not manage the `namespaces` in this list. Values in this list can also have regex patterns. For example, to ignore all `namespaces` starting with `openshift-`, we can use `^openshift-*`

### Privileged ServiceAccounts

`privilegedServiceAccounts:` Contains the list of `ServiceAccounts` ignored by the tenant-operator. The tenant-operator will not manage the `ServiceAccounts` in this list. Values in this list can also have regex patterns. For example, to ignore all `ServiceAccounts` starting with `system:serviceaccount:openshift-`, we can use `^system:serviceaccount:openshift-*`

### Namespace Access Policy

`namespaceAccessPolicy.Deny:` Can be used to restrict privileged *users/groups* CRUD operation over managed namespaces.

```yaml
namespaceAccessPolicy:
  deny:
    privilegedNamespaces:
      groups:
        - cluster-admins
      users:
        - system:serviceaccount:openshift-argocd:argocd-application-controller
        - adam@stakater.com
```

## ArgoCD

### Namespace

`argocd.namespace` is an optional field used to specify the namespace where argocd applications and app projects are deployed. The field should be populated when you want to create an ArgoCD AppProject for each tenant

### NamespaceResourceBlacklist

```yaml
argocd:
  namespaceResourceBlacklist:
  - group: '' # all resource groups
    kind: ResourceQuota
  - group: ''
    kind: LimitRange
  - group: ''
    kind: NetworkPolicy
```

`argocd.namespaceResourceBlacklist` prevents ArgoCD from syncing the listed resources from your gitops repo.

### ClusterResourceWhitelist:

```yaml
argocd:
  clusterResourceWhitelist:
  - group: tronador.stakater.com
    kind: EnvironmentProvisioner
```

`argocd.clusterResourceWhitelist` allows ArgoCD to sync the listed cluster scoped resources from your gitops repo.

## RHSSO (Red Hat Single Sign-On)

Red Hat Single Sign-On [RHSSO](https://access.redhat.com/products/red-hat-single-sign-on) is based on the Keycloak project and enables you to secure your web applications by providing Web single sign-on (SSO) capabilities based on popular standards such as SAML 2.0, OpenID Connect and OAuth 2.0.

If `RHSSO` is configured on a cluster, then RHSSO configuration can be enabled.

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

If `vault` is configured on a cluster, then vault configuration can be enabled.

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
    accessorID: <ACCESSOR_ID_TOKEN>
    clientName: vault
```

If enabled, than admins have to provide secret, URL and sso accessorID of vault.

- `secretReference.name:` Will contain the name of the secret.
- `secretReference.namespace:` Will contain the namespace of the secret.
- `url:` Will contain the URL of vault.
- `sso.accessorID:` Will contain the sso accessorID.
- `sso.clientName:` Will contain the client name.

For more details please refer [use-cases](./usecases/integrationconfig.html)
