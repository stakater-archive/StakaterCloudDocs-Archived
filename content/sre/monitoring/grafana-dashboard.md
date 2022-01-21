# Create Grafana Dashboard Guide

This document explains how to create Grafana Dashboard via GrafanaDashboard CR powered by grafana operator. In this way there is no need to configure via web UI. And developers are able to ship new dashboards in any namespace and deploy them via gitops. 

## Instructions 

The grafana deployment has been replaced with a way using grafana operator. And it has been enabled for grafana operator to scan all namespaces for GrafanaDashboard definitions. The serviceaccount running grafana has been granted the appropriate permissions to do that. All you need to do is to define the GrafanaDashboard in your desired namespace. 

1) Create GrafanaDashboard definition 

   Here is an example. You can visit [here](https://github.com/stakater-ab/stakater-gitops-config/blob/main/01-dev/sro/clusters/stakater/binero/syncsets/workload-monitoring/grafana-dashboards-other-ns.yaml) for a complete one.

   The namespace can be anyone you desire, but must be present. The label “app: grafana” is required for grafana operator to discover the dashboard. The json string with the dashboard contents is placed in the “json” section.Check the [official documentation](https://grafana.com/docs/reference/dashboard/#dashboard-json).If the json string is invalid, the dashboard will not appear in grafana.

```yaml
kind: SyncSet
apiVersion: hive.openshift.io/v1
metadata:
  name: workload-monitoring-grafana-dashboards-other-ns
  namespace: cluster-stakater-binero-test
spec:
  clusterDeploymentRefs:
  - name: openshift-binero-test
  resourceApplyMode: Sync
  resources:
  
  # HA Proxy Dashboard in test-ns
  - apiVersion: integreatly.org/v1alpha1
    kind: GrafanaDashboard
    metadata:
      name: grafana-haproxy-from-config-map
      namespace: test-ns
      labels:
        app: grafana
    spec:
      json: |-
        {
          "annotations": {
            "list": [
              {
                "builtIn": 1,
...
```

2) Commit it to github and deploy it to your cluster via gitops

   After deployed successfully, the dashboard will appear in the grafana Web UI, under a folder named after the namespace you specified.

For much more complex usage with GrafanaDashboard, visit [here](https://github.com/grafana-operator/grafana-operator/blob/master/documentation/dashboards.md). Please note that if you deploy GrafanDashboard in a namespace other than the namespace which grafana operator is located in,  “openshift-stakater-workload-monitoring” in our case, only “json” is supported to provide the dashboard contents as the sample above. 