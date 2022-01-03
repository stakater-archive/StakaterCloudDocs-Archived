# Installation

## Install Tenant Operator using Helm

### Requirements

* An **Openshift** cluster
* **Helm-Operator**
* **Cert-Manager**
* **Vault** (optional)
* **RHSSO** (optional)

### 1. Create Namespace

```bash
oc create namespace stakater-tenant-operator
```

Create a new namespace `stakater-tenant-operator`, where Tenant-Operator will be deployed.

### 2. Create Secret

```bash
oc apply -f -n stakater-tenant-operator docker-secret.yaml
```

Create a `docker-secret` in *stakater-tenant-operator* namespace to pull Tenant-Operator image from dockerhub.

*The secret will be provided by **Stakater***

### 3. Create Tenant-Operator Helm Release

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: tenant-operator
  namespace: stakater-tenant-operator
spec:
  releaseName: stakater
  chart:
    repository: https://stakater.github.io/stakater-charts
    name: tenant-operator
    version: 0.2.24
  values:
    image:
      repository: stakaterdockerhubpullroot/tenant-operator
      tag:  v0.2.24
      pullPolicy: IfNotPresent
    imagePullSecrets:
    - name: dockersecret
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 100m
        memory: 128Mi
```

This helm-release will deploy tenant-operator and a default integration-config in `stakater-tenant-operator` namespace.

Once the image has been pulled `Tenant-Operator` will be ready for use.
