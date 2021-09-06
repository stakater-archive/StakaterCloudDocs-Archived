# How to host Custom Domains?

Consider have a domain `custom.domain.com`; and you want to host your application on your own domain instead of the default route provided by SAAP i.e. `<MYAPP_NAME>-<MYAPP_NAMESPACE>.apps.<CLUSTER_NAME>.<CLUSTER_ID>.kubeapp.cloud`. You can follow these steps in order to use your own domain:

1. Configure DNS
2. Configure TLS Certificates
3. Create Ingress for your Application
4. Verify

## 1. Configure DNS

In order to host your application on `custom.domain.com`. You need to point your DNS address on the public IP of the cluster's default router

### Option # 1: Create Manual entries
#### Obtain Public IP Address

Use the following command to get the Public IP address of your cluster:
```
nslookup "*.apps.$(oc get dns -ojsonpath='{.items[0].spec.baseDomain}')" | grep Address | tail -1
```

#### Create entry in your DNS Provider
Add and `A` entry in your DNS provider to point `custom.domain.com` to the public IP obtained in the previous step.

### Option # 2: ExternalDNS

_TODO_


## 2. Configure TLS certificate secret

There are two ways to configure TLS Certificate secret:

1. Certmanager Operator
2. Bring Your Own Certificates (BYOC)

### Option # 1: Certmanager Operator

Certmanager Operator let's you automate the certification issuing process via Let's Encrypt CA. These Certificates are generated and can be rotated automatically via Certmanager Operator whenever an Ingress is created with annotation: `cert-manager.io/cluster-issuer: <ISSUER_NAME>`

#### ACME Solvers

Two types of acme solvers are supported, The Pros and Cons of both strategies can be seen on the link:
  1. (HTTP01 Challenge)[https://letsencrypt.org/docs/challenge-types/#http-01-challenge]
  2. (DNS01 Challenge)[https://letsencrypt.org/docs/challenge-types/#dns-01-challenge]

###### HTTP01 Challenge
For HTTP01 Challenge you just need to specify ingress field:
```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: ca-issuer
  namespace: openshift-ingress
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: <YOUR_EMAIL_ADDRESS>
    preferredChain: "ISRG Root X1"
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress: {}
```

###### DNS01 Challenge
For DNS01 Challenge you need to first create a secret `in kube-system` that should contain the values to alter entries in your DNS provider. Following is an example for configuring AWS's Route53. Check configuration for your provider (here)[https://cert-manager.io/v1.5-docs/configuration/acme/dns01/#supported-dns01-providers]

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    # lets encrypt account
    email: <YOUR_EMAIL_ADDRESS>
    server: https://acme-v02.api.letsencrypt.org/directory
    preferredChain: "ISRG Root X1"
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      name: issuer-account-key
    solvers:
    - dns01:
        route53:
          accessKeyID: <AWS_ACCESS_KEY_ID>
          region: eu-north-1            # default region
          secretAccessKeySecretRef:     # Reference to the secret holding value for AWS_SECRET_ACCESS_KEY in kube-system namespace  
            name: aws-creds
            key: aws_secret_access_key
```
#### Limitations

1. Wildcard certificates can only be issued by DNS01 Challenges not with HTTP01 Challenges.
2. You can only issue 50 certificates per Registered Domain. [See Details here](https://letsencrypt.org/docs/rate-limits/)
3. If you think you need more certificates for your staging/CI environment consider using a [Staging server](https://letsencrypt.org/docs/staging-environment/). The only downside for this strategy is that browser will not trust the CI/staging environment certificate.

  > TIP: Consider using the cluster's default domain i.e. `*.kubeapp.cloud` for CI/staging envionment which are all secured by SAAP by default

### Option # 2: Bring Your Own Certificates (BYOC)

Generate TLS certificates of your domain i.e. `custom.domain.com` from your preferred CA and create a secret of the following format (secret can be secured via [SealedSecrets](../secrets/sealed-secrets.md#Secrets-Management-using-Sealed-Secrets-Controller)).

Replace concealed values with the corresponding base64 encoded certificate values.

```yaml
apiVersion: v1
data:
  ca.crt: "<concealed>"
  tls.crt: "<concealed>"
  tls.key: "<concealed>"
kind: Secret
metadata:
# Add a unique name that includes your domain
  name: custom-domain-tls-cert
  namespace: <APP_NAMESPACE>
type: kubernetes.io/tls
```
This TLS certificate then can be referred in tls section of the Ingress resource.


## 3. Create Ingress for your Application

In you application values add Ingress section as followings:

```yaml
...
ingress:
  enabled: true
  servicePort: <SERVICE_PORT>
  hosts:
  - cusotm.domain.com
  annotations:
    cert-manager.io/cluster-issuer: ca-issuer
  tls:
  - hosts:
      - custom.domain.com
    secretName: custom-domain-tls-cert
...
```
It will take 2-3 mins for certmanager to issue a certificate and upon success, `custom-domain-tls-cert` secret will be populated with the cert values.

## 4. Verify

A Route would be created in you application namespace. Open your route URL i.e `https://custom.domain.com` to view and verify your TLS secured web application