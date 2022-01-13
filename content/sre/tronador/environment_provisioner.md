# EnvironmentProvisioner

```yaml
apiVersion: tronador.stakater.com/v1alpha1
kind: EnvironmentProvisioner
metadata:
  name: stakater-nordmart-promotion-pr-9
spec:
  application:
    release:
      chart:
        git: https://github.com/stakater-lab/stakater-nordmart-promotion
        ref: add-tronador-yaml
        path: "deploy/"
      releaseName: add-tronador-yaml
      values:
        application:
          deployment:
            image:
              tag: "native"
  namespaceLabels:
    label: value
    stakater.com/tenant: alpha
    owner: stakater
```

## application

Values inside the application section are used to create the helm release that manages deployment of the application into the cluster. The important fields here are:

- **release.chart**: The chart that will be deployed. Must contain its git repo path, the branch to deploy, and the path to the chart within the git repo
- **release.releaseName**: The name of the helm release that will be deployed.
- **release.values**: The values that to override within the helm release. THese need to be updated whenever a new image is created for testing. Using the `create-environment-provisioner` cluster task is recommended here

## namespaceLabels

Optional field that contains a map of all labels needed to be placed inside the namespace provisioned by the `EnvironmentProvisioner`. If they are removed from here, they will be removed from the namespace as well. Labels in the namespace that were never in this field will not be affected. A possible application of this field is compatibility with [Tenant Operator](../tenant-operator/overview.html).
