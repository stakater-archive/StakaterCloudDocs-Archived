# Add new application

This guide covers the steps to set up a new project/application/microservice in gitops-config repository.

To onboard application in gitops config, you need to make changes to both:

1. application repository and 
2. gitops-config repository. 

Following are the changes you need to make in order to on-board a new application.

Replace angle brackets with following values in below templates:

  - \<tenant> : Name of the tenant
  - \<application> : Name of git repository of the application
  - \<env>:  Environment name
  - \<gitops-repo>:  url of your gitops repo
  - \<nexus-repo>: url of nexus repository

## 1. Application Repo

In application repo add helm chart in ***deploy*** folder at the root of your repository. To configure helm chart add following 2 files in ***deploy*** folder.

We use [stakater application](https://github.com/stakater-charts/application/tree/master/application) chart as our main chart.

1. Chart.yaml
2. values.yaml

- Chart.yaml

```yaml 
apiVersion: v2
name: <application>
description: A Helm chart for Kubernetes
dependencies:
- name: application
  version: 0.0.*
  repository: https://stakater.github.io/stakater-charts  

type: application

version: 0.1.0
```

- values.yaml

Configure helm values as per application needs.

```yaml
application:
  applicationName: <application>
  space:
    enabled: true
  deployment:
    image:
      repository: DOCKER_REPOSITORY_URL
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

## 2. GitOps-Config Repo

You need to create application folder inside a tenant. Inside application folder you need to create each environment folder that application will be deployed to. Following folders will be created.

- \<tenant>/\<application>
- \<tenant>/\<application>/\<01-env>
-  \<tenant>/\<application>/\<02-env>
-  \<tenant>/\<application>/\<0n-env>

To deploy, you'll need to add helm chart of your application in **each** environment folder.

Add values of helm chart that are different from  default values at ```deploy/values.yaml```  defined in application repository

Templates for the files:

- \<tenant>/\<application>/\<env>\values.yaml: 

``` yaml
<application>:
  application:
    space:
      enabled: false
    deployment:
      image:
        repository: <nexus-repo>/<tenant>/<application>
        tag: v0.0.1
```

- \<tenant>/\<app>/\<env>\Chart.yaml: 

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

- \<tenant>\/configs/\<env>/argocd/\<application>.yaml 

``` yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <tenant>-<env>-<application>
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: <tenant>-<env>
    server: 'https://kubernetes.default.svc'
  source:
    path: <tenant>/<application>/<env>
    repoURL: '<gitops-config>'
    targetRevision: HEAD
  project: <tenant>-<env>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
