# Customer workload Alerting

Stakater Agility Platform provides seperate alerting for customer workloads that offer individual configuration for each new application a customer defines.

Having alerts for your new application can consist of 3 major blocks:
- Application with a `ServiceMonitor/PodMonitor`
- Enabling your namespace to be watched by Alertmanager
- `AlertmanagerConfig` for adding the alertmanager config specific to the app
- `PrometheusRule` for firing an alert

## Enabling your Namespace/Project to be watched by Alertmanager

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


## Writing an AlertmanagerConfig for your Applicaiton

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

## Defining a PrometheusRule for your app

You need to create a PrometheusRule with the label `prometheus: stakater-workload-monitoring` to be picked by the workload monitoring promethues.

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
        - alert: ExampleAppDown
          annotations:
            message: >-
              The Example App is Down (Test Alert)
          expr: up{namespace="test-app"} == 0
          for: 1m
          labels:
            severity: critical  
~~~