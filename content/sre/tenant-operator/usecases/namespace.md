# Creating Namespace

Anna as the tenant owner can create new namespaces for her tenant.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: bluesky-production
  labels:
    stakater.com/tenant: bluesky
```

::: warning Note:

Anna is required to add the tenant label 'stakater.com/tenant: bluesky' which contains the name of her tenant 'bluesky', while creating the namespace. If this label is not added or if Anna does not belong to the 'bluesky' tenant, then Tenant-Operator will not allow the creation of that namespace.
:::

When Anna creates the namespace, Tenant-Operator assigns Anna and other tenant members the roles based on their user types, such as a tenant owner getting the OpenShift `admin` role for that namespace.

As a tenant owner, Anna is able to create namespaces.

## What’s next

See how Bill can create [templates](./template.html)
