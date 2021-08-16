# Internal alerting

Stakater App Agility Platform also provides fully managed dedicated workload monitoring stack based on Prometheus, AlertManager and Grafana.

To configure alerting for your application do following:

1. Create `ServiceMonitor` for the application
3. Create `AlertmanagerConfig` for the application
4. Create `PrometheusRule` for firing an alert for the application


**Note:** OpenShift Cluster needs to be on version greater than or equal to 4.7

## 1. Create ServiceMonitor for the application

Service Monitor uses the service that is used by your application. Then Service Monitor scrapes metrics via that service.

You need to define ServiceMonitor so, the application metrics can be scrapped.

ServiceMonitor can be enabled in [Application Chart](https://github.com/stakater-charts/application).

| Parameter | Description |
|:---|:---|
| .Values.serviceMonitor.enabled | Enable serviceMonitor

```
serviceMonitor:
  enabled: true
```

## 2. Create AlertmanagerConfig for the applicaiton

You need to define AlertmanagerConfig to direct alerts to your target alerting medium like slack, pagetduty, etc. 

A sample AlertmanagerConfig can be configured in [Application Chart](https://github.com/stakater-charts/application).

| Parameter | Description |
|:---|:---|
| .Vaues.alertmanagerConfig.enabled | Enable alertmanagerConfig for this app (Will be merged in the base config) 
| .Values.alertmanagerConfig.spec.route | The Alertmanager route definition for alerts matching the resource’s namespace. It will be added to the generated Alertmanager configuration as a first-level route 
| .Values.alertmanagerConfig.spec.receivers | List of receivers  


```
alertmanagerConfig:
  enabled: true
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
```

## 3. Create PrometheusRule for the application

You need to create a PrometheusRule to define rules for alerting

A sample PrometheusRule can be configured in [Application Chart](https://github.com/stakater-charts/application).

| Parameter | Description |
|:---|:---|
| prometheusRule.enabled | Enable prometheusRule for this app 
| prometheusRule.spec.groups | PrometheusRules in their groups to be added 
~~~
prometheusRule:
  enabled: true
  groups: []    
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

