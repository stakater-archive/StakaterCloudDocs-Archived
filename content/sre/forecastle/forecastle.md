# Forecastle

### Problem Statement

We would like to have a central place where we can easily look for and access our applications running on Kubernetes.
We would like to have a tool which can dynamically discover and list the apps running on Kubernetes.
A launchpad to access developer tools e.g. Jenkins, Nexus, Kibana, Grafana, etc.

### Solution

Forecastle gives you access to a control panel where you can see your running applications and access them on Kubernetes.

![Forecastle](./images/forecastle.png)


### Configuration

Forecastle is already configured for Stakater Agility Platform users and it uses Openshift Authentication for SSO. Although, users can setup a
separate instance of forecastle as well by following [Deploying Forecaslte](https://github.com/stakater/forecastle#deploying-to-kubernetes)

### Usage

To add an application to forecastle you need to add a custom resource for `ForecastleApp`. 

- To add route from within the cluster:

```yaml
apiVersion: forecastle.stakater.com/v1alpha1
kind: ForecastleApp
metadata:
  name: cr-sample-application
  namespace: default
spec:
  name: Application
  group: "Development Environment"
  icon: https://raw.githubusercontent.com/stakater/ForecastleIcons/master/stakater-big.png
  urlFrom:
    routeRef:
      name: application-route
  networkRestricted: false
```

**NOTE**: `routeRef` should point to the name of the route and the resource `ForecastleApp` should be created in the same namespace
as the route.


- To add an external URL:

```yaml
apiVersion: forecastle.stakater.com/v1alpha1
kind: ForecastleApp
metadata:
  name: cr-uptimerobot
  namespace: default
spec:
  name: UptimeRobot
  group: Alerting
  icon: https://uptimerobot.com/assets/img/logo_plain.png
  url: https://uptimerobot.com/
  networkRestricted: false
```
