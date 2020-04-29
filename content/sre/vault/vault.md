# Introduction

Vault is a tool for securely accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, or certificates. 
Vault provides a unified interface to any secret, while providing tight access control and recording a detailed audit log.

When you create a secret in kubernetes it is stored in etcd as plain text, also the secret is accessible to anyone that has access to your cluster.

## Limitations of kubernetes secrets
1. They are not encrypted at rest.
2. By default, cluster admins can see all the secrets of all the tenants.
3. When in use (i.e. mounted as tempfs in the node that runs the pod that is using them), they can be seen by a node administrator.
4. When in use, they can be seen by anyone who has the ability to remote shell into the container.

Vault solves this issue by providing a central secret management store that provides an additional layer of security using it's
authentication methods. Secrets are only accessible when you provide a corresponding token. Vault is an application written in GO with a with a REST and CLI interface support. For access of secrets vault uses tokens.
Tokens are created on demand with a specified expiry time and can be revoked at any given time. 

## Key features of Vault
1. Centralization
2. Audit Control
3. Dynamic Secrets
4. Encryption as a Service
5. Leasing, Renewal and Revocation

For detailed documentation: [Vault Documentation](https://learn.hashicorp.com/vault#getting-started)  