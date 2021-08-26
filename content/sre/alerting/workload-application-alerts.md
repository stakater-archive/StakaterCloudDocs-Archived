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
| .Values.serviceMonitor.endpoints | Array of endpoints to be scraped by prometheus

```
serviceMonitor:
  enabled: true
  endpoints:
  - interval: 5s
    path: /actuator/prometheus
    port: http
```

## 2. Create AlertmanagerConfig for the applicaiton

You need to define AlertmanagerConfig to direct alerts to your target alerting medium like slack, pagetduty, etc. 

A sample AlertmanagerConfig can be configured in [Application Chart](https://github.com/stakater-charts/application).

| Parameter | Description |
|:---|:---|
| .Vaues.alertmanagerConfig.enabled | Enable alertmanagerConfig for this app (Will be merged in the base config) 
| .Values.alertmanagerConfig.spec.route | The Alertmanager route definition for alerts matching the resource’s namespace. It will be added to the generated Alertmanager configuration as a first-level route 
| .Values.alertmanagerConfig.spec.receivers | List of receivers  

We will use slack as an example here. 

Step 1: Create a `slack-webhook-config` secret which holds slack webhook-url

```
kind: Secret
apiVersion: v1
metadata:
  name: slack-webhook-config
  namespace: <your-namespace>
data:
  webhook-url: <slack-webhook-url-in-base64>
type: Opaque
```

Step 2: Add a alertmanagerConfig spec to use `slack-webhook-config` secret created above in step 1, you need to replace `<workload-alertmanager-url>` with the link of Workload Alertmanager that you can get from forecastle.

```
alertmanagerConfig:
  enabled: true
  spec:
    route:
      receiver: 'slack-webhook'
    receivers:
    - name: 'slack-webhook'
      slackConfigs:
      - apiURL: 
          name: slack-webhook-config
          key: webhook-url
        channel: '#channel-name'
        sendResolved: true
        text: |2-
          {{ range .Alerts }}
          *Alert:* `{{ .Labels.severity | toUpper }}` - {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Details:*
            {{ range .Labels.SortedPairs }} *{{ .Name }}:* `{{ .Value }}`
            {{ end }}
          {{ end }}
        title: '[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] SAAP Alertmanager Event Notification'
        titleLink: |2
          <workload-alertmanager-url>/#/alerts?receiver={{ .Receiver | urlquery }}
        httpConfig:
          tlsConfig:
            insecureSkipVerify: true
```

**Note:**
AlertmanagerConfig will add a match with your namespace name by default, which will look like this:

```
...
      match:
        namespace: <your-namespace>
...
```

With this configuration, every new alert should land in the configured slack channel.
## 3. Create PrometheusRule for the application

You need to create a PrometheusRule to define rules for alerting or you can use [Predefined PrometheusRules](./predefined-prometheusrules.md) 

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

