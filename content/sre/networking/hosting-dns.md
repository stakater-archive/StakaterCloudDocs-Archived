# How to host custom domains?

Consider have a domain `custom.domain.com`; and you want to host your application on your own domain instead of the default route provided by SAAP i.e. `<MYAPP_NAME>-<MYAPP_NAMESPACE>.apps.<CLUSTER_NAME>.<CLUSTER_ID>.kubeapp.cloud`. You can follow these steps in order to use your own domain:

1. Configure DNS
2. Configure TLS Certificates
3. Create Ingress for your Application
4. Verify

## 1. Configure DNS

In order to host your application on `custom.domain.com`. You need to point your DNS address on the public IP of the cluster's default router

### Option # 1: Create Manual entries

#### Step # 1: Obtain Public IP Address

Use the following command to get the Public IP address of your cluster:
```
nslookup "*.apps.$(oc get dns -ojsonpath='{.items[0].spec.baseDomain}')" | grep Address | tail -1
```

#### Step # 2: Create entry in your DNS Provider

Add `A` entry in your DNS provider to point `custom.domain.com` to the public IP obtained in the previous step.

### Option # 2: ExternalDNS

_TODO_


## 2. Configure TLS certificate secret

There are two ways to configure TLS Certificate secret:

1. Certmanager Operator
2. Bring Your Own Certificates (BYOC)

### Option # 1: Certmanager Operator

Certmanager Operator let's you automate the certification issuing process via Let's Encrypt CA. 

See [Cert-manager documentation](../certificates/cert-manager.md#Example-Certificate-Generation-using-Let's-Encrypt) for a working example

These Certificates are generated and can be rotated automatically via Certmanager Operator whenever an Ingress is created with annotation: `cert-manager.io/cluster-issuer: <ISSUER_NAME>`

::: tip
Consider using the cluster's default domain i.e. `*.kubeapp.cloud` for CI/staging envionment which are all secured by SAAP by default
:::

If you you are doing gitops with ArgoCD then you need to create an ArgoCD app like following that will watch cert-manager CRs and deploy them to the cluster:

```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  # It's mandatory you don't name it cert-manager; as it will prune other managed resources
  name: certificate-manager
  namespace: openshift-stakater-argocd
spec:
  destination:
    namespace: openshift-stakater-argocd
    server: "https://kubernetes.default.svc"
  source:
    path: <PATH>
    repoURL: <REPO-URL>
    targetRevision: HEAD
    directory:
       recurse: true
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

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
