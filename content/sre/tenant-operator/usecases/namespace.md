### Creating Namespace

Anna, can create a new namespace in her tenant, as simply issuing:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: bluesky-production
  labels:
    stakater.com/tenant: bluesky
```

**Note:**
Anna is required to add tenant label **stakater.com/tenant: bluesky** which contains the tenant name e.g. *bluesky*, while creating the namespace. If label is not added or the user does not belong to the tenant, then Tenant Operator will not allow the creation of the namespace.

When Anna creates the namespace, Tenant Operator listens for creation events assigns Anna the following roles based on her user type:

If Anna is an owner

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

If Anna is a editor

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

If Anna is a viewer

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

As Anna is an owner, that's why she is able to create namespaces.

The said Role Binding resources are automatically created by Tenant Operator when the tenant owner Anna creates a namespace in the tenant.

Anna can deploy any resource in the namespace, according to the predefined
[`admin` cluster role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles).

```bash
kubectl -n bluesky-production run nginx --image=docker.io/nginx 
kubectl -n bluesky-production get pods
```

Bill, the cluster admin, can control for example how many cpu and memory resources Annas Tenant can consume, so bill creates a quota:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Quota
metadata:
  name: small
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    services.loadbalancers: "2"
```

Anna can create additional configmaps according to the quota:

```bash
kubectl create pods oil-production
kubectl create pods oil-test
```

Once the resource quota assigned to the tenant has been reached, Anna cannot create further resources

```bash
kubectl create pods oil-training
Error from server (Cannot exceed Namespace quota: please, reach out to the system administrators)
```
