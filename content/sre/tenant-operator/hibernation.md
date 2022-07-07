# Hibernation

Hibernation of resources is a feature of Tenant Operator that simply downsizes running Deployments and StatefulSets based on a schedule. The hibernation feature can enabled on a tenant level, and certain namespaces belonging to a tenant can be whitelisted so they are not put to sleep. To enable hibernation on a tenant, add the following fields to the spec of the [relevant Tenant CR](./customresources.html#_2-tenant):

```yaml
hibernation:
  sleepSchedule: 23 * * * *
  wakeSchedule: 26 * * * *
```

The `sleepSchedule` field will set the time period on which the namespaces will go to sleep, while the `wakeSchedule` field will do the opposite. Both fields are required if you want to use the hibernation feature, and they must have a valid cron format for their values.

Adding the above fields will create a [ResourceSupervisor custom resource](customresources.html#_6-resourcesupervisor) for the tenant. The custom resource will store the above schedules, and manage the current and previous states of the applications, whether they are sleeping or awake. When the sleep timer is hit, the controller for the resource will reconcile and find all Deployments and StatefulSets in the namespaces owned by the tenant, store their details and the number of replicas, and scale them down to zero. When the wake timer is hit, the controller will wake up the resources by using their stored details.


## Namespace exclusion

You can exclude a namespace from being put to sleep by simply adding the following annotation to the namespace: `hibernation.stakater.com/exclude: 'true'`. Note that this wont wake up an already sleeping namespace before the wake schedule is hit.
