# Cluster Task

## Overview

The `create-environment-provisioner` Tekton cluster task is used to create the `EnvironmentProvisioner` CR. The `EnvironmentProvisioner` CR will be used to deploy the application to its testing environment within your cluster. The use case of this cluster task is to automate the creation of the `EnvironmentProvisioner` CR, and its updating whenever the application image is updated. This is useful, since you can automate the creation of an image whenever some code is pushed into your branch.

## Requirements

The `create-environment-provisioner` cluster task requires the following:

- A workspace named `output`
- a `configMap` within your cluster named `environment-provisioner-template` with the following data:

```yaml
data:
  environmentProvisionerTemplate.yml: |
    cat <<EOF
    apiVersion: tronador.stakater.com/v1alpha1
    kind: EnvironmentProvisioner
    metadata:
      name: $EP_NAME
    spec:
      application:
        release:
          chart:
            git: ${GIT_URL}
            ref: ${GIT_BRANCH}
            path: ${CHART_PATH}
          releaseName: ${GIT_BRANCH}
          values:
    ${VALUES_OVERRIDE}
    namespaceLabels:
    ${NAMESPACE_LABELS}
    EOF
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

The only output of this task is an `EnvironmentProvisioner` CR, generated from both these values and the Tronador config file, and placed inside `$(workspaces.output.path)/.ep-workspace/environmentProvisioner.yaml`
