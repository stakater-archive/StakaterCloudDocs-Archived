# Add new tenant

To onborad a new tenant in gitops structure, you need to do following

Create new folder at the root of repository with tenant name then create config folder for that tenant. Inside config folder add environment folder for **each** environment.

Create following folders:

- /\<tenant>
- /\<tenant>/configs
- /\<tenant>/configs/\<01-env>/argocd
- /\<tenant>/configs/\<02-env>/argocd
- /\<tenant>/configs/\<n-env>/argocd

Replace angle brackets with following values in below templates:
  - \<tenant> : Name of the tenant
  - \<application> : Name of git repository of the application
  - \<env>:  Environment name
  - \<gitops-repo>:  url of your gitops repo
  - \<nexus-repo>: url of nexus repository
  - \<sre>: sre tenant folder with prefix i.e 03-sre


Once these folders are created, add following files

Add space configuation for **each** environment

Templates for the files:

- /\<tenant>/configs/\<env>/space.yaml
```
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Space
metadata:
  name: <tenant>-<environment>
  labels:
    team: <tenant>
    kind: <environment>
    stakater.com/workload-monitoring: 'true'
  annotations:
    openshift.io/node-selector: node-role.kubernetes.io/worker= 
spec:
  tenant: <tenant>
```

Add tenants configuration inside sre tenant configuration

- \<sre>/\<cluster>/tenant-operator/tenants/\<tenant>.yaml

```
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: <tenant>
spec:
  users:
  - <user-1>
  - <user-2>
  - <user-n>
  quota: <quota>
```

Create argocd project and argocd application that will watch folder inside \<tenant>/\<config>/\<argocd> that in turn going to deploy application in particular environment

Add this file for **each** environment

- \<sre>/\<cluster>/\<env>/\<tenant>.yaml
```
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
  # Only permit applications to deploy to the guestbook namespace in the same cluster
  destinations:
  - namespace: "*"
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



