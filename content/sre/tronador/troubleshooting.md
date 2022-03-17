# Troubleshooting

## Environment is not being provisioned after PR is created/updated

Environment provisioning takes a few minutes to complete, since there is a lot of steps involved that can take some time (image creation, argocd sync, Helm Operator reconcile, etc). Please take a look at the [workflow for Tronador](./workflow.html) to see how the process works. If the environment is still not provisioned after a few minutes, you can use the following steps to get an idea of why it is taking so long:

* Check your cluster's PipelineRun resource to check its status
* View your gitops repository to verify that the Environment Provisioner CR is pushed to it
* Confirm that the Environment Provisioner CR is pushed to your cluster by checking the status of the ArgoCD Application managing its sync.
* Check the status of the Helm Release to see if it is in a good state.
* In case Helm Release is failing, you will need to check Helm Operator's logs to get more information about the failure.
* * If you see constant helm release failures with the error message `Could not resolve host: github.com` or similar, you might need to change the `dnsConfig` within the template's spec for the Helm Operator's deployment with the following details:

    ```yaml
      dnsPolicy: "ClusterFirst"
      dnsConfig:
        options:
          - name: ndots
            value: "1"
    ```

    The Helm Operator uses an Alpine base image, which has a bad address issue where it cannot resolve addresses unless it has a dot `.` at the end of it. The above workaround will fix this issue.
* If everything above looks good, then the pods might be in a failing state. Check the pods deployed to your provisioned namespace and view their events to see if there are any failures, and why. Most likely the issue is a lack imagePullSecrets in the provisioned namespace. Those can be added by [Tenant Operator's](../tenant-operator/overview.html) [TemplateGroupInstance](../tenant-operator/customresources.html#_5-templategroupinstance) by setting the proper label in your tronador config file.