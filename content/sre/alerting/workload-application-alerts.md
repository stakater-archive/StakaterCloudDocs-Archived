# Customer workload Alerting

App Agility Platform provides seperate alerting for customer workloads that offer individual configuration for each new application a customer defines.

Having alerts for your new application go through following points:
- Application with a `ServiceMonitor/PodMonitor`
- Enabling workload monitoring for your namespace.
- `AlertmanagerConfig` for adding the alertmanager config specific to the app
- `PrometheusRule` for firing an alert

## 1. ServiceMonitor/PodMonitor Example
Service Monitor uses the service that is used by your app. Then Service Monitor scrapes metrics via that service.
ServiceMonitor can be like this:
~~~
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {NAME}
  namespace: {NAMESPACE}
spec:
  endpoints:
    - bearerTokenSecret:
        {SECRET TO SCRAPE DATA FROM THE POD}
      port: metrics
  selector:
    matchLabels:
      {LABELS TO SELECT YOUR APP SERVICE}
~~~
Pod Monitori directly scrapes metrics from a pod. In this case, Pod needs to have that port open.
PodMonitor can be like this:
~~~
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: {NAME}
  namespace: {NAMESPACE}
spec:
  selector:
    matchLabels:
      {LABELS TO SELECT YOUR APP POD}
  podMetricsEndpoints:
  - targetPort: 8080 # metrics port
    path: /metrics # metrics path
~~~

## 2. Enabling workload monitoring for your Namespace/Project

To enable that you just need to add `stakater.com/workload-monitoring: 'true'` label to your namespace manifest.

Something like this:
~~~
apiVersion: v1
kind: Namespace
metadata:
  labels:
    stakater.com/workload-monitoring: 'true'
  name: {NAME}
~~~


## 3. Writing an AlertmanagerConfig for your Applicaiton

You can define AlertmanagerConfig to direct alerts to your target applications like slack, pagetduty etc. Our application chart also support configuring AlertmanagerConfig. Check it out [here](https://github.com/stakater-charts/application)

A sample AlertmanagerConfig can look like:
~~~
apiVersion: monitoring.coreos.com/v1alpha1
kind: AlertmanagerConfig
metadata:
  name: {NAME}
  namespace: {NAMESPACE}
  labels:
    alertmanagerConfig: "workload"
spec:
  route:
    receiver: "null"
    groupBy:
    - job
    routes:
    - receiver: "null"
      groupBy:
      - alertname
      - severity
      continue: true
    groupWait: 30s
    groupInterval: 5m
    repeatInterval: 12h
  receivers:
  - name: "null"
~~~

Now the label `alertmanagerConfig: "workload"` enables it to be picked up by the Alertmanager of workload monitoring offered by Stakater Agility Platform and you can direct this alert anywhere you like pagerduty or slack. Also you cannot change this label. You need to use this specific label to get this configuration picked up by the alertmanager.

## 4. Defining a PrometheusRule for your app

You need to create a PrometheusRule with the label `prometheus: stakater-workload-monitoring` to be picked by the workload monitoring promethues. Our application chart also support configuring PrometheusRule. Check it out [here](https://github.com/stakater-charts/application)

A simple example would be
~~~
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  labels:
    prometheus: stakater-workload-monitoring
    role: alert-rules
  name: {NAME}
  namespace: {NAME}
spec:
  groups:
    - name: example-app-uptime
      rules:
        # This is a sample alert below
        - alert: ExampleAppDown
          annotations:
            message: >-
              The Example App is Down (Test Alert)
          expr: up{namespace="test-app"} == 0
          for: 1m
          labels:
            severity: critical  
~~~