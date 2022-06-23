# Cluster Task

## Overview

The `create-environment` Tekton cluster task is used to create the `Environment` CR. The `Environment` CR will be used to deploy the application to its testing environment within your cluster. The use case of this cluster task is to automate the creation and updating of the `Environment` CR, whenever the application's image is created on PR create or update events. Note that Tronador, and by extension the `Environment` CR, are independent of Tekton. Any CI engine can be used instead for this purpose, and this Tekton cluster task is just an example of it.

## Requirements

The `create-environment` cluster task requires the following:

- A workspace named `output`
- a `configMap` within your cluster named `environment-template` with the following data:

```yaml
data:
  environmentTemplate.yml: |
    apiVersion: tronador.stakater.com/v1alpha2
    kind: Environment
    metadata:
      name: $ENVIRONMENT_NAME
    spec:
      namespaceLabels:
    ${NAMESPACE_LABELS}
      application:
        gitRepository:
          gitImplementation: go-git
          interval: 1m0s
          ref:
            branch: ${GIT_BRANCH}
          timeout: 20s
          url: ${GIT_URL}
        release:
          chart:
            spec:
              chart: ${CHART_PATH}
              reconcileStrategy: ChartVersion
              sourceRef:
                kind: GitRepository
                name: dte-${GIT_BRANCH}
              version: '*'
          interval: 1m0s
          releaseName: ${GIT_BRANCH}
          valuesFrom:
    ${VALUES_FROM}
          values:
    ${VALUES_OVERRIDE}
```

## Parameters

The input parameters to the cluster task will be:

- **pathToTronadorFile:** The path to the .tronador.yaml config file within the repo. Default value is the root your repo, "`.tronador.yaml`"
- **repoName:** Name of the repository
- **prNumber:** Pull request number
- **gitUrl:** URL to the remote git repository
- **gitBranch:** Branch to clone via helm release
- **imageTag:** Tag of the image to create
- **imageRepo:** Repository where the image is located

These parameters can be gotten from the github webhook that triggers the Tekton pipeline, and will be passed here. `imageTag` and `imageRepo` are gotten from the task that creates and pushes your images to your image registry.

## Outputs

The only output of this task is an `Environment` CR, generated from both these values and the Tronador config file, and placed inside `$(workspaces.output.path)/environment/environment.yaml`
