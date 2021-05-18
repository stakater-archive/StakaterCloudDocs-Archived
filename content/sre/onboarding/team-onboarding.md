## Adding new team

To onborad a new team in gitops structure,you need to add following files to gitops repository

Replace angle brackets with following values in below templates:
  - \<team> : Name of the team
  - \<application> : Name of git repository of the application
  - \<env>:  Environment name
  - \<gitops-repo>:  url of your gitops repo

 1) \<env>\/config/argocd/\<team>/\<application>.yaml 


``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <team>
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: openshift-stakater-argocd
    server: 'https://kubernetes.default.svc'
  ignoreDifferences:
  - group: argoproj.io
    jsonPointers:
    - /status
    kind: Application
  - group: triggers.tekton.dev
    jsonPointers:
    - /status
    kind: EventListener
  - group: triggers.tekton.dev
    jsonPointers:
    - /status
    kind: TriggerTemplate
  - group: triggers.tekton.dev
    jsonPointers:
    - /status
    kind: TriggerBinding
  - group: route.openshift.io
    jsonPointers:
    - /spec/host
    kind: Route
  - group: bitnami.com
    jsonPointers:
    - /status
    kind: SealedSecret
  project: default
  source:
    path: <env>/config/argocd/<team>
    repoURL: '<gitops-repo>'
    targetRevision: HEAD
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true

```

 2) \<env>/config/argocd/\<team>/\<team>-dev.yaml <br>
 ``` yaml
 apiVersion: argoproj.io/v1alpha1
 kind: Application
 metadata:
 name: <team>-dev
 namespace: openshift-stakater-argocd
 spec:
 destination:
     namespace: <team>-dev
     server: 'https://kubernetes.default.svc'
 source:
     path: <env>/apps/<team>/dev/
     repoURL: '<gitops-repo>'
     targetRevision: HEAD
 project: <team>
 syncPolicy:
     automated:
     prune: true
     selfHeal: true
 ```

3) \<env>/config/argocd/\<team>/\<team>-pr.yaml <br>

``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <team>-pr
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: <team>-pr
    server: 'https://kubernetes.default.svc'
  source:
    path: <env>/apps/<team>/pr/
    repoURL: '<gitops-repo>'
    targetRevision: HEAD
  project: <team>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

4) \<env>/config/argocd/\<team>/argo-project.yaml
``` yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: <team>
  namespace: openshift-stakater-argocd
  # Finalizer that ensures that project is not deleted until it is not referenced by any application
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  description: <teamDescription>
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
```

5) \<env>/config/tenants/\<application>.yaml
``` yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: <team>
spec:
  users:
## add the team members' email addresses.
  - r.amir@cloud.com
  - <xx.yy@cloud.com>
  quota: small
---
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Space
metadata:
  name: <team>-build
  labels:
    team: <team>
    kind: build
    app: <application>
    stakater.com/workload-monitoring: 'true'
  annotations:
    openshift.io/node-selector: node-role.kubernetes.io/worker=
spec:
  tenant: <team>
---
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Space
metadata:
  name: <team>-dev
  labels:
    team: <team>
    kind: dev
    stakater.com/workload-monitoring: 'true'
  annotations:
    openshift.io/node-selector: node-role.kubernetes.io/worker=
spec:
  tenant: <team>
---
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Space
metadata:
  name: <team>-pr
  labels:
    team: <team>
    kind: pr
    stakater.com/workload-monitoring: 'true'
  annotations:
    openshift.io/node-selector: node-role.kubernetes.io/worker=
spec:
  tenant: <team>
```


