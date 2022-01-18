# Config File

The Tronador config file should contain configuration elements for the `EnvironmentProvisioner` CR in yaml format. The config file will be used in conjunction with the `create-environment-provisioner` cluster task to automatically create an `EnvironmentProvisioner` CR in the cluster.

```yaml
application:
  chart_path: deploy
  secret_ref:
    name: secret-name
    namespace: secret-namespace
  value_overrides:
    application:
      deployment:
        image:
          repository: {{APPLICATION_IMAGE_NAME}}
          tag: {{APPLICATION_IMAGE_TAG}}
  values_from:
    - secretKeyRef:
        name: default-values
        namespace: my-ns
        key: values.yaml
        optional: true
    - configMapKeyRef:
        name: default-values
        namespace: my-ns
        key: values.yaml
        optional: false
  namespaceLabels:
    label: value
    stakater.com/tenant: alpha
    owner: stakater
```

## application

### chart_path

The path to the Helm chart within the repo.

### secret_ref

This field is optional. If specified, it will be used to retrieve the secret from the specified namespace for private repos.

- **name**: The name of the secret that contains the git repo credentials.
- **namespace**: The namespace of the secret.

### value_overrides

The values to override the default values in the Helm chart. The `image.repository` and `image.tag` are required and must be placed similarly to how the `<chart_path>/values.yaml` file is structured. For instance, if you have your image field in `values.yaml` placed as a child of other fields, like here:

```yaml
deployment:
   field1:
      -
      -
   field2: value
   ...
   image:
      repository: repository.image.com/imageName
      tag: v0.0.1
```

then you must popuplate your `value_overrides` field as follows:

```yaml
value_overrides:
  deployment:
    image:
      repository: {{APPLICATION_IMAGE_NAME}}
      tag: {{APPLICATION_IMAGE_TAG}}
```

::: v-pre
Their values must also be `{{APPLICATION_IMAGE_NAME}}` and `{{APPLICATION_IMAGE_TAG}}` respectively. These keys will be replaced with values provided from the cluster task in your CI pipeline that creates images after each commit.
:::

### values_from

The `values_from` field is used to populate the `valuesFrom` field inside the generated `helmRelease`. It is possible to define a list of config maps, secrets (in the same namespace as the HelmRelease by default, or in a configured namespace) or external sources (URLs) from which to take values. For charts from a Git repository, there is an additional option available to refer to a file in the chart folder. For more details about this field, see the [Official HelmRelease docs](https://fluxcd.io/legacy/helm-operator/helmrelease-guide/values/).

### namespaceLabels

(Optional Field) Labels mentioned here will be applied into the namespace. If they are removed from here, they will be removed from the namespace as well. Labels in the namespace that were never in this field will not be affected. A possible application of this field is compatibility with [Tenant Operator](../tenant-operator/overview.html).
