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
vault kv get -tls-skip-verify secret/dummysecret
```

At this point vault is up and ready to use