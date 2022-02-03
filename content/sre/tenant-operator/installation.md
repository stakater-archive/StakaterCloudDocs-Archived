# Installation

## Installation using Helm

### Requirements

* An **Openshift** cluster

### 1. Create Namespace

```bash
oc create namespace stakater-tenant-operator
```

Create a new namespace `stakater-tenant-operator`, where Tenant-Operator will be deployed.

### 2. Create Secret

```bash
oc apply -f stakater-docker-secret.yaml
```

Create a secret called `stakater-docker-secret` in *stakater-tenant-operator* namespace to pull Tenant-Operator image from dockerhub.

*The secret will be provided by **Stakater***

### 3. Add Helm Repository

In order to install Tenant Operator with Helm, first add the Stakater Helm repository.

```bash
helm repo add stakater https://stakater.github.io/stakater-charts
```

Scan the new repository for charts.

```bash
helm repo update
```

### 4. Install Tenant Operator

```bash
helm install tenant-operator stakater/tenant-operator --namespace stakater-tenant-operator \
--set image.repository=stakaterdockerhubpullroot/tenant-operator \
--set imagePullSecrets[0].name=stakater-docker-secret \
--set resources.limits.cpu=1000m \
--set resources.limits.memory=2Gi \
--set resources.requests.cpu=100m \
--set resources.requests.memory=128Mi
```

Once the image has been pulled `Tenant-Operator` will be ready for use.

### 5. Configuring IntegrationConfig

A default `IntegrationConfig` is installed with tenant-operator, which can be found in `stakater-tenant-operator` namespace under the name `tenant-operator-config`. For more details check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

## Installation using Helm Release

### Requirements

* An **Openshift** cluster
* **Helm-Operator**

### 1. Create Namespace

```bash
oc create namespace stakater-tenant-operator
```

Create a new namespace `stakater-tenant-operator`, where Tenant-Operator will be deployed.

### 2. Create Secret

```bash
oc apply -f -n stakater-tenant-operator stakater-docker-secret.yaml
```

Create a secret called `stakater-docker-secret` in *stakater-tenant-operator* namespace to pull Tenant-Operator image from dockerhub.

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
    - name: stakater-docker-secret
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 100m
        memory: 128Mi
```

This helm-release will deploy tenant-operator.

Once the image has been pulled `Tenant-Operator` will be ready for use.

### 4. Configuring IntegrationConfig

A default `IntegrationConfig` is installed with tenant-operator, which can be found in `stakater-tenant-operator` namespace under the name `tenant-operator-config`. For more details check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

## Note

* If tenant-operator is deployed in a newly created namespace. Then restart tenant-operators pod once so that tenant-operator can retrieve `webhook-server-cert` provided by openshift(if pod started before secret was made).
* For more details on how to use Tenant-Operator please refer [use-cases](../tenant-operator/usecases/quota.html).
