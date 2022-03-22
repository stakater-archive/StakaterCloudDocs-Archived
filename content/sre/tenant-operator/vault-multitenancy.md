# Vault Multitenancy

The pod is authenticated to vault by [kubernetes auth method](https://www.vaultproject.io/docs/auth/kubernetes). In vault, roles are associated with kubernetes service account. Roles, when associated with serviceaccount, permits it to read secret at particular path in vault.

In SAAP,policies and roles are automatically created by tenant operator that grants service accounts of namespace to **read** secrets at tenants path.

Role name is same as **namespace** name

![image](./images/tenant-operator-vault-auth.png)

fig 1. Shows how tenant operator manages authentication with vault
