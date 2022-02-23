# Volume Expansion

Stakater App Agility Platform offers volume expansion to expand volumes when they are running out of space. Volume expansion periodically checks the `kubelet_volume_stats_used_bytes` and `kubelet_volume_stats_capacity_bytes` published by the kubelets to decide when to expand a volume. These metrics are generated only when a volume is mounted to a pod. Also the kubelet takes a minute or two to start generating accurate values for these metrics. 

Volume expansion works based on the following annotations to PersistentVolumeClaim resources:
| Annotation               | Default                    | Description                                                                                                   |
| -------------------- | --------------------------------|----------------------------------------------------------------------------- |
|`volume-expander-operator.redhat-cop.io/autoexpand`|N/A|if set to "true" enables the volume-expansion to watch on this PVC|
|`volume-expander-operator.redhat-cop.io/polling-frequency`|"30s"|How frequently to poll the volume metrics|
|`volume-expander-operator.redhat-cop.io/expand-threshold-percent`|"80"|the percentage of used storage after which the volume will be expanded. This must be a positive integer|
|`volume-expander-operator.redhat-cop.io/expand-by-percent`|"25"|the percentage by which the volume will be expanded, relative to the current size. This must be an integer between 0 and 100|
|`volume-expander-operator.redhat-cop.io/expand-up-to`|MaxInt64|the upper bound for this volume to be expanded to. The default value is the largest quantity representable and is intended to be interpreted as infinite. If the default is used it is recommend to ensure the namespace has a quota on the used storage class|

Example:

Consider the example where below annotations configured on persistent volume claim.
```
volume-expander-operator.redhat-cop.io/autoexpand: 'true'             # Enables the volume-expansion to watch on this PVC
volume-expander-operator.redhat-cop.io/expand-threshold-percent: "85" # Volume expansion will expand the volume when 85 percent of storage is consumed
volume-expander-operator.redhat-cop.io/expand-by-percent: "20"        # Volume expansion will expand PVC by 20 percent when 85 percent of storage is consumed
volume-expander-operator.redhat-cop.io/polling-frequency: "10m"       # Volume expansion poll the volume metrics after every 10 minutes
volume-expander-operator.redhat-cop.io/expand-up-to: "1Ti"            # Volume will be expanded no more than 1TB
```



