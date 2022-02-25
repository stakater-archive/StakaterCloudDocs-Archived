# Configuring Managed Namespaces and ServiceAccounts in IntegrationConfig

Bill is a cluster admin who can use `IntegrationConfig` to configure how `Tenant-Operator` manages the cluster.

By default, Tenant-Operator watches all namespaces and will enforce all the governing policies on them.

```bash
oc create namespace stakater-test
Error from server (Cannot Create namespace stakater-test without label stakater.com/tenant. User: Bill): admission webhook "vnamespace.kb.io" denied the request: Cannot CREATE namespace stakater-test without label stakater.com/tenant. User: Bill
```

If Bill wants to ignore namespaces like `default`, or namespaces with prefixes like `openshift`, `kube`, then Bill would simply add them in integration config like:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  openshift:
    privilegedNamespaces:
      - default
      - ^openshift*
      - ^kube*
```

After setting `privilegedNamespaces`, Bill can create namespaces without interference.

```bash
oc create namespace stakater-test
namespace/stakater-test created
```

Tenant-Operator will also disallow all users which are not tenant owners to perform CRUD operation on namespaces. This will also prevent Service Accounts from performing CRUD operations.

If Bill wants Tenant-Operator to ignore Service Accounts, than Bill would simply have to add them in integration config:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  openshift:
    privilegedServiceAccounts:
      - system:serviceaccount:openshift
      - system:serviceaccount:stakater
      - system:serviceaccount:kube
      - system:serviceaccount:redhat
      - system:serviceaccount:hive
```

Bill can also use regex patterns to ignore a set of service accounts:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  openshift:
    privilegedServiceAccounts:
      - ^system:serviceaccount:openshift*
      - ^system:serviceaccount:stakater*
```

## Configuring Vault in IntegrationConfig

[Vault](https://www.vaultproject.io/) is used to secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API.

If Bill the cluster admin has vault configured in his cluster, than he can take benefit from Tenant-Operators integration with vault.

Tenant-Operator automatically creates Vault secret paths for tenants where tenant members can securely save their secrets and also authorizes tenant members to access these secrets via OIDC.

Bill would first have to integrate Vault with Tenant-Operator by adding the details in integrationConfig. For more [details](../integration-config.html#vault)

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
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

Bill then creates a tenant for Anna and John

```yaml
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@acme.org
  viewers:
    users:
    - john@acme.org
  quota: small
  sandbox: false
```

Now Bill goes to `Vault` and sees that a path for `tenant` has been made under the name `bluesky/kv`, confirming that Tenant members with the Owner or Edit roles now have access to the tenant's Vault path.

Now if Anna sign's in to the vault via OIDC, she can see her tenants path and secrets. Whereas if John sign's in to the vault via OIDC, he can't see his tenants path or secrets as he doesn't have the access required to view them.

## Configuring RHSSO (Red Hat Single Sign-On) in IntegrationConfig

Red Hat Single Sign-On [RHSSO](https://access.redhat.com/products/red-hat-single-sign-on) is based on the Keycloak project and enables you to secure your web applications by providing Web single sign-on (SSO) capabilities based on popular standards such as SAML 2.0, OpenID Connect and OAuth 2.0.

If Bill the cluster admin has RHSSO configured in his cluster, than he can take benefit from Tenant-Operator's integration with RHSSO and Vault.

Tenant-Operator automatically allows tenant members to access vault via OIDC(RHSSO authentication and authorization) to access secret paths for tenants where tenant members can securely save their secrets.

Bill would first have to integrate RHSSO with Tenant-Operator by adding the details in integration config. [Visit here](../integration-config.html#rhsso-red-hat-single-sign-on) for more details.

```yaml
rhsso:
  enabled: true
  endpoint:
    secretReference:
      name: auth-secrets
      namespace: openshift-auth
    url: https://iam-keycloak-auth.apps.prod.abcdefghi.kubeapp.cloud/
```

## What’s next

See how Bill can create [ArgoCD AppProjects](./argocd.html) for their tenants
