# Add new tenant

To onboard a new tenant in gitops structure, you need to do following.

We broadly categorize tenants into two types:

1. application tenants: tenants who build and delivery applications
2. sre|delivery-engineering|devops tenant: team responsible to onboard other tenants; usually we recomend only one such tenant

Adding new tenant can be divided into parts

1. Create folders with `.gitkeep` files
2. Create `tenant` and `argocd` files

## Step 1 - Create folders

Here are the steps to create folders per tenant:

- Step 1: Create folder at the root of `gitops` repository with `tenant` name
- Step 2: Create `configs` folder inside `tenant` folder
- Step 3: Create folder per environment in `configs` folder
- Step 4: Create `argocd` folder in environment folder

It will look like following:

- /\<tenant>
- /\<tenant>/configs
- /\<tenant>/configs/\<01-env>/argocd
- /\<tenant>/configs/\<02-env>/argocd
- /\<tenant>/configs/\<n-env>/argocd

Replace angle brackets with following values in below templates:
  - \<tenant> : Name of the tenant
  - \<env>:  Name of the tenant
  - \<quota>: Name of the quota
  - \<gitops-config>: gitops-config repo URL

Once these folders are created; add following files

## Step 2 - Create files

Templates for the files:

### 1. Per Environment

#### Create namespace per environment

Add namespace configuration for **each** environment

- /\<tenant>/configs/\<env>/\space.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <tenant>-<environment>
  labels:
    stakater.com/tenant: <tenant>
    kind: <environment>
```

#### Create argocd project and application per environment

Create argocd project and argocd application per environment that will watch folder inside `\<tenant>/\<config>/\<argocd>` that in turn going to deploy application in particular environment

Add this file for **each** environment

- \<sre>/\<cluster>/\<env>/\<tenant>.yaml
``` yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: <tenant>-<env>
  namespace: openshift-stakater-argocd
spec:
  description: <tenant> team
  # Allow manifests to deploy from any Git repos
  sourceRepos:
  - '*'
  destinations:
  - namespace: "<tenant>-<env>"
    server: https://kubernetes.default.svc
  clusterResourceWhitelist:
  - group: "*"
    kind: "*"
---
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: gabbar-dev
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: openshift-stakater-argocd
    server: 'https://kubernetes.default.svc'
  source:
    path: <tenant>/configs/<env>/
    repoURL: <gitops-config>
    targetRevision: HEAD
    directory:
       recurse: true
  project: <tenant>-<env>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### 2. Per Tenant

### Create tenant

Add tenants configuration inside sre tenant configuration

- \<sre>/\<cluster>/tenant-operator/tenants/\<tenant>.yaml

``` yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: <tenant>
spec:
  owners:
    users:
      - <user-1>
    groups:
      - <group-1>
  editors:
    users:
      - <user-2>
  viewers:
    users:
      - <user-n>
  quota: <quota>
```

For more details please refer [custom-resources](../tenant-operator/customresources.html#_2-tenant)
