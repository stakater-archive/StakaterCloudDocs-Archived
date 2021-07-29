```.
├── 01-tenant
│   ├── 01-app
│   │   ├── 00-env
│   │   │   └── nginx.yaml
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
│   │   │   └── argocd.yaml
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
│   │   │   └── tenants.yaml
│   │   └── tenants
│   │       ├── 01-tenant.yaml
│   │       ├── quota.yaml
│   │       └── 02-tenant.yaml
│   └── 02-cluster
│       ├── argocd
│       │   ├── 02-env
│       │   │   ├── 01-tenant.yaml
│       │   │   └── 02-tenant.yaml
│       │   ├── 03-env
│       │   │   ├── 01-tenant.yaml
│       │   │   └── 02-tenant.yaml
│       │   └── tenants.yaml
│       └── tenants
│           ├── 01-tenant.yaml
│           ├── quota.yaml
│           └── 02-tenant.yaml
└── README.md
```

The same configured gitops directory can be found [here](https://github.com/stakater/gitops-config-template)

Above structure supports following

- mutli cluster
- mutli tenant
- multi application
- multi environment

## Layer 1 - Tenant

At the root of repository, it has folder with tenant name. tenant is a snonym of team. Each tenant will get its own folder in the root of repository e.g. alpha, beta, etc.. There are two type of tenants:

1. **Application Tenants:**  Tenants that have one or more applications
2. **Sre Tenant:** Tenant that is responsible for cluster level configuration

Each type of tenant follows different structure.

## Application Tenant

### Layer 2 - Application/Config
 
#### Application

Inside application tenants folder, there is a separate folder of each application that belongs to a tenant. The name of the folder should match repository name in SCM.

#### Config

Inside config folder there is a folder for each environment. In each environment folder there are 2 entities.

1. **Space.yaml**: File that contains space configuration for each environment. Space is a stakater created ```Tenant-Operator``` Custom Resource that is responsible for creating namespace and assigning appropirate permission to associated tenant
2. **argocd**:  Folder that contains argocd ```Application``` Custom Resource that watches deployments files in ```<tenant>/<app>/<env>```  (Layer#3 Environment) folder

### Layer 3 - Environment

Inside each folder, there is separate folder of environment which application will gets deployed to. Inside each environment folder there will be actual deployment files. 

Deployment files can only be vanilla yaml files, helm chart and kustomize repository that are supported by argocd.

## SRE Tenant

### Layer 2 - Cluster

At the root of SRE tenant, there is a folder of each cluster.

### Layer 3 - Configs

In each cluster folder there are config files for cluster. It is further divided in 2 folders
   - tenants
   - argocd

### Tenants

Tenants folder contain custom resources of ```Tenant Operator```. They are following

- quota: Amount of resource(configmaps,cpus,memory) for each tenant that it can consume
- tenant: Contains file for each team. it contain information of members that are part of tenant.

### Argocd

This folder is a starting point of all configuration in the cluster. ArgoCD by default is configured to watch this folder. Inside the folder,we have sub-folder for each environment that is a part of cluster. Environment folders contain ```Application``` CR's that are responsible for bringing up the whole environment.
