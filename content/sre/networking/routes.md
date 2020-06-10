# Routes

To expose applications in an openshift cluster over the internet `routes` are used. Routes expose a service at a 
hostname, for example app.example.com,  so that external clients can reach the service.

As part of Stakater Cloud offering, we provide our end users with a domain 
*.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com that is pre-configured with SSL to provide a secure connection.

## Sample route for a service

### 1. Create a new project

`oc new-project route-demo`

### 2. Use the oc new-app command to create a service

```shell script
oc new-app https://github.com/openshift/ruby-hello-world
```

### 3. Create a route

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: ruby-hello-world
  namespace: route-demo
# Add this label to use default router that serves *.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com
  labels:
    router: default
  annotations:
    openshift.io/host.generated: 'true'
spec:
# In case you omit `host` field openshift will generate a hostname for you as <name>-<namespace-name>.DOMAIN_NAME
  host: hello-world-app.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com
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

## Additional route configuration

Additional annotations can be used to configure routes. For example, 

- Allow access to only certain whitelisted IPs

Annotate your route with `haproxy.router.openshift.io/ip_whitelist: IP_ADDRESS_1 IP_ADDRESS_2`

- Set a timeout for the route

Annotate your route with `haproxy.router.openshift.io/timeout: 5000ms`

### Example: 

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: ruby-hello-world
  namespace: route-demo
# Add this label to use default router that serves *.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com
  labels:
    router: default
  annotations:
# Will whitelist this route for the 8.8.8.8 and 8.8.8.9
    haproxy.router.openshift.io/ip_whitelist: 8.8.8.8 8.8.8.9
# Sets a server-side timeout for the route for 5000ms   
    haproxy.router.openshift.io/timeout: 5000ms
spec:
# In case you omit `host` field openshift will generate a hostname for you as <name>-<namespace-name>.DOMAIN_NAME
  host: hello-world-app.apps.<CLUSTER_NAME>.openshift.<ClOUD_PROVIDER>.stakater.com
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

For further details: [Route Configuration](https://docs.openshift.com/container-platform/4.4/networking/routes/route-configuration.html)