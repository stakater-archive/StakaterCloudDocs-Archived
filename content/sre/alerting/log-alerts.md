# Log alerting

Stakater App Agility Platform provides alerting for applications logs via [Konfigurator](https://github.com/stakater/Konfigurator) which out of the box integrates with fluentd. These alerts land on Slack channel(s) so that any Errors/Warnings can be responded immediately.

To configure log alerting do following:

1. Configure the incoming webhook in slack
2. Configure `FluentdConfigAnnotation` in application helm chart

## 1. Configure the incoming webhook in slack

::: tip
Always use Slack bot account to manage incoming webhooks. An integration/app might fail if the user who added it leaves.
:::

- While in your Slack workspace, left-click the name of your workspace, and pick `Administration` > `Manage Apps` from the dropdown Menu.
- A new browser window should appear in which you can customize your workspace. From here, navigate to browse and then search `Incoming WebHooks` in slack apps.
- Now you can configure a new `Incoming WebHook` by clicking the big, green `Add to Slack` button.
- The first form lets you pick any existing channel or user on your workspace to notify when the WebHook is called. A new channel can also be created here.
- After picking a channel or user to be notified, click the `Add Incoming WebHooks Integration` Button. The most important part on the next screen is the `WebHook URL`. Make sure you copy this URL and save it
- Near the bottom of this page, you may further customize the Incoming WebHook you just created. Give it a name, description and perhaps a custom icon.

## 2. Configure `FluentdConfigAnnotation` in application helm chart

The configuration to parse/match/send logs can be specified in the [Application Chart](https://github.com/stakater-charts/application).

| Parameter | Description |
|:---|:---|
|.Values.deployment.fluentdConfigAnnotations.notifications.slack|specify slack *webhookURL* and *channelName*|
|.Values.deployment.fluentdConfigAnnotations.key|specify log field to match the regex|
|.Values.deployment.fluentdConfigAnnotations.pattern|specify regex to be matched|

We recommend to log as JSON but for some reason if you can't then follow the next step as well.

::: tip
If you use a customized format for logs in your application, you can describe your own regex to parse logs. See example in our [log parsing](https://docs.cloud.stakater.com/content/sre/logging/logging.html) section.
:::

### Examples

Following Configuration will send the log to Slack channel `my-application-log-alerts` if the regex described in `pattern` matches in the field described in `key`.

```yaml
deployment:
  fluentdConfigAnnotations:
    notifications:
      slack: 
        webhookURL: https://hooks.slack.com/services/XXXXXXX/YYYYYYYYY/aaaaaaabbbbbcccccddd
        channelName: my-application-log-alerts
      key: "level"
      pattern: "(ERROR|ERR|error|E[A-Z0-9]{4})"
```

**Log entry sent to slack channel**

```
{"timestamp":"2021-03-09 15:03:44.405",**"level":"ERROR"**,"thread":"failedEventListener-0-C-1","logger":"org.apache.kafka.clients.consumer.internals.ConsumerCoordinator","message":"[Consumer instanceId=qwertyapp-54f646c54c-9bblt-0, clientId=consumer-app-54f646c54c-9bblt-0, groupId=qwertyapp-consumer] Setting offset for partition qwertyapp.failed-events-0 to the committed offset FetchPosition{offset=0, offsetEpoch=Optional.empty, currentLeader=LeaderAndEpoch{leader=Optional[qwertyapp-kafka-0.qwertyapp-kafka-brokers.team-dev.svc:9092 (id: 0 rack: null)], epoch=0}}","context":"default"}
```
