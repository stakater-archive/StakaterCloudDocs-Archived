The purpose of the volume-expander is to expand persistent volumes when they are running out of space. This resolves the problem of persistent volumes troubleshooting on passing the set threshold. Volume expander periodically checks the `kubelet_volume_stats_used_bytes` and `kubelet_volume_stats_capacity_bytes` published by the kubelets to decide when to expand a volume. These metrics are generated only when a volume is mounted to a pod. Also the kubelet takes a minute or two to start generating accurate values for these metrics. 

Volume expander works based on the following annotations to PersistentVolumeClaim resources:
| Annotation               | Default                    | Description                                                                                                   |
| -------------------- | --------------------------------|----------------------------------------------------------------------------- |
|`volume-expander-operator.redhat-cop.io/autoexpand`|N/A|if set to "true" enables the volume-expander to watch on this PVC|
|`volume-expander-operator.redhat-cop.io/polling-frequency`|"30s"|How frequently to poll the volume metrics|
|`volume-expander-operator.redhat-cop.io/expand-threshold-percent`|"80"|the percentage of used storage after which the volume will be expanded. This must be a positive integer|
|`volume-expander-operator.redhat-cop.io/expand-by-percent`|"25"|the percentage by which the volume will be expanded, relative to the current size. This must be an integer between 0 and 100|
|`volume-expander-operator.redhat-cop.io/expand-up-to`|MaxInt64|the upper bound for this volume to be expanded to. The default value is the largest quantity representable and is intended to be interpreted as infinite. If the default is used it is recommend to ensure the namespace has a quota on the used storage class|

Example:

Consider the example where the below annotations configured on persistent volume claim.
    `volume-expander-operator.redhat-cop.io/autoexpand: 'true'`
    `volume-expander-operator.redhat-cop.io/expand-threshold-percent: "85"`
    `volume-expander-operator.redhat-cop.io/expand-by-percent: "20"`
    `volume-expander-operator.redhat-cop.io/polling-frequency: "10m"`
    `volume-expander-operator.redhat-cop.io/expand-up-to: "1Ti"`

When the pvc that is configured with the above annotations is mounted on a pod then volume expander watch the PVC because of the annotation `volume-expander-operator.redhat-cop.io/autoexpand` and will expand PVC by 20 percent relevant to the current size on reaching the threshold of 85 percent. Volume expander poll the volume metrics after every 10 minutes and then on the bases of `kubelet_volume_stats_used_bytes` and `kubelet_volume_stats_capacity_bytes` takes volume expansion decision. When mounted PVC expanded to 1TB then volume expander will not expand PVC further with the error `"no space left on device"` due to the annotation configured on PVC `"volume-expander-operator.redhat-cop.io/expand-up-to: "1Ti"` which means that upper bound for this volume is 1TB.


