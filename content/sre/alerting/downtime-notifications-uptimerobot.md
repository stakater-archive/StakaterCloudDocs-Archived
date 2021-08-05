
# External Alerting - Downtime Notifications via UptimeRobot

Stakater App Agility Platform provides downtime notifications for Applications via [IngressMonitorController](https://github.com/stakater/IngressMonitorController) which out of the box integrates with [UptimeRobot](https://uptimerobot.com). These alerts land on Slack channel(s) so that any downtime event can be responded immediately.

## Configuring the Incoming Webhook in Slack 

- While in your Slack workspace, left-click the name of your workspace, and pick `Administration` > `Manage Apps` from the dropdown Menu.
- A new browser window should appear in which you can customize your workspace. From here, navigate to `Custom Integrations` and then to `Incoming WebHooks`.
- Now you can configure a new `Incoming WebHook` by clicking the big, green `Add Configuration button`.
- The first form lets you pick any existing channel or user on your workspace to notify when the WebHook is called. A new channel can also be created here.
- After picking a channel or user to be notified, click the `Add Incoming WebHooks Integration` Button. The most important part on the next screen is the `WebHook URL`. Make sure you copy this URL and send it to Stakater Support
- Near the bottom of this page, you may further customize the Incoming WebHook you just created. Give it a name, description and perhaps a custom icon.

## Items to be provided to Stakater Support
- `Incoming WebHook URL`
