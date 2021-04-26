# Logging

Stakater App Agility Platform uses EFK Stack (Elasticseatch Fluentd Kibana) to provide logging for applications. Flunetd daemonsets pick up the logs and send these to elasticsearch. Kibana dashboards can be used to view/analyze logs

![Logging](./images/logging.png)


## Application Logs parsing

Logs are parsed by default if applications output logs in `JSON format` on stdout. Moreover one step nested JSON parsing is also supported additionally.

Conside the following example of a one line event by a java application:
```json
{"timestamp":"2021-04-15 11:41:01.427","level":"WARN","thread":"http-nio-8080-exec-4","mdc":{"breadcrumbId":"441ce707-8096-4aba-a927-0afa8c34802b-by-BOKE","user":"service-account-boke"},"logger":"org.zalando.logbook.Logbook","message":"{\"origin\":\"local\",\"type\":\"response\",\"correlation\":\"ef4f3737f2bcf856\"}"}
```

This will be parsed as follows:
```json
{
    "timestamp":"2021-04-15 11:41:01.427",
    "level":"WARN",
    "thread":"http-nio-8080-exec-4",
    "mdc.breadcrumbId":"441ce707-8096-4aba-a927-0afa8c34802b-by-BOKE",
    "mdc.user":"service-account-boke",
    "logger":"org.zalando.logbook.Logbook",
    "message":"{\"origin\":\"local\",\"type\":\"response\",\"correlation\":\"ef4f3737f2bcf856\"}",
    "origin": "local",
    "type": "response",
    "correlation": "ef4f3737f2bcf856"
}
```

## Log Retention

By default Application logs are retained for 7 days.

## Application alerting

Alerts can be sent to slack channels by matching a string against a particular field. e.g. Send an alert to slack if `level`==`ERROR`. These alerts increase operational efficiency. See [Application log alerting](../alerting/log-alerts.md#Application-Logs-Alerting) on how to configure alerts