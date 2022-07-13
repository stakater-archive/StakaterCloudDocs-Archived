# TronadorConfig

```yaml
apiVersion: tronador.stakater.com/v1alpha1
kind: TronadorConfig
metadata:
  name: tronador-config
  namespace: stakater-tronador
spec:
  mappings:
    - authSecret: mains
      imagePullSecret: docker-secret
      repos:
        - stakater-nordmart-inventory
        - stakater-nordmart-review-ui
        - stakater-nordmart-review
    - authSecret: repo-secret
      imagePullSecret: docker-secret
      repos:
        - stakater-nordmart-review-private
    - authSecret: repo-secret-2
      imagePullSecret: docker-secret-2
      repos:
        - stakater-nordmart-review-ui-private
  secrets:
    - apiVersion: v1
      kind: Secret
      metadata:
        name: repo-secret
      data:
        password: password
        username: username
      type: Opaque
    - apiVersion: v1
      kind: Secret
      metadata:
        name: repo-secret-2
      data:
        password: password
        username: username
      type: Opaque
    - apiVersion: external-secrets.io/v1alpha1
      kind: ExternalSecret
      metadata:
        name: docker-secret
      spec:
        data:
          - remoteRef:
              key: key
              property: username
            secretKey: secret-key
          - remoteRef:
              key: key
              property: password
            secretKey: secret-key
        refreshInterval: 1m
        secretStoreRef:
          kind: ClusterSecretStore
          name: secret-store
        target:
          creationPolicy: Owner
          name: docker-secret
          template:
            metadata:
              annotations:
                key: value
    - apiVersion: external-secrets.io/v1alpha1
      kind: ExternalSecret
      metadata:
        name: docker-secret-2
      spec:
        data:
          - remoteRef:
              key: key
              property: username
            secretKey: secret-key
          - remoteRef:
              key: key
              property: password
            secretKey: secret-key
        refreshInterval: 1m
        secretStoreRef:
          kind: ClusterSecretStore
          name: secret-store
        target:
          creationPolicy: Owner
          name: docker-secret-2
          template:
            metadata:
              annotations:
                key: value
```

## spec

### mappings

Mappings contains an array of Repository Mappings. Each Repository Mapping contains the following fields:
- **repos**: A list of repositories on whose DTEs the mapping will apply. Make sure to write just the Name of the repo itself, not the URL or Organization name.
- **authSecret**: Name of the Secret required in case of a private Repository. If the field is not filled, it will be treated as a public repo.
- **imagePullSecret**: Name of the secret for where the application's images are hosted, e.g. Nexus or Docker.



### secrets

Manifests inside `secrets` has the list of k8s resources which are required in DTEs for their proper functioning. These resources should only contain secrets, or a resource that can create a secret in the cluster in the same namespace. In case of the latter, the name of the resource **must** be the same as the name of the generated secret. `secrets` is a required field if Tronador Config is created

Points to be considered while applying TronadorConfig
- Tronador and all Environments would throw errors in case any cluster wide resource is mentioned.
- If namespace is set in any of the resource, Tronador will ignore it and only deploy the resource to the relevant namespace (see mappings section above).
- Tronador will only apply resources from the CR present in the operator Namespace and named as `tronador-config`.
- Tronador Config points to default `admin` ClusterRole of openshift, all the namespaced resources allowed by that ClusterRole will be applied in the Namespaces.
