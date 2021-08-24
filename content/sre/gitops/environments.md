# Environments

## Types of environments

There are two type of environments for each tenant:

1. CI/CD Environments
2. Other Environments

### 1. CI/CD Environments

There are three CI/CD environments per tenant

The CI/CD Environments are special Environments that are part of CI/CD workflow. There are 3 kind of CI/CD environments

#### 1. Build

Build environment contains all tekton pipeline configurations/resources like *pipeline,eventlistener,pipelinrun etc*. These pipelines respond to changes in Application/Service soruce repositories. This environment is used for running pipelines of tenant applications.

#### 2. Preview

Preview environment contains all preview application deployments. As soon as there is a new PR in application, pipeline creates new environment to test this PR. Each PR is deployed in separate namespace.

#### 3. Dev

Once the PR is merged; the dynamic test environment is automatically deleted and the helm manifests are pushed to first permanent application environment i.e. `dev` by the CI pipeline.

### 2. Other Environments

Other than CI/CD environment there are applications environments like *qa,staging,pre-prod,prod etc*. Application promotion in other environments is done manually by creating a PR to the gitops repo which includes the:

- bumping of the chart version and 
- bumping image version in helm values

## Application promotion

To promote application from one environment to another; as mentioned above you will need to bump chart version and image version in that environment. You can do so by picking these versions from previous environment. 

This guide assumes that application is already [on-boarded](https://docs.cloud.stakater.com/content/sre/onboarding/application-onboarding.html) to different environments.

### 1. Promote chart

To promote chart from first environment, you can check the chart version from ```Chart.lock``` file and update version in ```Chart.yaml``` of next version. for eg:

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

\<gitops-repo>/\<tenant>/\<application>/\<next-env>/Chart.yaml

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

### 2. Promote image

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

Similarly do it for all environments.
