# Environments

There are two type of environments for each tenant:

- CI/CD environments
- Other environments

## CI/CD Environments

There are three CI/CD environments per tenant

The CI/CD Environment is a special Environment that contains CI/CD pipelines. These pipelines respond to changes in GitOps configuration repository and Application/Service soruce repositories. They are responisble for keeping the resources in the cluster in-sync with the configurations in Git and re-build/re-deploy application/service images.

### 1. Build

Build environment contains all tekton pipeline configurations/resources like *pipeline,eventlistener,pipelinrun etc*. This environment is used for running pipelines of tenant applications.

### 2. Preview

Preview environment contains all preview application deployments. As soon as there is a new PR in application, pipeline creates new environment to test this PR. Each PR is deployed in separate namespace.

### 3. Dev

Once the PR is merged; the dynamic test environment is automatically deleted and the manifests are pushed to first permanent application environment dev.

## Other Environments

Other than CI/CD environment there are applications environments like *qa,staging,pre-prod,prod etc*. Other environments are promoted manually by creating a PR to the gitops repo to bump image version in helm values for controlled environment promotion. 

## Application promotion in other environment

To promote application from one environment to another, you will need to bump image and chart version of environment. you can do so by picking these versions from previous environment.

### Promote chart version 

To promote chart version from first environment, you can check the chart version from ```Chart.lock``` file and update version in ```Chart.yaml``` of next version. for eg:

\<gitops-repo>/\<tenant>/\<application>/\<first-env>/Chart.lock

```
dependencies:
- name: <application>
  repository: <nexus-repo>
  version: 0.0.84
digest: sha256:d33cb4ad70eecbe66abf4926c28cb18f2acab687a5dbd8a9b6c33758d386d9a2
generated: "2021-08-23T12:54:14.214409662Z"
```

pick version ```0.0.84``` from above ```Chart.lock``` and copy it in ``Chart.yaml`` of next environment

\<gitops-repo>/\<tenant>/\<application>/\<env>/Chart.yaml
```
apiVersion: v2
name: <application>
description: A Helm chart for Kubernetes
dependencies:
- name: <application>
  version: "0.0.84"
  repository: <nexus-repo>
version: 0.1.0
```

similarly for other environments chart promotion, copy same version to ``Chart.yaml`` of other environments

### Promote image version

First environment image is updated automatically by pipeline. In next environments, image is promoted by manually copying version from previous environment to next environment. for eg:

\<gitops-repo>/\<tenant>/\<application>/\<env-1>/values.yaml

```
<application>:
  application: 
    space:
       enabled: false
    deployment:   
      image:
        repository: <nexus-repo>/<application>
        tag: 0.0.39
```

Pick version ```0.0.39``` and paste it to next environment

\<gitops-repo>/\<tenant>/\<application>/\<env-2>/values.yaml

```
<application>:
  application: 
    space:
       enabled: false
    deployment:   
      image:
        repository: <nexus-repo>/<application>
        tag: 0.0.39
```

Similarly do it for all environments in same way
