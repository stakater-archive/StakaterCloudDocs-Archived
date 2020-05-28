# Route Sharding

As part of Stakater Cloud offering, we provide end users with a domain 
*.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com that is pre-configured with SSL to provide a secure connection.
As a common use case, end-users might want to use custom domains for their applications. `Route Sharding` is used to facilitate
this.

In route sharding we create subset/shards of routes based on `namespaceSelector` or `routeSelector` label selectors.
Router uses selectors to select subset of routes that it's going to serve. We have configured the default router to use
`routeSelector` and it looks for any route with the label `router: default`.

## Add new custom domain

### 1. Generate certificates and create a secret like:

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

Replace concealed values with the corresponding base64 encoded certificate values.

### 2. Add a new router

```yaml
apiVersion: operator.openshift.io/v1
kind: IngressController
metadata:
  name: internal
  namespace: openshift-ingress-operator
spec:
# Replace with your domain name
  domain: custom-domain.com
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
      router: custom-domain-router
```

### 3. Create route

#### 3.1. Create a new project

`oc new-project route-demo`

#### 3.2. Use the oc new-app command to create a service

```shell script
oc new-app https://github.com/openshift/ruby-hello-world
```

#### 3.3. Create a route

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: ruby-hello-world
  namespace: route-demo
# Add this label to use your custom router
  labels:
    router: custom-domain-router
  annotations:
    openshift.io/host.generated: 'true'
spec:
# In case you omit `host` field openshift will generate a hostname for you as <name>-<namespace-name>.custom-domain.com
  host: hello-world-app.custom-domain.com
  to:
    kind: Service
    name: ruby-hello-world
    weight: 100
  port:
    targetPort: 8080-tcp
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
  wildcardPolicy: None
```

### 4. Add DNS entry

Add DNS entry for [hello-world-app.custom-domain.com](hello-world-app.custom-domain.com) that points to the router's provisioned
loadbalancer IP in your DNS provider. 

To retrieve the loadbalancer IP: 
```shell script
oc get svc -n openshift-ingress router-internal --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Another option is to add a wildcard entry for *.custom-domain.com to loadbalancer IP. In that way you won't have to add a separate entry
DNS entry for each route, in turn only a single DNS entry would be required per router.

NOTE: In case you have restricted access(not cluster administrator), launch a support ticket to get the loadbalancer IP. 