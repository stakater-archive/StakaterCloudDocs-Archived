### Creating Tenant

Bill, the cluster admin, receives a new request from Acme Corp.'s CTO asking for a new tenant to be onboarded and Anna will be the tenant owner.

Bill creates a new tenant `bluesky` in the cluster according to the tenant's profile:

```yaml
kubectl create -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@acme.org
  quota: small
  sandbox: false
EOF
```

Bill checks if the new tenant is created and operational:

```bash
kubectl get tenant bluesky
NAME       STATE    AGE
bluesky    Active   3m
```

Once the new tenant `bluesky` is in place, Bill notifies Anna.

Anna can log-in and check if she can create a namespace

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

Including the `Tenant` resources

```bash
kubectl auth can-i get tenants
no
```

### Assign multiple users as tenant owner

In the example above, Bill assigned the ownership of `bluesky` tenant to `Anna` user. If another user, e.g. `Anthony` needs to administer the `bluesky` tenant, Bill can assign the ownership of tenant to such user too:

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@acme.org
    - anthony@acme.org
  quota: small
  sandbox: false
EOF
```

With the configuration above, Anthony can log-in and execute

```bash
kubectl auth can-i create namespaces
yes
```

### Assigning users sandbox namespaces

Bill assigned the ownership of `bluesky` tenant to `Anna` and `Anthony`. Now if the users want sandboxes to be made for them, than they'll ask `Bill` to switch on `sandbox` in the tenant custom resource.

```yaml
kubectl apply -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@acme.org
    - anthony@acme.org
  quota: small
  sandbox: true
EOF
```

With the configuration above, Anna and Anthony new sandboxes will have been created

```bash
kubectl get namespaces
NAME                   STATUS   AGE
bluesky-anna-sandbox      Active   5d5h
bluesky-anthony-sandbox        Active   5d5h
```