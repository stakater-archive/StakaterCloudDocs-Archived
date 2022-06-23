# Environment

```yaml
apiVersion: tronador.stakater.com/v1alpha2
kind: Environment
metadata:
  name: pr-123-stakater-nordmart-inventory
spec:
  application:
    gitRepository:
      gitImplementation: go-git
      interval: 1m0s
      ref:
        branch: master
      timeout: 20s
      url: 'https://github.com/stakater-lab/stakater-nordmart-inventory'
    release:
      chart:
        spec:
          chart: deploy/
          reconcileStrategy: ChartVersion
          sourceRef:
            kind: GitRepository
            name: dte-master
          version: '*'
      interval: 1m0s
      releaseName: master
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
              tag: native
  namespaceLabels:
    label: value
    stakater.com/tenant: alpha
    owner: stakater
```

## application

Values inside the application section are used to create the HelmRelease and GitRepository CRs that manage deployment of the application into the cluster.

### gitRepository

Contains the needed details to create a GitRepository object in the cluster. All the fields present inside the [official GitRepository spec](https://fluxcd.io/docs/components/source/gitrepositories/) can be used here as well. The important fields are:

- **interval**: Interval at which the HelmRelease object will reconcile.
- **ref**: Reference to the branch, tag, semver or commit to clone
- **timeout**: Optional field to specify a timeout for Git operations like cloning.
- **url**: Required field that specifies the HTTP/S or SSH address of the Git repository.
- **secretRef**: This field will be filled by Tronador using the [TronadorConfig](./tronador_config.html) CR. `secretRef` is used to specify a name reference to a Secret in the same namespace as the GitRepository, containing authentication credentials for the Git repository.

### release

Contains the needed details to create a HelmRelease object in the cluster. All the fields present inside the [official HelmRelease spec](https://fluxcd.io/docs/components/helm/helmreleases/) can be used here as well. The important fields are:

- **chart**: Spec for the HelmChart object that will be created by the HelmRelease. `chart.spec.chart` (relative path to chart in repo) and `chart.spec.sourceRef` (reference to the GitRepository object created by tronador) are the important fields within this.
- **interval**: Interval at which the HelmRelease object will reconcile.
- **releaseName**: The name of the helm release that will be deployed.
- **valuesFrom**: holds references to resources containing Helm values for this HelmRelease, and information about how they should be merged. For more details, see the [Official HelmRelease docs](https://fluxcd.io/legacy/helm-operator/helmrelease-guide/values/).
- **values**: The values that to override within the helm release. These need to be updated whenever a new image is created for testing. Using the `create-environment` cluster task is recommended for this.


## namespaceLabels

Optional field that contains a map of all labels needed to be placed inside the namespace provisioned by the `Environment`. If they are removed from here, they will be removed from the namespace as well. Labels in the namespace that were never in this field will not be affected. A potential use case of this field is to allow compatibility with [Tenant Operator](../tenant-operator/overview.html).
