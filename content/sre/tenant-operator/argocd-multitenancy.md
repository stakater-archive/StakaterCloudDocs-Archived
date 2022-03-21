# ArgoCD Multitenancy

ArgoCD is a declarative GitOps tool built to deploy applications to Kubernetes. While the continuous delivery (CD) space is seen by some as crowded these days, ArgoCD does bring some interesting capabilities to the table. Unlike other tools, ArgoCD is lightweight and easy to configure.

# Why ArgoCD?

Application definitions, configurations, and environments should be declarative and version controlled. Application deployment and lifecycle management should be automated, auditable, and easy to understand.

# ArgoCD integration in Tenant Operator

With Tenant Operator, cluster admins can configure multi tenancy in their cluster. Now with ArgoCD integration, multi tenancy can be configured in ArgoCD applications and AppProjects.

Tenant Operator (if configured to) will create AppProjects for each tenant. The AppProject will allow Tenants to create ArgoCD Applications that can be synced to namespaces owned by those tenants. Cluster admins will also be able to blacklist certain resources if they want (see the `NamespaceResourceBlacklist` section in [Integration Config docs](./integration-config.html)).

Note that ArgoCD integration in Tenant Operator is completely optional.

# Default ArgoCD configuration

We have set a default ArgoCD configuration in Tenant Operator that fulfils the following use cases:

- Tenants are able to see only their ArgoCD applications in the ArgoCD frontend
- Tenant 'Owners' and 'Editors' will have full access to their ArgoCD applications
- Tenants in the 'Viewers' group will have read-only access to their ArgoCD applications
- Tenants can only sync namespaced resources via their applications
- Tenant 'Owners' can configure their own gitops source repos at a tenant level
- Cluster admins can prevent specific resources from syncing via ArgoCD
- Cluster admins have full access to all ArgoCD applications and AppProjects

Detailed use cases showing how to create AppProjects are mentioned in [use cases for ArgoCD](./usecases/argocd.html).
