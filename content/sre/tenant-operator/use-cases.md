# Use cases

## Tenant ownership

Bill, the cluster admin, receives a new request from Acme Corp.'s CTO asking for a new tenant to be onboarded and Alice user will be the tenant owner.

Bill creates a new tenant `dev` in the cluster according to the tenant's profile:

```yaml
kubectl create -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: dev
spec:
  users:
    owner:
    - alice@acme.org
  quota: small
  sandbox: false
EOF
```

Bill checks if the new tenant is created and operational:

```bash
kubectl get tenant dev
NAME   STATE    AGE
dev    Active   3m
```

> Note that namespaces are not yet assigned to the new tenant.
> The tenant owners are free to create their namespaces in a self-service fashion
> and without any intervention from Bill.

Once the new tenant `dev` is in place, Bill notifies Alice.

Alice can log in using her credentials and check if she can create a namespace

```bash
kubectl auth can-i create namespaces
yes
```

However, cluster resources are not accessible to Alice

```bash
kubectl auth can-i get namespaces
no

kubectl auth can-i get nodes
no

kubectl auth can-i get persistentvolumes
no
```

including the `Tenant` resources

```bash
kubectl auth can-i get tenants
no
```

### Assign multiple users as tenant owner

In the example above, Bill assigned the ownership of `dev` tenant to `alice` user. If another user, e.g. `Bob` needs to administer the `dev` tenant, Bill can assign the ownership of `dev` tenant to such user too:

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: dev
spec:
  users:
    owner:
    - alice@acme.org
    - bob@acme.org
  quota: small
  sandbox: false
EOF
```

With the configuration above, Bob can log in with his credentials and issue

```bash
kubectl auth can-i create namespaces
yes
```

### Assign users sandbox namespaces

In the example above, Bill assigned the ownership of `dev` tenant to `alice` and `bob`. Now if the users want sandboxes to be made for them by default, than they' wi'll ask `Bill` to switch on `sandbox` in the tenant

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: dev
spec:
  users:
    owner:
    - alice@acme.org
    - bob@acme.org
  quota: small
  sandbox: true
EOF
```

With the configuration above, Alice and Bob new sandboxes will have been created

```bash
kubectl get namespaces
NAME                   STATUS   AGE
dev-alice-sandbox      Active   5d5h
dev-bob-sandbox        Active   5d5h
```

### Assign a robot account as tenant owner

As GitOps methodology is gaining more and more adoption everywhere, it's more likely that an application (Service Account) should act as Tenant Owner. In Tenant-Operator, a Tenant can also be owned by a Kubernetes _ServiceAccount_ identity.

The tenant manifest is modified as in the following:

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: dev
spec:
  users:
    owner:
    - alice@acme.org
    - bob@acme.org
    - system:serviceaccount:development:robot
  quota: small
  sandbox: true
EOF
```

Bill can create a Service Account called `robot`, for example, in the `development` namespace and leave it to act as Tenant Owner of the `dev` tenant

```bash
kubectl --as system:serviceaccount:development:robot can-i create namespaces
yes
```

## Create namespace

Alice, once logged with her credentials, can create a new namespace in her tenant, as simply issuing:

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: oil-production
  labels:
    stakater.com/tenant: dev
```

Alice started the name of the namespace with the name of the tenant in  label: this is a strict requirement., `test`, or `demo`, etc.

When Alice creates the namespace, the Tenant Operator listens for creation and deletion events assigns to Alice the following roles:

If Alice is an admin

```yaml
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev-admin-group
  namespace: oil-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: dev-owner-group
    namespace: oil-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin

```

If Alice is a editor

```yaml
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev-edit-group
  namespace: oil-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: dev-edit-group
    namespace: oil-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit

```

If Alice is a viewer

```yaml
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev-view-group
  namespace: oil-production
subjects:
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: dev-view-group
    namespace: oil-production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: view

```

So lets suppose Alice is the admin of the namespaces:

```bash
kubectl get rolebindings -n oil-production
NAME                ROLE                                    AGE
dev-admin-group     ClusterRole/admin                       12s
```

The said Role Binding resources are automatically created by Tenant Operator when the tenant owner Alice creates a namespace in the tenant.

Alice can deploy any resource in the namespace, according to the predefined
[`admin` cluster role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles).

```bash
kubectl -n oil-production run nginx --image=docker.io/nginx 
kubectl -n oil-production get pods
```

Bill, the cluster admin, can control for example how many configmaps Alices Tenant can create, so bill creates a quota:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Quota
metadata:
  name: small
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
```

Alice can create additional configmaps according to the quota:

```bash
kubectl create configmap oil-production
kubectl create configmap oil-test
```

Once the configmap quota assigned to the tenant has been reached, Alice cannot create further configmaps

```bash
kubectl create configmap oil-training
Error from server (Cannot exceed Namespace quota: please, reach out to the system administrators)
```

The enforcement on the maximum number of namespaces per Tenant is the responsibility of the Capsule controller via its Dynamic Admission Webhook capability.
