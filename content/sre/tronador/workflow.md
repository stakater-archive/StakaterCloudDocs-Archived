# Workflow guide for Tronador

For tronador to work, you need to add support for it in your Git Repository by adding a [Tronador config file](./config_file.html). Afterwards, a Tekton pipeline needs to be setup with the [Tronador cluster task](./cluster_task.html), and a cluster task that pushes the output EP to your gitops repository. Test environments should then be created automatically every time a PR is created or updated. The entire Dynamic Test Environment (DTE) creation process is described below.

### Tekton Pipeline

The Tekton Pipeline needs to watch your repo where tronador is configured to be used, and when a PR is created or updated, it will trigger the Tekton pipeline. The pipeline will first create an image from the changes in your PR, then use that image to create a new Environment Provisioner CR, and finally push it to your gitops repository.

### ArgoCD push

ArgoCD is a tool that can be used to watch a repo and push the changes to your cluster. In this case, it will push the Environment Provisioner CR to your cluster.

### Environment Provisioner

The EnvironmentProvisioner Custom Resource does the actual work of creating the test environment. It is responsible for creating the test environment, and for updating it when the image is updated. The process for this is to first create a namespace, then create a helm release within the namespace using details about the image to be deployed. These details are gotten from the pipeline and the tronador config file.

### Helm Release

Helm Releases are watched by the Helm Operator, which manages the creation of all resources listed in a referenced helm chart. This chart is usually placed within the repo itself, and in this case tronador passes along the reference to this chart from the Environment Provisioner to the Helm Release. The only thing that is changed is the image to be deployed, which is passed along from the pipeline with each update to the PR and updated within the helm release automatically.

### Secret management

Secrets for the helm chart to be deployed are currently passed along from the tronador config file, to the helm release. You can also use [Tenant Operator's](../tenant-operator/overview.html) [TemplateGroupInstance](../tenant-operator/customresources.html#_5-templategroupinstance) to pass secrets to the namespace that will be provisioned by the EnvironmentProvisioner by setting the proper label in your tronador config file.