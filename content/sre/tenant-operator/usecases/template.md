### Creating Templates

Anna wants to create a Template that she can use to initialize or share common resources across namespaces (e.g. secrets)

Anna can either create a template using `Custom Resource Manifests`

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: networkpolicy
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-secret
      data:
        .dockercfg: SSBzZWUgd2hhdCB5b3VyIHRyeWluZyB0byBkbyBoZXJlLiA7KQ==
      type: kubernetes.io/dockercfg
```

Or by using `Helm Charts`

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: redis
resources:
  helm:
    releaseName: redis
    chart:
      repository:
        name: redis
        repoUrl: https://charts.bitnami.com/bitnami
    values: |
      redisPort: 6379
```

### What’s next

See how Anna, can deploy a template in a namespace. [Enforce Pod Priority Classes](/docs/operator/use-cases/pod-priority-classes)