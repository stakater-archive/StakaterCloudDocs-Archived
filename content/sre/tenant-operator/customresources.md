# Custom Resources

Tenant Operator defines following 5 custom resources:

1. Quota
2. Tenant
3. Template
4. TemplateInstance
5. TemplateGroupInstance

## 1. Quota

**Cluster scoped resource**

```yaml
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Quota
metadata:
  name: medium
  annotations:
    quota.tenantoperator.stakater.com/is-default: "false"
spec:
  resourcequota:
    hard:
      requests.cpu: '5'
      limits.cpu: '10'
      requests.memory: '5Gi'
      limits.memory: '10Gi'
      configmaps: "10"
      persistentvolumeclaims: "4"
      replicationcontrollers: "20"
      secrets: "10"
      services: "10"
      services.loadbalancers: "2"
  limitrange:
    limits:
      - type: "Pod"
        max:
          cpu: "2"
          memory: "1Gi"
        min:
          cpu: "200m"
          memory: "100Mi"
      - type: "Container"
        max:
          cpu: "2"
          memory: "1Gi"
        min:
          cpu: "100m"
          memory: "50Mi"
        default:
          cpu: "300m"
          memory: "200Mi"
        defaultRequest:
          cpu: "200m"
          memory: "100Mi"
        maxLimitRequestRatio:
          cpu: "10"
```

