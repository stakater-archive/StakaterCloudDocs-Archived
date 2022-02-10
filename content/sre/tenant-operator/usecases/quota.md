# Enforcing Resources Quotas

Using Tenant-Operator, the cluster-admin can set and enforce resource quotas and limits for tenants.

## Assigning Resource Quotas

Bill is a cluster admin who will first creates a resource quota where he sets the maximum resource limits that Anna's tenant will have.

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

For more details please refer to [Quotas](../customresources.html#_1-quota).

```bash
kubectl get quota small
NAME       STATE    AGE
small      Active   3m
```

Bill then proceeds to create a tenant for Anna, while also linking the newly created `quota`.

```yaml
kubectl create -f - << EOF
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  owners:
    users:
    - anna@stakater.com
  quota: small
  sandbox: false
EOF
```

Now that the quota is linked with Anna's tenant, Anna can create any resource.

```bash
kubectl -n bluesky-production create deployment nginx --image nginx:latest --replicas 4
```

Once the resource quota assigned to the tenant has been reached, Anna cannot create further resources.

```bash
kubectl create pods bluesky-training
Error from server (Cannot exceed Namespace quota: please, reach out to the system administrators)
```

## What’s next

See how Bill can create [tenants](./tenant.html)
