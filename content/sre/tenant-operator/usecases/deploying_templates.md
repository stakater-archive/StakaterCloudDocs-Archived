# Deploying Template to Namespaces via Tenant

Bill the cluster admin wants to deploy a docker-pull-secret in Anna's tenant namespaces where certain labels exists.

Firstly, Bill creates a template:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: docker-pull-secret
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-pull-secret
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
    - anna@aurora.org
    edit:
    - john@aurora.org
  quota: small
  sandbox: true
  namespacetemplate:
    templateInstances:
    - spec:
        template: docker-pull-secret
      selector:
        matchLabels:
          kind: build
```

Tenant-Operator will deploy `docker-pull-secret` `TemplateInstances` mentioned in `namespacetemplate.templateInstances`, `secrets` will only be applied in those `namespaces` which belong to Anna's `tenant` and which have `matching label`.

So now Anna adds label `kind: build` to her existing namespace `bluesky-anna-aurora-sandbox`, after adding the label she see's that the secret has been created.

```bash
kubectl get secret docker-secret -n bluesky-anna-aurora-sandbox
NAME                  STATE    AGE
docker-pull-secret    Active   3m
```

## Deploying Template to a Namespace via TemplateInstance

Anna wants to deploy a docker pull secret in her namespace.

First Anna asks Bill, the cluster admin, to creates her a template of the secret:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: docker-pull-secret
resources:
  manifests:
    - kind: Secret
      apiVersion: v1
      metadata:
        name: docker-pull-secret
      data:
        .dockercfg: eyAKICAiaHR0cHM6IC8vaW5kZXguZG9ja2VyLmlvL3YxLyI6IHsgImF1dGgiOiAiYzNSaGEyRjBaWEk2VjI5M1YyaGhkRUZIY21WaGRGQmhjM04zYjNKayJ9Cn0K
      type: kubernetes.io/dockercfg
```

Once the template has been created, Anna creates a `TemplateInstance` in her namespace referring to the `Template` she wants to deploy:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateInstance
metadata:
  name: docker-pull-secret-instance
  namespace: bluesky-anna-aurora-sandbox
spec:
  template: docker-pull-secret
  sync: true
```

Once created Anna can see that the secret has been successfully created.

```bash
kubectl get secret docker-secret -n bluesky-anna-aurora-sandbox
NAME                  STATE    AGE
docker-pull-secret    Active   3m
```

## Deploying Template to Namespaces via TemplateGroupInstances

Bill, the cluster admin, wants to deploy a docker pull secret in namespaces where certain labels exists.

First, Bill creates a template:

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
        name: docker-pull-secret
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
  template: docker-pull-secret
  selector:
    matchLabels:
      kind: build
  sync: true
```

Once created Bill can see that secrets has been successfully created in all matching namespaces.

```bash
kubectl get secret docker-secret -n bluesky-anna-aurora-sandbox
NAME             STATE    AGE
docker-secret    Active   3m

kubectl get secret docker-secret -n alpha-haseeb-aurora-sandbox
NAME             STATE    AGE
docker-secret    Active   2m
```

## Passing Parameters to Template via TemplateInstance or Tenant

Anna wants to deploy a LimitRange resource to certain namespaces.

First Anna asks Bill, the cluster admin, to creates her a template with parameters for LimitRange:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: namespace-parameterized-restrictions
parameters:
  # Name of the parameter
  - name: DEFAULT_CPU_LIMIT
    # The default value of the parameter
    value: "1"
  - name: DEFAULT_CPU_REQUESTS
    value: "0.5"
    # If a parameter is required the template instance will need to set it
    # required: true
    # Make sure only values are entered for this parameter
    validation: "^[0-9]*\\.?[0-9]+$"
resources:
  manifests:
    - apiVersion: v1
      kind: LimitRange
      metadata:
        name: namespace-limit-range-${namespace}
      spec:
        limits:
          - default:
              cpu: "${{DEFAULT_CPU_LIMIT}}"
            defaultRequest:
              cpu: "${{DEFAULT_CPU_REQUESTS}}"
            type: Container
```

Once the template has been created, Anna creates a `TemplateInstance` in her namespace referring to the `Template` she wants to deploy:

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateInstance
metadata:
  name: namespace-parameterized-restrictions-instance
  namespace: bluesky-anna-aurora-sandbox
spec:
  template: namespace-parameterized-restrictions
  parameters:
  - name: DEFAULT_CPU_LIMIT
    value: "1.5"
  - name: DEFAULT_CPU_REQUESTS
    value: "1"
  sync: true
```

Or she can use her tenant

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Tenant
metadata:
  name: bluesky
spec:
  users:
    owner:
    - anna@aurora.org
    edit:
    - john@aurora.org
  quota: small
  sandbox: true
  namespacetemplate:
    templateInstances:
    - spec:
        template: namespace-parameterized-restrictions
      parameters:
        - name: DEFAULT_CPU_LIMIT
          value: "1.5"
        - name: DEFAULT_CPU_REQUESTS
          value: "1"
      selector:
        matchLabels:
          kind: build
```
