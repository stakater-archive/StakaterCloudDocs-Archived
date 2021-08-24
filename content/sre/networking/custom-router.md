# Hosting your own Domain

## About Route Sharding

As part of Stakater Cloud offering, we provide end users with a domain `*.apps.<CLUSTER_NAME>.<CLUSRER_ID>.kubeapp.cloud` that is pre-configured with SSL to provide a secure connection. As a common use case, end-users might want to use custom domains/ own domains for their applications. `Route Sharding` is used to facilitate this requirement.

In route sharding we create subset/shards of routes based on `namespaceSelector` or `routeSelector` label selectors. Router uses selectors to select subset of routes that it's going to serve. The `default router` has been configured to use `routeSelector` and it looks for any route with the label `router: default` (All routes served under `*.kubeapp.cloud` subdomains).

Users can create their own Router to host applications by providing a separate `routeSelector` e.g. `router: myapp`. This new router will select all the Routes that has a label `router: myapp`.

## Adding your own Domain

Consider hosting domain for `custom.domain.com`; you need to take care of following steps

1. Create TLS certificates
2. Create new router
3. Create DNS entry
4. Validate

### 1. Create TLS certificate secret

There are two ways to Generate TLS Certificate secret:

1. Certmanager Operator
2. Bring Your Own Certificates (BYOC)

#### Option # 1: Certmanager Operator

Certmanager Operator let's you automate the certification issuing process via Let's Encrypt CA. These Certificates are generated and can rotated automatically via Certmanager Operator

1. [Create a ClusterIssuer](https://cert-manager.io/docs/configuration/acme/)
2. [Create Certificate CR to gerneate TLS secret in openshift-ingress namespace](https://cert-manager.io/docs/usage/certificate/)

#### Option # 2: Bring Your Own Certificates (BYOC)

Generate TLS certificates of your domain i.e. `custom.domain.com` from your preferred CA and create a secret of the following format (secret can be secured via [SealedSecrets](../secrets/sealed-secrets.md#Secrets-Management-using-Sealed-Secrets-Controller).

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
  namespace: openshift-ingress
type: kubernetes.io/tls
```

### 2. Add a new router

```yaml
apiVersion: operator.openshift.io/v1
kind: IngressController
metadata:
  name: router-custom-domain
  namespace: openshift-ingress-operator
spec:
  # Replace with your domain name
  domain: custom.domain.com
  defaultCertificate:
    # Refer secret created in the previous step here
    name: custom-domain-tls-cert
  endpointPublishingStrategy:
    loadBalancer:
      scope: External
    type: LoadBalancerService
  replicas: 3
  nodePlacement:
    nodeSelector:
      matchLabels:
        node-role.kubernetes.io/infra: ""
  routeSelector:
    matchLabels:
      router: custom-domain
```

### 3. Add DNS entry

There are two options here as well

1. Manually add DNS entry
2. ExternalDNS

#### Option # 1: Manually add DNS entry

Add DNS entry for your domain that points to the newly created router's provisioned loadbalancer IP in your DNS provider.

> **_TIP:_** Add a wildcard entry for *.custom.domain.com against loadbalancer IP. In that way users won't have to add a separate DNS entry for each route/application and a single DNS entry would be required per router.

To retrieve the loadbalancer IP: 
```shell script
oc get svc -n openshift-ingress router-custom-domain --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

#### Option # 2: ExternalDNS

_TODO_

### 4. Validate

Update the label on your OpenShift Route to `router:custom-domain`

_NOTE: you might have to delete existing route which is exposed on default router_
