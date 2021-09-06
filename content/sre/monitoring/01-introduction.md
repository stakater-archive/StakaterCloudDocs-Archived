# Application Monitoring Stack

Stakater App Agility Platform (SAAP) monitoring stack is based on following components

## Prometheus
Metrics collection and storage via Prometheus, an open-source monitoring system time series database.

## Alert Manager
Alerting/notificationvia Prometheus’ Alertmanager, an open-source tool that handles alerts send by Prometheus.

## Grafana
Metrics visualization via Grafana, the leading metrics visualization technology.

## Stakater Ingress Monitor Controller (IMC)
IMC watches ingress/routes and creates liveness alerts in third party uptime checkers; for downtime notifications. By default SAAP uses UptimeRobot free tier.
