# Application Uptime

We use Uptime Robot to monitor uptimes for application. Whenever an application goes down, it alerts us that application endpoint is down. You can use email or Slack or other integrations for it.

## Automating Using Ingress Monitor Controller

IMC is a tool that watches for ingress/routes in your cluster and creates liveness alerts using third party uptime checkers.

It's part of the SRE offerings from Stakater Cloud, is deployed by default and can be configured by the end user based on their needs.

### Problem Statement

We will be having multiple routes/ingresses and we want to automate it so that whenever a new route/ingress is added, we add it in Uptime. So IMC automates it.

NOTE: Currently IMC is not working for Openshift, so we have added a manual entry in Uptime, but we are working to add support for Openshift.

### Sample Configuration

For configuring IMC end user has to create a secret `imc-config` in `stakater-system` namespace that adds the required
configuration for IMC. A sample configuration for using IMC with [UptimeRobot](https://uptimerobot.com/) would look
like:

```yaml
apiVersion: v1
stringData:
  config.yaml:
    providers:
      - name: UptimeRobot
        apiKey: IMC_API_KEY
        apiURL: https://api.uptimerobot.com/v2/
        alertContacts: "IMC_ALERT_CONTACTS"
    enableMonitorDeletion: true
    monitorNameTemplate: "{{.IngressName}}-{{.Namespace}}"
    resyncPeriod: 0
kind: Secret
metadata:
  name: imc-config
  namespace: stakater-system
type: Opaque
```

Where the following variables need to be replaced with their corresponding values:

- IMC_API_KEY: API key of the monitor service provider
- IMC_ALERT_CONTACTS: Alert contacts for the monitor service provider

### For further details

Refer to: [Configuring IMC](https://github.com/stakater/IngressMonitorController#usage)