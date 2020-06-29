# Vault

[[toc]]

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

# Setting up Vault

Along with other tools stakater cloud provides vault as a built-in and recommended feature. Stakater is responsible for 
deploying it and hands-over the further configuration part to the end user. 
In our set-up we leverage on vault agent for lifecycle management of tokens, that are used for authentication. 

![vault-agent](./images/vault-agent.png)

## Choosing Auth Method

For simplicity we use [Kubernetes auth method](https://www.vaultproject.io/docs/auth/kubernetes.html) to authenticate 
the clients using a Kubernetes Service Account Token but you can configure
vault to use any of the [auth methods](https://www.vaultproject.io/docs/auth) based on your requirements.

## Prerequisites

On your local machine you should have curl, jq, [vault cli](https://www.vaultproject.io/docs/install) and [openshift cli](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html#cli-installing-cli_cli-developer-commands)

## Configuring vault
 
[[toc]]

### Make vault service accessible

Run `oc port-forward -n stakater-vault service/vault 8200:8200 &` to access vault service at https://127.0.0.1:8200
Alternatively, you can create a route/ingress for the service as well but that is not recommended since we are not exposing our
vault for the external world or services, no access outside the cluster.

### Run the following commands

```shell script

# Directory that will contain vault unseal key and root token
mkdir -p vault-secrets

export VAULT_ADDR=https://127.0.0.1:8200

# Initialize a vault server
curl \
  --insecure \
  --silent \
  --request PUT \
  --data '{"secret_shares": 1, "secret_threshold": 1}' \
  ${VAULT_ADDR}/v1/sys/init | tee \
  >(jq -r '.root_token' > vault-secrets/root-token) \
  >(jq -r '.keys[0]' > vault-secrets/unseal-key)

# Export unseal key and root token as environment variables, these are used for authentication
export KEYS=`cat vault-secrets/unseal-key`
export ROOT_TOKEN=`cat vault-secrets/root-token`
export VAULT_TOKEN=$ROOT_TOKEN

# Unseal vault to make it usable
vault operator unseal -tls-skip-verify $KEYS

# Set VAULT_SA_NAME to the service account you created earlier
export VAULT_SA_NAME=$(oc get sa vault -o jsonpath="{.secrets[*]['name']}" | grep -o '\S*vault-token\S*' | uniq)

# Set SA_JWT_TOKEN value to the service account JWT used to access the TokenReview API
export SA_JWT_TOKEN=$(oc get secret $VAULT_SA_NAME -o jsonpath="{.data.token}" | base64 --decode; echo)

# Set SA_CA_CRT to the PEM encoded CA cert used to talk to Kubernetes API
export SA_CA_CRT=$(oc get secret $VAULT_SA_NAME -o jsonpath="{.data['ca\.crt']}" | base64 --decode; echo)

export K8S_HOST="https://kubernetes.default.svc:443"

# Enable Kubernetes Auth Method
vault auth enable -tls-skip-verify kubernetes

# Write config
vault write -tls-skip-verify auth/kubernetes/config \
        token_reviewer_jwt="$SA_JWT_TOKEN" \
        kubernetes_host="$K8S_HOST" \
        kubernetes_ca_cert="$SA_CA_CRT"

# Create Admin Policy
echo '
path "secret/*" {
  capabilities = ["read", "list", "create", "update", "delete"]
}' | vault policy write -tls-skip-verify  default-policy -

# Create Read Policy
echo '
path "secret/*" {
  capabilities = ["read"]
}' | vault policy write -tls-skip-verify  read-policy -

# Enable KV secrets
vault secrets enable --tls-skip-verify -path=secret kv

# Create a role for binding the policy to a service account
vault write -tls-skip-verify auth/kubernetes/role/default-role \
        bound_service_account_names=default \
        bound_service_account_namespaces=default \
        policies=default-policy \
        ttl=24h

# Write sample secret
vault kv put -tls-skip-verify secret/helloworld ttl=1m username=test-user password=dummy-pass

# Retrieve to verify that it worked
vault kv get -tls-skip-verify secret/helloworld
```

At this point vault is up and ready to use.

# Important

`vault-secrets/root-token` and `vault-secrets/unseal-keys` are used for communication with vault via CLI and they should
be stored somewhere safe.

# Vault usage example

For consuming secrets that are stored in vault, we leverage on vault agent. Vault agent adds init containers and side-car
containers for populating secrets and managing token lifecycle.

![vault-agent-workflow](./images/vault-agent-workflow.png)

Let's go through a demonstration:

## Make vault accessible and set environment variables

```shell script
oc port-forward -n stakater-vault service/vault 8200:8200 &`

export VAULT_ADDR=https://127.0.0.1:8200
export KEYS=`cat vault-secrets/unseal-key`
export ROOT_TOKEN=`cat vault-secrets/root-token`
export VAULT_TOKEN=$ROOT_TOKEN
```

## Create namespace

Create a namespace to deploy our sample application that consumes secret stored in vault. We need to label the namespace
 with `vault.hashicorp.com/agent-webhook=enabled` to enable the injection of vault sidecars.
 
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: stakater-vault-demo
  labels:
    vault.hashicorp.com/agent-webhook: enabled
```

## Create service account

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app
  namespace: stakater-vault-demo
  labels:
    app: vault-agent-demo
```

## Create a role in vault for authentication

```shell script
# Create a role for binding the policy to a service account
vault write -tls-skip-verify auth/kubernetes/role/stakater-vault-demo-role \
        bound_service_account_names=app \
        bound_service_account_namespaces=stakater-vault-demo \
        policies=default-policy \
        ttl=24h
```

## Create a secret

```shell script
# Write sample secret
vault kv put -tls-skip-verify secret/helloworld ttl=1m username=test-user password=dummy-pass
```

## Required Annotations

To inject secrets, we must use the following annotations:

- `vault.hashicorp.com/agent-inject`: Enable or disable injection for a pod
- `vault.hashicorp.com/secret-volume-path`: Specifies the shared volume used by the Vault Agent containers for sharing secrets with the other containers in the pod.
- `vault.hashicorp.com/role:`: Specifies the role to be used for the Kubernetes auto-auth
- `vault.hashicorp.com/tls-skip-verify`: Enable or disable TLS verification while communicating with vault
- `vault.hashicorp.com/agent-pre-populate-only`: Only run init container(no side-cars), useful if secrets are not meant to be updated
- `vault.hashicorp.com/agent-inject-secret-{path-to-secret}`: Specify the secret to be retrieved
- `vault.hashicorp.com/agent-inject-template-{path-to-secret}`: Specify template to use for rendering the secrets 


## Deploy the application

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  namespace: stakater-vault-demo
  labels:
    app: vault-agent-demo
spec:
  selector:
    matchLabels:
      app: vault-agent-demo
  replicas: 1
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "stakater-vault-demo-role"
        vault.hashicorp.com/tls-skip-verify: 'true'
        #vault.hashicorp.com/agent-pre-populate-only: "true"
        vault.hashicorp.com/secret-volume-path: /vault/secrets/
        vault.hashicorp.com/agent-inject-secret-helloworld: "secret/helloworld"
        vault.hashicorp.com/agent-inject-template-helloworld: |
          {{- with secret "secret/helloworld" -}}
          postgresql://{{ .Data.username }}:{{ .Data.password }}@postgres:5432/wizard
          {{- end }}
      labels:
        app: vault-agent-demo
    spec:
      serviceAccountName: app
      containers:
        - image: docker.io/library/busybox
          name: app
          command: ["/bin/sh"]
          args:
            - -c
            - |
              echo "Value of secret is: "
              cat /vault/secrets/helloworld
```

## Verify 

You can verify the workflow through logs of the application pod.
