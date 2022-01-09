### Deploying Template to Namespaces via Tenant

Bill, the cluster admin, wants to deploy a docker secret in namespaces of Anna's tenant where certain labels exists.

First Bill creates a template:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: docker-secret
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-secret
      data:
        .dockercfg: eyAKICAiaHR0cHM6IC8vaW5kZXguZG9ja2VyLmlvL3YxLyI6IHsgImF1dGgiOiAiYzNSaGEyRjBaWEk2VjI5M1YyaGhkRUZIY21WaGRGQmhjM04zYjNKayJ9Cn0K
      type: kubernetes.io/dockercfg
```

Once the template has been created, Bill edits Anna's tenant and populates `namespacetemplate` field:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@acme.org
    edit:
    - john@acme.org
  quota: small
  sandbox: true
  namespacetemplate:
    templateInstances:
    - spec:
        template: docker-secret
      selector:
        matchLabels:
          kind: build
```

Tenant-Operator will deploy `docker-secret` `TemplatInstances` mentioned in `namespacetemplate.templateInstances`, `secrets` will only be applied in those `namespaces` which belong to the Anna's `tenant` and which have the `matching label`.

So now Anna adds label `kind: build` to her existing namespace `bluesky-anna-acme-sandbox`, after adding the label she see's that the secret has been created.

```bash
kubectl get secret docker-secret -n bluesky-anna-acme-sandbox
NAME             STATE    AGE
docker-secret    Active   3m
```

### Deploying Template to a Namespace via TemplateInstance

Anna wants to deploy a docker secret in her namespace.

First Anna asks Bill, the cluster admin, to creates her a template of the secret:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: docker-secret
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-secret
      data:
        .dockercfg: eyAKICAiaHR0cHM6IC8vaW5kZXguZG9ja2VyLmlvL3YxLyI6IHsgImF1dGgiOiAiYzNSaGEyRjBaWEk2VjI5M1YyaGhkRUZIY21WaGRGQmhjM04zYjNKayJ9Cn0K
      type: kubernetes.io/dockercfg
```

Once the template has been created, Anna creates a `TemplateInstance` in her namespace referring to the `Template` she wants to deploy:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateInstance
metadata:
  name: docker-secret-instance
  namespace: bluesky-anna-acme-sandbox
spec:
  template: docker-secret
  sync: true
```

Once created Anna can see that the secret has been successfully created.

```bash
kubectl get secret docker-secret -n bluesky-anna-acme-sandbox
NAME             STATE    AGE
docker-secret    Active   3m
```

### Deploying Template to Namespaces via TemplateGroupInstances

Bill, the cluster admin, wants to deploy a docker secret in namespaces where certain labels exists.

First Bill creates a template:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: docker-secret
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-secret
      data:
        .dockercfg: eyAKICAiaHR0cHM6IC8vaW5kZXguZG9ja2VyLmlvL3YxLyI6IHsgImF1dGgiOiAiYzNSaGEyRjBaWEk2VjI5M1YyaGhkRUZIY21WaGRGQmhjM04zYjNKayJ9Cn0K
      type: kubernetes.io/dockercfg
```

Once the template has been created, Bill creates a `TemplateGroupInstance` referring to the `Template` he wants to deploy with `MatchLabels`:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateGroupInstance
metadata:
  name: docker-secret-group-instance
spec:
  template: docker-secret
  selector:
    matchLabels:
      kind: build
  sync: true
```

Once created Bill can see that secrets has been successfully created in all matching namespaces.

```bash
kubectl get secret docker-secret -n bluesky-anna-acme-sandbox
NAME             STATE    AGE
docker-secret    Active   3m

kubectl get secret docker-secret -n alpha-haseeb-acme-sandbox
NAME             STATE    AGE
docker-secret    Active   2m
```
