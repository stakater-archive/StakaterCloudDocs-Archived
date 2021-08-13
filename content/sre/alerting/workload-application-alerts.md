# Internal Alerting - Customer workload alerting (>=4.7)

Stakater App Agility Platform also provides fully managed dedicated workload monitoring stack based on Prometheus, AlertManager and Grafana.

To configure alerting for your application do following:

1. Create `ServiceMonitor/PodMonitor` for the application
3. Create `AlertmanagerConfig` for the application
4. Create `PrometheusRule` for firing an alert for the application
2. Validate workload monitoring is enabled on your namespace

**Note:** OpenShift Cluster needs to be on version greater than or equal to 4.7

## 1. Create ServiceMonitor/PodMonitor for the application

You need to define ServiceMonitor/PodMonitor so, the application metrics can be scrapped.

Service Monitor uses the service that is used by your application. Then Service Monitor scrapes metrics via that service. ServiceMonitor can be like this:

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

Pod Monitor directly scrapes metrics from a pod. In this case, Pod needs to have that port open.

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

Stakater application helm chart supports configuring `ServiceMonitor`. Check it out [here](https://github.com/stakater-charts/application)

## 2. Create AlertmanagerConfig for the applicaiton

You need to define AlertmanagerConfig to direct alerts to your target alerting medium like slack, pagetduty, etc. 

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

Now the label `alertmanagerConfig: "workload"` enables it to be picked up by the Alertmanager of workload monitoring offered by Stakater App Agility Platform and you can direct this alert anywhere you like pagerduty or slack. Also you cannot change this label. You need to use this specific label to get this configuration picked up by the Stakater managed alertmanager.

Stakater application helm chart supports configuring AlertmanagerConfig. Check it out [here](https://github.com/stakater-charts/application)

## 3. Create PrometheusRule for the application

You need to create a PrometheusRule with the label `prometheus: stakater-workload-monitoring` to be picked by the workload monitoring promethues.

A simple example would be:

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

Stakater application helm chart supports configuring PrometheusRule. Check it out [here](https://github.com/stakater-charts/application)

## 4. Enabling workload monitoring for your namespace/project

To enable that you just need to add `stakater.com/workload-monitoring: 'true'` label to your namespace manifest.

Like:

~~~
apiVersion: v1
kind: Namespace
metadata:
  labels:
    stakater.com/workload-monitoring: 'true'
  name: {NAME}
~~~

All namespaces created via tenant-operator in Stakater App Agility Platform have this label by default. You can still validate by describing the project/namespace
