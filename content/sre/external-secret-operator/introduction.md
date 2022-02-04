# External Secret Operator

A kubernetes secret is sensitive information decoupled from the application code and stored in key-value pairs. The Secret object provides a declarative API that makes it easy for application Pods to access secret data.

## Problem: 
Kubernetes secret do not support storing or retrieving secret data from external secret management systems, e.g. [HashiCorp Vault](https://www.vaultproject.io/)

**External Secrets** solves this problem by providing access to secrets stored externally. It does this by adding an `ExternalSecret` object to Kubernetes using a [CustomResourceDefinition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/). Developer specifyies the secret management system as `backendType` and the properties to access in the manifest.

We use **External Secrets Operator** to integrates external secret management systems like HashiCorp Vault. The operator synchronizes secrets from external APIs into Kubernetes with the help of custom API resources - `ExternalSecret`, `SecretStore` and `ClusterSecretStore`.

## Secret Store 
It defines how to fetch the data. It defines provider, e.g. vault, its server address, path for secrets, and its authentication method, e.g. service account bound with Vault role and policy.
```yaml
apiVersion: external-secrets.io/v1alpha1
kind: SecretStore
metadata:
    name: tenant-vault-secret-store
spec:
    provider:
    vault:
        server: "http://vault.stakater-vault:8200"
        path: "gabbar/kv"
        version: "v2"
        auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "gabbar-dev"
          serviceAccountRef:
            name: "tenant-vault-access"
            namespace: "gabbar-dev"
```

## External Secret
It declares what data to fetch. It has a reference to a SecretStore which knows how to access that data.
```yaml
apiVersion: external-secrets.io/v1alpha1
kind: ExternalSecret
metadata:
  name: example
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: tenant-vault-secret-store
    kind: SecretStore
  data:
  - secretKey: secret-key-to-be-managed
    remoteRef:
      key: provider-key
      property: provider-key-property
  dataFrom:
  - key: remote-key-in-the-provider
```

## Cluster Secret Store
It is a global, cluster-wide SecretStore that can be referenced from all namespaces. Used for secrets that need to be distributed across all namespaces.
