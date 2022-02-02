# External Secret Operator Workflow

The External Secret Operator (ESO for brevity) reconciles ExternalSecrets in the following manner:

- Secret is being created from External Secret
- External Secret refers Secret Store
- Secret Store refers Vault `Role` and `Service Account` for authentication
- `Secret Store` and `Service Account` comes through `Tenant Operator Template`


![External-Secrets](./images/external-secret-operator.png)