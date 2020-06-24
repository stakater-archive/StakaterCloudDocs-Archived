# Ingress Monitor Controller

A tool that watches for ingress/routes in your cluster and creates liveness alerts using third party uptime checkers.
It's part of the SRE offerings from Stakater Cloud, is deployed by default and can be configured by the end user based
on their needs.

## Problem Statement
We want to monitor ingresses in a kubernetes cluster and routes in openshift cluster via any uptime checker but the 
problem is having to manually check for new ingresses or routes / removed ingresses or routes and add them to the 
checker or remove them.

## Solution
This controller will continuously watch ingresses/routes in specific or all namespaces, and automatically 
add/remove monitors in any of the uptime checkers. With the help of this solution, you can keep a check on your services 
and see whether they're up and running and live, without worrying about manually registering them on the Uptime checker.

## Sample Configuration

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