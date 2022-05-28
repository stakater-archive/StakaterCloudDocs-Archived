## Creating Tenant

Bill is a cluster admin who receives a new request from Aurora Solutions CTO asking for a new tenant for Anna's team.

Bill creates a new tenant called `bluesky` in the cluster:

```yaml
kubectl create -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@aurora.org
  editors:
    users:
    - john@aurora.org
    groups:
    - alpha
  quota: small
  sandbox: false
EOF
```

Bill checks if the new tenant is created:

```bash
kubectl get tenant bluesky
NAME       STATE    AGE
bluesky    Active   3m
```

Anna can now login to the cluster and check if she can create namespaces

```bash
kubectl auth can-i create namespaces
yes
```

However, cluster resources are not accessible to Anna

```bash
kubectl auth can-i get namespaces
no

kubectl auth can-i get persistentvolumes
no
```

Including the `Tenant` resource

```bash
kubectl auth can-i get tenants
no
```

## Assign multiple users as tenant owner

In the example above, Bill assigned the ownership of `bluesky` to `Anna`. If another user, e.g. `Anthony` needs to administer `bluesky`, than Bill can assign the ownership of tenant to that user as well:

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@aurora.org
    - anthony@aurora.org
  editors:
    users:
    - john@aurora.org
    groups:
    - alpha
  quota: small
  sandbox: false
EOF
```

With the configuration above, Anthony can log-in to the cluster and execute

```bash
kubectl auth can-i create namespaces
yes
```

### Assigning Users Sandbox Namespace

Bill assigned the ownership of `bluesky` to `Anna` and `Anthony`. Now if the users want sandboxes to be made for them, they'll have to ask `Bill` to enable `sandbox` functionality. To enable that, Bill will just set `sandbox: true`

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@aurora.org
    - anthony@aurora.org
  editors:
    users:
    - john@aurora.org
    groups:
    - alpha
  quota: small
  sandbox: true
EOF
```

With the above configuration `Anna` and `Anthony` will now have new sandboxes created

```bash
kubectl get namespaces
NAME                             STATUS   AGE
bluesky-anna-aurora-sandbox      Active   5d5h
bluesky-anthony-aurora-sandbox   Active   5d5h
bluesky-john-aurora-sandbox      Active   5d5h
```

### Creating Namespaces via Tenant Custom Resource

Bill now wants to create namespaces for `dev`, `build` and `production` environments for the tenant members. To create those namespaces Bill will just add those names into the `namespaces` list in the tenant CR.

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@aurora.org
    - anthony@aurora.org
  editors:
    users:
    - john@aurora.org
    groups:
    - alpha
  quota: small
  namespaces:
  - dev
  - build
  - prod
EOF
```

With the above configuration tenant members will now see new namespaces have been created.

```bash
kubectl get namespaces
NAME             STATUS   AGE
bluesky-dev      Active   5d5h
bluesky-build    Active   5d5h
bluesky-prod     Active   5d5h
```

### Distributing common labels and annotations to tenant namespaces via Tenant Custom Resource

Bill now wants to add labels/annotations to all the namespaces for a tenant. To create those labels/annotations Bill will just add them into `namespaceLabels`/`namespaceAnnotations` field in the tenant CR.

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@aurora.org
    - anthony@aurora.org
  editors:
    users:
    - john@aurora.org
    groups:
    - alpha
  quota: small
  namespaces:
  - dev
  - build
  - prod
  namespaceLabels:
    app.kubernetes.io/managed-by: tenant-operator
    app.kubernetes.io/part-of: tenant-alpha
  namespaceAnnotations:
    openshift.io/node-selector: node-role.kubernetes.io/infra=
EOF
```

With the above configuration all tenant namespaces will now contain the mentioned labels and annotations.

### What’s next

See how Anna can create [namespaces](./namespace.html)
