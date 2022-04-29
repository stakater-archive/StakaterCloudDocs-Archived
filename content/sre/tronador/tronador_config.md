# TronadorConfig

```yaml
apiVersion: tronador.stakater.com/v1alpha1
kind: TronadorConfig
metadata:
  name: tronador-config
  namespace: stakater-tronador
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: common-secret-1
      data:
        password: password
        username: username
      type: Opaque
    - kind: Secret
      apiVersion: v1
      metadata:
        name: common-secret-2
      data:
        password: password
        username: username
      type: Opaque
```

## resources

Manifests inside `resources` has the list of k8s resources which are required in DTEs for their proper functioning. This can include any kind of resource, except cluster wide resources. 

Points to be considered while applying TronadorConfig
- Tronador and all Environment Provisioners would throw errors in case any cluster wide resource is mentioned. 
- If namespace is set in any of the resource, Tronador will ignore it and deploy that resource in all Namespaces owned by Environment Provisioners.
- Tronador will only apply resources from the CR present in the operator Namespace and named as `tronador-config`. 