When several tenants share a single cluster with a fixed number of resources, there is a concern that one tenant could use more than its fair share of resources. Quota is a wrapper around OpenShift `ClusterResourceQuota` and `LimitRange` which provides administrators to limit resource consumption per `Tenant`.
For more details [Quota.Spec](https://kubernetes.io/docs/concepts/policy/resource-quotas/) , [LimitRange.Spec](https://kubernetes.io/docs/concepts/policy/limit-range/)

## 2. Tenant

**Cluster scoped resource**

```yaml
apiVersion: tenantoperator.stakater.com/v1beta1
kind: Tenant
metadata:
  name: alpha
spec:
  owners:
    users:
      - haseeb@stakater.com
    groups:
      - alpha
  editors:
    users:
      - hanzala@stakater.com
  viewers:
    users:
      - jose@stakater.com
  sandbox: false
  quota: medium
  argocd:
    sourceRepos:
      - https://github.com/stakater/gitops-config
  namespaces:
  - dev
  - build
  - preview
  namespaceLabels:
    app.kubernetes.io/managed-by: tenant-operator
  namespaceAnnotations:
    openshift.io/node-selector: node-role.kubernetes.io/infra=
  templateInstances:
  - spec:
      template: networkpolicy
    parameters:
      - name: CIDR_IP
        value: "172.17.0.0/16"
    selector:
      matchLabels:
        policy: network-restriction
```

* Tenant has 3 kinds of `Members`:
  * `Owners:` Users who will be owners of a tenant. They will have openshift admin-role assigned to their users, with additional access to create namespaces as well.
  * `Editors:` Users who will be editors of a tenant. They will have openshift edit-role assigned to their users.
  * `Viewers:` Users who will be viewers of a tenant. They will have openshift view-role assigned to their users.
  * For more [details](https://docs.cloud.stakater.com/content/sre/tenant-operator/tenant_roles.html).

* `Users` can be linked to the tenant by specifying there username in `owners.users`, `editors.users` and `viewers.users` respectively.

* `Groups` can be linked to the tenant by specifying the group name in `owners.groups`, `editors.groups` and `viewers.groups` respectively.

* Tenant will have a `Quota` to limit resource consumption.

* `argocd` can be used to list `sourceRepos` that point to your gitops repositories. The field is required if you want to create an ArgoCD AppProject for the tenant.

* `namespaceLabels` can be used to distribute common labels among tenant namespaces.

* `namespaceAnnotations` can be used to distribute common annotations among tenant namespaces.

* Tenant will have an option to create *sandbox namespaces* for owners and editors, when `sandbox` is set to *true*.
  * Sandbox will follow the following naming convention **{TenantName}**-**{UserName}**-*sandbox*.
  * In case of groups, the sandbox namespaces will be created for each member of the group.

* Namespaces can also be created via tenant CR by *specifying names* in `namespaces`.
  * Tenant-Operator will append *tenant name* prefix while creating namespaces, so the format will be **{TenantName}**-**{Name}**.
  * `stakater.com/kind: {Name}` label will also be added to the namespaces.

* Tenant automatically deploys `template` resource mentioned in `templateInstances` to matching tenant namespaces.
  * `Template` resources are created in those `namespaces` which belong to a `tenant` and contain `matching labels`.
  * `Template` resources are created in all `namespaces` of a `tenant` if `selector` field is empty.

::: warning Warning:

* If tenant is deleted, then all namespaces created by tenant will also be deleted(spec.namespaces and sandbox namespaces).  

:::

## 3. Template

**Cluster scoped resource**

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
---
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: Template
metadata:
  name: networkpolicy
parameters:
  - name: CIDR_IP
    value: "172.17.0.0/16"
resources:
  manifests:
    - kind: NetworkPolicy
      apiVersion: networking.k8s.io/v1
      metadata:
        name: deny-cross-ns-traffic
      spec:
        podSelector:
          matchLabels:
            role: db
        policyTypes:
        - Ingress
        - Egress
        ingress:
        - from:
          - ipBlock:
              cidr: "${{CIDR_IP}}"
              except:
              - 172.17.1.0/24
          - namespaceSelector:
              matchLabels:
                project: myproject
          - podSelector:
              matchLabels:
                role: frontend
          ports:
          - protocol: TCP
            port: 6379
        egress:
        - to:
          - ipBlock:
              cidr: 10.0.0.0/24
          ports:
          - protocol: TCP
            port: 5978
```

Templates are used to initialize Namespaces and share common resources across namespaces (e.g. secrets).

* They either contains one or more Kubernetes manifests or alternatively a Helm chart.
* They are being tracked by TemplateInstances in each Namespace they are applied to.
* They can contain pre-defined parameters such as ${namespace}/${tenant} or user-defined ${MY_PARAMETER} that can be specified within an TemplateInstance.

Also you can define custom variables in `Template` and `TemplateInstance` . The parameters defined in `TemplateInstance` are overwritten the values defined in `Template` .

<details open>
  <summary>Manifest Templates</summary>
  <p>The easiest option to define a Template is by specifying an array of Kubernetes manifests which should be applied when the Template is being instantiated.</p>
</details>
<details open>
  <summary> Helm Chart Templates</summary>
  <p>Instead of manifests, a Template can specify a Helm chart that will be installed (using helm template) when the Template is being instantiated.</p>
</details>

### Mandatory and Optional Templates

 Templates can either be mandatory or optional. By default, all Templates are optional. Cluster Admins can make Templates mandatory by adding them to the `spec.templateInstances` array within the Tenant configuration. All Templates listed in `spec.templateInstances` will always be instantiated within every `Namespace` that is created for the respective Tenant.

## 4. TemplateInstance

**Namespace scoped resource**

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateInstance
metadata:
  name: redis-instance
  namespace: build
spec:
  template: redis
  sync: false
```

TemplateInstance are used to keep track of resources created from Templates, which are being instantiated inside a Namespace.
Generally, a TemplateInstance is created from a Template and then the TemplateInstances will not be updated when the Template changes later on. To change this behavior, it is possible to set `spec.sync: true` in a TemplateInstance. Setting this option, means to keep this TemplateInstance in sync with the underlying template (similar to helm upgrade).

## 5. TemplateGroupInstance

**Cluster scoped resource**

```yaml
apiVersion: tenantoperator.stakater.com/v1alpha1
kind: TemplateGroupInstance
metadata:
  name: redis-instance
spec:
  template: redis
  selector:
    matchLabels:
      app: redis
  sync: true
```

TemplateGroupInstance distributes a template across multiple namespaces which are selected by labelSelector.

## Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    stakater.com/tenant: blue-sky
  name: build
```

* Namespace should have label `stakater.com/tenant` which contains the name of tenant to which it belongs to. The labels and annotationos specified in the operator config,  `ocp.labels.project` and `ocp.annotations.project` are inserted in the namespace by the controller.

## Notes

* `tenant.spec.users.owner`: Can only create *Namespaces* with required *tenant label* and can delete *Projects*. To edit *Namespace* use `GitOps/ArgoCD`
