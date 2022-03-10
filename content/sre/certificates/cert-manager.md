# Cert Manager Operator

SAAP uses [Cert-Manager](https://cert-manager.io/) to provide Automatic rotation of Certificates for application workloads.
It will ensure certificates are valid and up to date, and attempt to renew certificates at a configured time before expiry. It can issue certificates from a variety of supported sources, including `Let's Encrypt`, `HashiCorp Vault`, and `Venafi` as well as `private PKI`.

## Example Certificate Generation using Let's Encrypt

Before you start creating Cerificates, you will have to first define a `Issuer`(namespace scoped) or `ClusterIssuer`(cluster scoped).

::: warning Note:
Any secret that is referred by ClusterIssuer would have to be present only in the project `stakater-cert-manager-operator`. So create CA,DNS credentials secrets in this project.

Secret can reside in the same namespace for Issuer
:::

::: tip
Consider using the cluster's default domain i.e. `*.kubeapp.cloud` for CI/staging envionment which are all secured by SAAP by default
:::

### Defining ClusterIssuer

Two types of acme solvers are supported, The Pros and Cons of both strategies can be seen on the link:

1. [HTTP01 Challenge](https://letsencrypt.org/docs/challenge-types/#http-01-challenge)
2. [DNS01 Challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge)


#### HTTP01 Challenge
For HTTP01 Challenge you just need to specify ingress field:
```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: <YOUR_EMAIL_ADDRESS>             # lets encrypt account. WIll create if not already exist
    preferredChain: "ISRG Root X1"
    privateKeySecretRef:
      name: letsencrypt-prod-account-key    # Secret resource that will be used to store the account's private key.
    solvers:
      - http01:
          ingress: {}
```

#### DNS01 Challenge
For DNS01 Challenge you need to first create a secret in `stakater-cert-manager-operator` namespace that should contain the values to alter entries in your DNS provider. Following is an example for configuring AWS's Route53. Check configuration for your provider [here](https://cert-manager.io/v1.7-docs/configuration/acme/dns01/#supported-dns01-providers)

::: tip
 Use Limited acccess to the account being used for DNS01 Challenge automation 
:::

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    email: <YOUR_EMAIL_ADDRESS>         # lets encrypt account. WIll create if not already exist
    server: https://acme-v02.api.letsencrypt.org/directory
    preferredChain: "ISRG Root X1"
    privateKeySecretRef:
      name: issuer-account-key          # Secret resource that will be used to store the account's private key.
    solvers:
    - dns01:
        route53:
          accessKeyID: <AWS_ACCESS_KEY_ID>
          region: eu-north-1            # default region
          secretAccessKeySecretRef:     # Secret with key "aws_secret_access_key" must exist in `stakater-cert-manager-operator`
            name: aws-creds
            key: aws_secret_access_key  
```

::: warning Limitations:

1. Wildcard certificates can only be issued by DNS01 Challenges not with HTTP01 Challenges.
2. You can only issue 50 certificates per Registered Domain. [See Details here](https://letsencrypt.org/docs/rate-limits/)
3. If you think you need more certificates for your staging/CI environment consider using a [Staging server](https://letsencrypt.org/docs/staging-environment/). The only downside for this strategy is that browser will not trust the CI/staging environment certificate.
:::

### Generating Certificate

Now that we have a working ClusterIssuer we can issue certificates like below. TLS certificates will be stored in a secret called `certman-generated-tls` in the namespace `myapp-ns`

```
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: openshift-cluster-certificate
  namespace: myapp-ns                # Namespace where generated TLS will be created
spec:
  commonName: 'myapp.example.com'
  dnsNames:                          # DNS names which this certificate will verify
  - 'myapp.example.com'
  - '*.myapp.example.com'
  duration: 2160h
  renewBefore: 720h                  # Renew time before expiration of the current certificate
  issuerRef:
    kind: ClusterIssuer
    name: letsencrypt
  secretName: certman-generated-tls  # Name of the TLS secret to be created 
  subject:
    countries:
    - "Sweden"
    organizations:
    - "Stakater Inc."
```