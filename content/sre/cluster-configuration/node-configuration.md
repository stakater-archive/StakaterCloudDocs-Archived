# Node Configuration

## Node Reservations

### Why do I need to reserve memory/cpu on each node?

An Openshift/Kubernetes Node consist system services that ensure the smooth running of cluster e.g. Kubelet, KubeAPIServer and other OS processes/services. These services can be starved by the workloads running on these nodes and can be starved of CPU time or can cause unexpected Out of Memory (OOM) Exceptions. In order to prevent these issues, a small chunk of resources needs to be permanently allocated to these services so they can run smoothly.

### System Reservations

These resources are reserved for every node

| Resource   |  Reserved  |
| -- | -- |
| CPU | 1 vCPU |
| Memory | 2Gi |


### Eviction Threshold

If the utilization of the resource reaches the threshold value, workload pods will be evicted from that node

| Resource   |  Threshold  | Explanation |
| -- | -- | -- |
| CPU | None |  Workloads will keep running, not evicted |
| Memory | 1Gi | Workloads will start to get evicted, if only 1Gi of memory left on the node |