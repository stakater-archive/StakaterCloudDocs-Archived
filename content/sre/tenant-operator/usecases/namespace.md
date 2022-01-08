### Creating Namespace

Anna as the tenant owner can create new namespaces for her tenant.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: bluesky-production
  labels:
    stakater.com/tenant: bluesky
```

**Note:**
Anna is required to add tenant label **stakater.com/tenant: bluesky** which contains the name of her tenant e.g. *bluesky*, while creating the namespace. If label is not added or the user does not belong to the tenant, then Tenant Operator will not allow the creation of that namespace.

When Anna creates the namespace, Tenant Operator assigns Anna and other tenant members the following roles based on their user type:

Role for tenant owners

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: bluesky-admin-group
  namespace: bluesky-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: bluesky-owner-group
    namespace: bluesky-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin
```

Role for tenant editors

```yaml
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: bluesky-edit-group
  namespace: bluesky-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: bluesky-edit-group
    namespace: bluesky-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit

```

Role for tenant viewers

```yaml
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: bluesky-view-group
  namespace: bluesky-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: bluesky-view-group
    namespace: bluesky-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: view

```

As Anna is a tenant owner, that's why she is able to create namespaces.

The said Role Binding resources are automatically created by Tenant Operator when Anna creates a namespace in the tenant.

Anna can deploy any resource in the namespace, according to the predefined
[`admin` cluster role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles).
