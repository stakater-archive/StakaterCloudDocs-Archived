# GitOps structure

```.
├── 01-tenant
│   ├── 01-app
│   │   ├── 00-env
│   │   │   └── deployment.yaml
│   │   ├── 01-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   ├── 02-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   └── 03-env
│   │       ├── Chart.yaml
│   │       └── values.yaml
│   ├── 02-app
│   │   ├── 00-env
│   │   │   └── deployment.yaml
│   │   ├── 01-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   ├── 02-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   └── 03-env
│   │       ├── Chart.yaml
│   │       └── values.yaml
│   └── configs
│       ├── 00-env
│       │   └── space.yaml
│       │   ├── argocd
│       │   │   ├── 02-app
│       │   │   └── 01-app
│       ├── 01-env
│       │   ├── argocd
│       │   │   ├── 02-app
│       │   │   └── 01-app
│       │   └── space.yaml
│       ├── 02-env
│       │   ├── argocd
│       │   │   ├── 02-app
│       │   │   └── 01-app
│       │   └── space.yaml
│       └── 03-env
│           ├── argocd
│           │   ├── 02-app
│           │   └── 01-app
│           └── space.yaml
├── 02-tenant
│   ├── 01-app
│   │   ├── 00-env
│   │   ├── 01-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   ├── 02-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   └── 03-env
│   │       ├── Chart.yaml
│   │       └── values.yaml
│   └── configs
│       ├── 00-env
│       │   ├── argocd
│       │   │   └── 01-app.yaml
│       │   └── space.yaml
├       |── 01-env
│       |   ├── argocd
│       |   │   └── 01-app
│       |   └── space.yaml
│       ├── 02-env
│       │   ├── argocd
│       │   │   └── 01-app.yaml
│       │   └── space.yaml
│       └── 03-env
│           ├── argocd
│           │   └── 01-app.yaml
│           └── space.yaml
├── 03-sre
│   ├── 01-cluster
│   │   ├── argocd
│   │   │   ├── 00-env
│   │   │   │   └── 01-tenant.yaml
│   │   │   ├── 01-env
│   │   │   │   ├── 01-tenant.yaml
│   │   │   │   └── 02-tenant.yaml
│   |    │   └── tenant-operator.yaml
│   |    └── tenant-operator
│   |        ├── quota
│   |        │   ├── 01-quota.yaml
│   |        │   ├── 02-quota.yaml
│   |        │   └── 03-quota.yaml
│   |        └── tenants
│   |            ├── 01-tenent.yaml
│   |            └── 02-tenent.yaml
│   └── 02-cluster
│      ├── argocd
│       │   ├── 02-env
│       │   │   ├── 01-tenant.yaml
│       │   │   └── 02-tenant.yaml
│       │   ├── 03-env
│       │   │   ├── 01-tenant.yaml
│       │   │   └── 02-tenant.yaml
│       │   └── tenant-operator.yaml
│       └── tenant-operator
│           ├── quota
│           │   ├── 01-quota.yaml
│           │   ├── 02-quota.yaml
│           │   └── 03-quota.yaml
│           └── tenants
│               ├── tenant-1.yaml
│               └── tenant-2.yaml

└── README.md
```

The sample configured gitops directory can be found [here](https://github.com/stakater/gitops-config-template)

Above structure supports following

- mutli cluster
- mutli tenant
- multi application
- multi environment

## Tenant Types

At the root of repository, it has folder with tenant name; tenant is a snonym of team. Each tenant will get its own folder at the root of repository e.g. alpha, beta, etc. There are two type of tenants:

1. **Application Tenants:**  Tenants that have one or more applications
2. **SRE or DeliveryEngineering Tenant:** Tenant that is responsible for cluster level configuration

Each type of tenant follows different structure.

## Application Tenant

```
├── 01-tenant
│   ├── 01-app
│   │   ├── 00-env
│   │   │   └── deployment.yaml
│   │   ├── 01-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   ├── 02-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   └── 03-env
│   │       ├── Chart.yaml
│   │       └── values.yaml
│   ├── 02-app
│   │   ├── 00-env
│   │   │   └── deployment.yaml
│   │   ├── 01-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   ├── 02-env
│   │   │   ├── Chart.yaml
│   │   │   └── values.yaml
│   │   └── 03-env
│   │       ├── Chart.yaml
│   │       └── values.yaml
│   └── configs
│       ├── 00-env
│       │   └── space.yaml
│       │   ├── argocd
│       │   │   ├── 02-app
│       │   │   └── 01-app
│       ├── 01-env
│       │   ├── argocd
│       │   │   ├── 02-app
│       │   │   └── 01-app
│       │   └── space.yaml

```

It contains 2 type of folders.

### 1. Applications

Inside application tenants folder, there is a separate folder of each application that belongs to a tenant. The name of the folder should match repository name in SCM.

#### Environments

Inside each appication folder, there is a separate folder of each environment where application will gets deployed to. Inside each environment folder there will be actual deployment files. 

Deployment files can only be vanilla yaml files, helm chart and kustomize repository that are supported by argocd.

### 2. Configs

Inside config folder there is a folder for each environment. In each environment folder there are 2 entities.

1. **Space.yaml**: File that contains space configuration for each environment. Space is a stakater created ```Tenant-Operator``` Custom Resource that is responsible for creating namespace and assigning appropirate permission to associated tenant members
2. **argocd**:  Folder that contains argocd ```Application``` Custom Resource that watches deployments files in ```<tenant>/<app>/<env>```  (Layer#3 Environment) folder

## SRE or DeliveryEngineering Tenant

Below is the structure of SRE tenant

```
├── 03-sre
│   ├── 01-cluster
│   │   ├── argocd
│   │   │   ├── 00-env
│   │   │   │   └── 01-tenant.yaml
│   │   │   ├── 01-env
│   │   │   │   ├── 01-tenant.yaml
│   │   │   │   └── 02-tenant.yaml
│   |    │   └── tenant-operator.yaml
│   |    └── tenant-operator
│   |        ├── quotas
│   |        │   ├── 01-quota.yaml
│   |        │   ├── 02-quota.yaml
│   |        │   └── 03-quota.yaml
│   |        └── tenants
│   |            ├── 01-tenant.yaml
│   |            └── 02-tenant.yaml
```

### Cluster

At the root of SRE tenant, there is a folder of each cluster.

In each cluster folder there are config files for particular cluster. It is further divided into 2 sub folders:

#### Tenant-Operator

tenant-operator folder contain custom resources of ```Tenant Operator```. They are following

- quotas: Amount of resource (configmaps, cpus, memory, egc.) for each tenant that can consume.
- tenants: Contains file for each team. It contain information of members that are part of tenant.

#### ArgoCD

This folder is a starting point of all configuration in the cluster. ArgoCD by default is configured to watch this folder. Inside the folder we have following:

- tenant-operator.yaml: Responsible for creating tenants configuration in the cluster
- Environment(s) Folder: Sub-folder for each environment that is a part of cluster. Environment folders contain ```Application``` CR's that are responsible for bringing up the particular environment.
