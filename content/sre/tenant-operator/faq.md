# FAQ

## Q. Error received while deleting namespace `Cannot DELETE namespace test-john without label stakater.com/tenant`.

**Ans.** Error occurs when a user is trying to delete a namespace without the required label `stakater.com/tenant` which is used by the operator to see that authorized users can delete namespaces. Just add the label with the tenant name to so that Tenant-Operator knows who is deleting which namespace and are they authorized.
