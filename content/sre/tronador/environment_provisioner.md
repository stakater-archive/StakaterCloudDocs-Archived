# EnvironmentProvisioner

::: warning Warning

`tronador.stakater.com/v1alpha1/EnvironmentProvisioner` has now been deprecated. Please use `tronador.stakater.com/v1alpha2/Environment` instead. See its [relevant docs](./environment.html) for more details.

:::

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
        secretRef:
          name: secret-name
          namespace: secret-namespace
      releaseName: add-tronador-yaml
      valuesFrom:
        - configMapKeyRef:
            name: default-values
            namespace: my-ns
            key: values.yaml
            optional: false
        - secretKeyRef:
            name: default-values
            namespace: my-ns
            key: values.yaml
            optional: true
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

- **release.chart**: The chart that will be deployed. Must contain its git repo path, the branch to deploy, and the path to the chart within the git repo. If the chart is placed inside a private repo, then its secret must also be specified.
- **release.releaseName**: The name of the helm release that will be deployed.
- **release.values**: The values that to override within the helm release. These need to be updated whenever a new image is created for testing. Using the `create-environment-provisioner` cluster task is recommended here
- **release.valuesFrom**: Values from external sources, such as configMaps or secrets. For more details, see the [Official HelmRelease docs](https://fluxcd.io/legacy/helm-operator/helmrelease-guide/values/)

## namespaceLabels

Optional field that contains a map of all labels needed to be placed inside the namespace provisioned by the `EnvironmentProvisioner`. If they are removed from here, they will be removed from the namespace as well. Labels in the namespace that were never in this field will not be affected. A potential use case of this field is to allow compatibility with [Tenant Operator](../tenant-operator/overview.html).
