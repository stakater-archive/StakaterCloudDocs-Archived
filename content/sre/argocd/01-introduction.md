## Introduction

We use GitOps to continuously deliver application changes

[Argo CD](https://argoproj.github.io/argo-cd/) is a declarative, GitOps continuous delivery tool for Kubernetes. The deployment environment is a namespace in a container platform.

Argo CD models a collection of applications as a project and uses a Git repository to store the application's desired state.

Argo CD is flexible in the structure of the application configuration represented in the Git repository.

Argo CD supports defining Kubernetes manifests in a number of ways:

- helm charts
- kustomize
- ksonnet
- jsonnet
- plain directory of yaml/json manifests
- custom plugins

Argo CD compares the actual state of the application in the cluster with the desired state defined in Git and determines if they are out of sync. When it detects the environment is out of sync, Argo CD can be configured to either send out a notification to kick off a separate reconciliation process or Argo CD can automatically synchronize the environments to ensure they match.

**Terminology:**

Argo CD uses a number of terms to refer to the components:

- Application: A deployable unit
- Project: A collection of applications that make up a solution
