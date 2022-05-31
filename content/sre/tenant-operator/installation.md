# Installation

This document contains instructions on installing and configuring Tenant-Operator using Openshift MarketPlace or Helm. Following are the 4 different ways available

1. [Openshift OperatorHub](#installing-via-operatorhub)

2. [Subscription](#installing-via-subscription)

3. [Helm](#installing-via-helm)

4. [HelmRelease](#installing-via-helm-release)

## Requirements

* An **Openshift** cluster [v4.7 - v4.10]
* [**Helm-CLI**](https://helm.sh/docs/intro/install/) (Optional: *[For installing via helm](#installing-via-helm)*)
* **Helm-Operator** (Optional: *[For installing via helm-release](#installing-via-helm-release)*)

## Installing via OperatorHub

* After opening OpenShift console click on `Operators`, followed by `OperatorHub` from the side menu

![image](./images/operatorHub.png)

* Now search for `tenant-operator` and then click on `tenant-operator`

![image](./images/search_tenant_operator_operatorHub.png)

* Click on the `install` button

![image](./images/to_install_1.png)

* After configuring `Update approval` click on the `install` button

![image](./images/to_install_2.png)

* Wait for the operator to be installed

![image](./images/to_install_wait.png)

* Once successfully installed, Tenant-Operator will be ready to enforce multi-tenancy in your cluster

![image](./images/to_installed_successful.png)

::: warning Note:

* Tenant-Operator will be installed in `openshift-operators` namespace by OperatorHub

:::

### Configuring IntegrationConfig

IntegrationConfig is required to configure the settings of multi-tenancy for Tenant-Operator.

* We recommend using the following IntegrationConfig as a starting point

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: openshift-operators
spec:
  openshift:
    privilegedNamespaces:
      - default
      - ^openshift-*
      - ^kube-*
      - ^redhat-*
    privilegedServiceAccounts:
      - ^system:serviceaccount:default-*
      - ^system:serviceaccount:openshift-*
      - ^system:serviceaccount:kube-*
      - ^system:serviceaccount:redhat-*
```

For more details and configurations check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

::: warning Note:

* IntegrationConfig with the name `tenant-operator-config` should be present in Tenant-Operators installed namespace

:::

## Installing via Subscription

* Create a subscription YAML for tenant-operator and apply it in `openshift-operators` namespace

```bash
$ oc create -f - << EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: tenant-operator
  namespace: openshift-operators
spec:
  channel: alpha
  installPlanApproval: Automatic
  name: tenant-operator
  source: certified-operators
  sourceNamespace: openshift-marketplace
  startingCSV: tenant-operator.v0.3.33
EOF
subscription.operators.coreos.com/tenant-operator created
```

* After creating the `subscription` custom resource open OpenShift console and click on `Operators`, followed by `Installed Operators` from the side menu

![image](./images/installed-operators.png)

* Wait for the installation to complete

![image](./images/to_sub_installation_wait.png)

* Once the installation is complete click on `Workloads`, followed by `Pods` from the side menu

![image](./images/to_sub_installation_successful.png)

* Select `openshift-operators` project

![image](./images/select_openshift_operators_project.png)

* Wait for the pods to start

![image](./images/to_installed_wait_pod.png)

* Once pods are up and running, Tenant-Operator will be ready to enforce multi-tenancy in your cluster

![image](./images/to_installed_successful_pod.png)

### Configuring IntegrationConfig

IntegrationConfig is required to configure the settings of multi-tenancy for Tenant-Operator.

* We recommend using the following IntegrationConfig as a starting point

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: IntegrationConfig
metadata:
  name: tenant-operator-config
  namespace: openshift-operators
spec:
  openshift:
    privilegedNamespaces:
      - default
      - ^openshift-*
      - ^kube-*
      - ^redhat-*
    privilegedServiceAccounts:
      - ^system:serviceaccount:default-*
      - ^system:serviceaccount:openshift-*
      - ^system:serviceaccount:kube-*
      - ^system:serviceaccount:redhat-*
```

For more details and configurations check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

::: warning Note:

* IntegrationConfig with the name `tenant-operator-config` should be present in Tenant-Operators installed namespace

:::

## Installing via Helm

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
helm repo update

helm install tenant-operator stakater/tenant-operator --namespace stakater-tenant-operator \
--set image.repository=stakaterdockerhubpullroot/tenant-operator \
--set imagePullSecrets[0].name=stakater-docker-secret \
--set resources.limits.cpu=600m \
--set resources.limits.memory=600Mi \
--set resources.requests.cpu=100m \
--set resources.requests.memory=128Mi \
--set integrationConfig.create=true
```

Once the image has been pulled `Tenant-Operator` will be ready for use.

### 5. Configuring IntegrationConfig

A default `IntegrationConfig` is installed with tenant-operator, which can be found in `stakater-tenant-operator` namespace under the name `tenant-operator-config`. For more details check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

## Installing via Helm Release

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
    integrationConfig:
      create: true
    image:
      repository: stakaterdockerhubpullroot/tenant-operator
      tag:  v0.2.24
      pullPolicy: IfNotPresent
    imagePullSecrets:
    - name: stakater-docker-secret
    resources:
      limits:
        cpu: 600m
        memory: 600Mi
      requests:
        cpu: 100m
        memory: 128Mi
```

This helm-release will deploy tenant-operator.

Once the image has been pulled `Tenant-Operator` will be ready for use.

### 4. Configuring IntegrationConfig

A default `IntegrationConfig` is installed with tenant-operator, which can be found in `stakater-tenant-operator` namespace under the name `tenant-operator-config`. For more details check out [IntegrationConfig](https://docs.cloud.stakater.com/content/sre/tenant-operator/integration-config.html).

## Notes

* If tenant-operator is deployed in a newly created namespace, restart its pod once so tenant-operator can retrieve webhook-server-cert provided by openshift(if the pod is started before the secret was made).
* For more details on how to use Tenant-Operator please refer [use-cases](../tenant-operator/usecases/quota.html).
* For more details on how to extend your Tenant-Operator manager ClusterRole please refer [use-cases](../tenant-operator/usecases/manager-clusterrole.html).
