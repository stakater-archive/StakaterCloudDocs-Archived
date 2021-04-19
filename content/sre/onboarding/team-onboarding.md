## Quick start guide for new projects

This quick guide covers the steps to set up a new project in the Stakater App Agility Platform.


### Building and deploying your application


### 1. Application Repo


In application repo, you need to configure helm chart for the application. you need to have helm chart in ***deploy*** folder at the root of your repository.


you can configure helm chart by having mere 2 files in ***deploy*** folder

- Chart.yaml
```yaml 
apiVersion: v2
name: <repo-name>
description: A Helm chart for Kubernetes
dependencies:
- name: application
  version: 0.0.*
  repository: https://stakater.github.io/stakater-charts  

type: application

version: 0.1.0
```
- values.yaml
you can configure helm values as per your application requirement. We use [stakater application](https://github.com/stakater-charts/application/tree/master/application) chart as our main chart.
```yaml
application:
  applicationName: <app-name>
  deployment:
    image:
      repository: "DOCKER_REPOSITORY_URL"
      tag: IMAGE_TAG
    imagePullSecrets: "nexus-docker-config-forked"
    # Resource request/limits
    resources:
      limits:
        memory: 512Mi
        cpu: 0.2
      requests:
        memory: 256Mi
        cpu: 0.2
    # Liveness and Readiness probes
    probes: 
      readinessProbe:
        failureThreshold: 3
        periodSeconds: 20
        successThreshold: 1
        timeoutSeconds: 5
        initialDelaySeconds: 5
        httpGet:
          path: /
          port: 8080
      livenessProbe:
        failureThreshold: 3
        periodSeconds: 20
        successThreshold: 1
        timeoutSeconds: 5
        initialDelaySeconds: 5
        httpGet:
          path: /
          port: 8080
    # Environment variables
    env: []
  # Role Based Access Control
  rbac:
    enabled: true
    serviceAccount:
      enabled: true
  # Service configuration
  service:
    ports:
    - port: 8080
      name: http
      targetPort: 8080
  # Openshift Routes
```
### 2. GitOps Config:

Simply setting the webhook_url is sufficient to have Tekton build the application.

To deploy, you'll need to add 7 files to the gitops repository.

Replace the angle brackets and their content with your team,environment and project specific names. 

Templates for the files: 
- <env>/apps/\<team>/dev/helm-values/\<application>.yaml: 

``` yaml
<application>:
  application:
    space:
      enabled: false
    deployment:
      image:
        repository: <nexus-repo>/<team>/<application>
        tag: v0.0.1
```

- <env>/config/argocd/\<team>/\<application>.yaml 

``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <team>
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: <team>-dev
    server: 'https://kubernetes.default.svc'
  source:
    path: common/helm/<team>/<application>
    repoURL: '<gitops-config>'
    targetRevision: HEAD
    helm:
      valueFiles:
        - "../../../../<env>/apps/<team>/dev/helm-values/<application>.yaml"
  project: <team>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

- <env>/config/argocd/\<team>/\<team>-dev.yaml 

``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <application>-dev
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: <team>-dev
    server: 'https://kubernetes.default.svc'
  source:
    path: <env>/apps/<team>/dev/
    repoURL: '<gitops-config>'
    targetRevision: HEAD
  project: <team>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

- <env>/config/argocd/\<team>/\<team>-pr.yaml 

``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <application>-pr
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: <team>-pr
    server: 'https://kubernetes.default.svc'
  source:
    path: <env>/apps/<team>/pr/
    repoURL: '<gitops-config>'
    targetRevision: HEAD
  project: <team>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

- <env>/config/argocd/\<team>/argo-project.yaml
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

- common/helm/\<team>/\<application>/Chart.yaml 

``` yaml
apiVersion: v2
name: <application>
description: A Helm chart for Kubernetes
dependencies:
- name: <application>
  version: 0.0.*
  repository: <nexus-url> 

type: application

version: 0.1.0

appVersion: 1.0.0

```

- gitops-config/<env>/config/tenants/\<application>.yaml
``` yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: <team>
spec:
  users:
## add the team members' email addresses.
  - <member-id>
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
