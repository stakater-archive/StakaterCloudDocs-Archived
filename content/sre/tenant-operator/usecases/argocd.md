### Creating ArgoCD appProjects for your tenant

Bill wants each tenant to also have their own ArgoCD AppProjects. To Make sure this happens correctly, Bill will first specify the namespace where these AppProjects will in the Integration Config:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  argocd:
    namespace: openshift-operators
```

Afterwards, Bill must specify the source gitops repos for the tenant inside the tenant CR like so:

```yaml
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: bluesky
spec:
  argocd:
    sourceRepos:
      - https://github.com/stakater/gitops-config
```

Now Bill can see an AppProject will be created for the tenant

```bash
oc get AppProject -A
NAMESPACE             NAME                 AGE
openshift-operators   bluesky              5d15h
```

### Prevent ArgoCD from syncing certain resources

Bill wants tenants to not be able to sync `ResourceQuota` and `LimitRange` resources to their namespaces. To do this correctly, Bill will specify these resources to blacklist in the ArgoCD portion of the Integration Config's Spec:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: stakater-tenant-operator
spec:
  argocd:
    namespace: openshift-operators
    namespaceResourceBlacklist:
    - group: ''
      kind: ResourceQuota
    - group: ''
      kind: LimitRange
```

Now, if these resources are added to any tenant's project directory in gitops, ArgoCD will not sync them to the cluster.