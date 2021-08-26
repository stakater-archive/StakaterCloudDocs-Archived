# Predefined PrometheusRules

There are few pre-defined PrometheusRules that come with the platfrom. You can use existing existing rules to forward alerts to your prefferred medium of choice. 

Following are the rules along their descriptions

## Kubernetes Apps

| Name                              | Description |
|-----------------------------------|-------------|
| KubePodCrashLooping               | Pod `Namespace/Pod` is restarting N times / 5 minutes. |
| KubePodNotReady                   | Pod `Namespace/Pod` has been in a non-ready state for longer than 15 minutes |
| KubeDeploymentGenerationMismatch  | Deployment generation for `Namespace/Deployment` does not match, this indicates that the Deployment has failed but has not been rolled back. |
| KubeDeploymentReplicasMismatch    | Deployment `Namespace/Deployment` has not matched the expected number of replicas for longer than 15 minutes. |
| KubeStatefulSetReplicasMismatch   | StatefulSet `Namespace/StatefulSet` has not matched the expected number of replicas for longer than 15 minutes |
| KubeStatefulSetGenerationMismatch | StatefulSet generation for `Namespace/StatefulSet` does not match, this indicates that the StatefulSet has failed but has not been rolled back. |
| KubeStatefulSetUpdateNotRolledOut | StatefulSet `Namespace/StatefulSet` update has not been rolled out. |
| KubeDaemonSetRolloutStuck         | DaemonSet `Namespace/DaemonSet` has not finished or progressed for at least 15 minutes. |
| KubeContainerWaiting              | Pod `Namespace/Pod` container `Container` has been in waiting state for longer than 1 hour. |
| KubeDaemonSetNotScheduled         | Pods of DaemonSet `Namespace/DaemonSet` are not scheduled. |
| KubeJobCompletion                 | Job `Namespace/Job` is taking more than 12 hours to complete. |
| KubeJobFailed                     | Job `Namespace/Job` failed to complete. Removing failed job after investigation should clear this alert. |
| KubeHpaReplicasMismatch           | HPA (Horizontal Pod Autoscaler) `Namespace/HPA` has not matched the desired number of replicas for longer than 15 minutes. |
| KubeHpaMaxedOut                   | HPA (Horizontal Pod Autoscaler) `Namespace/HPA` has been running at max replicas for longer than 15 minutes. |

## Kubernetes Storage

| Name                              | Description |
|-----------------------------------|-------------|
| KubePersistentVolumeFillingUp     | The PersistentVolume claimed by `PersistentVolume` in Namespace `Namespace` is only `Percentage %` free. |
| KubePersistentVolumeErrors        | The persistent volume `PersistentVolume` has status `Failed/Pending`. |
