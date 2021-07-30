# Add new environment

To add new environment in cluster do following steps in gitops directory

- Add environment folder inside cluster's argocd folder located in sre tenant directory.
  **\<sre-tenant>/\<cluster>/argocd/\<env>**

- Add environment folder inside config folder located in application tenants directory
  **\<application-tenant>/configs/\<env>**/argocd/

- Add environment folder in each application direcory located in application tenants directory
     - \<01-tenant>/\<01-application>/\<env>
     - \<01-tenant>/\<n-application>/\<env>
     - \<n-tenant>/\<n-application>/\<env>

- Add space file inside **each** application tenants config directory 
  **\<application-tenant>/configs/\<env>**/space.yaml
  ```
  apiVersion: tenantoperator.stakater.com/v1alpha1
  kind: Space
  metadata:
    name: <tenant>-<env>
    labels:
      team: <tenant>
      kind: <env>
      stakater.com/workload-monitoring: 'true'
    annotations:
      openshift.io/node-selector: node-role.kubernetes.io/worker= 
  spec:
    tenant: <tenant>
  ```

  Replace angle brackets with following values in Above templates:
  - \<tenant> : Name of the tenant
  - \<application-tenant> : Name of application tenant
  - \<sre-tenant> : Name of sre tenant
  - \<env>:  Environment name
  - \<nexus-repo>: url of nexus repository
