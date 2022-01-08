### Enforcing Resources Quotas

With Tenant Operator, Bill, the cluster admin, can set and enforce resources quota and limits for Anna's tenant.

### Assigning Resources Quotas

Bill first creates a resource quota, in which he sets the maximum resource limits that Anna's tenant will have.

```yaml
kubectl create -f - << EOF
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
EOF
```

For more details please refer [Quotas](https://docs.cloud.stakater.com/content/sre/tenant-operator/customresources.html#_1-quota).

```bash
kubectl get quota small
NAME       STATE    AGE
small      Active   3m
```

Once quota has been created, Bill will then proceed to create a tenant for Anna. Bill also links the newly created `quota`.

```yaml
kubectl create -f - << EOF
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@stakater.com
  quota: small
  sandbox: false
EOF
```

Quota is now linked with Anna's tenant, now Anna can create any resource.

```bash
kubectl -n bluesky-production create deployment nginx --image nginx:latest --replicas 4
```

Once the resource quota assigned to the tenant has been reached, Anna cannot create further resources

```bash
kubectl create pods bluesky-training
Error from server (Cannot exceed Namespace quota: please, reach out to the system administrators)
```

### What’s next

See how Bill, the cluster admin, can create tenants. [Enforce Pod Priority Classes](/docs/operator/use-cases/pod-priority-classes)
