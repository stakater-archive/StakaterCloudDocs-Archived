# Config File

The Tronador config file should contain configuration elements for the `EnvironmentProvisioner` CR in yaml format. The config file will be used in conjunction with the `create-environment-provisioner` cluster task to automatically create an `EnvironmentProvisioner` CR in the cluster.

```yaml
application:
  chart_path: deploy
  value_overrides:
    application:
      deployment:
        image:
          repository: {{APPLICATION_IMAGE_NAME}}
          tag: {{APPLICATION_IMAGE_TAG}}
  namespaceLabels:
    label: value
    stakater.com/tenant: alpha
    owner: stakater
```

## application

### chart_path

The path to the Helm chart within the repo.

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

### namespaceLabels

(Optional Field) Labels mentioned here will be applied into the namespace. If they are removed from here, they will be removed from the namespace as well. Labels in the namespace that were never in this field will not be affected. A possible application of this field is compatibility with [Tenant Operator](../tenant-operator/overview.html).
