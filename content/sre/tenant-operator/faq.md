# FAQs

## Q. Error received while performing Create, Update Delete operation on namespace `Cannot CREATE namespace test-john without label stakater.com/tenant`

**Ans.** Error occurs when a user is trying to perform create, update, delete operation on namespace without the required label `stakater.com/tenant` which is used by the operator to see that authorized users can performing the action on namespace. Just add the label with the tenant name to so that Tenant-Operator knows which tenant the namespace belongs to and who is authorized to perform create/update/delete operation.
