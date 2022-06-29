# Troubleshooting Guide

## Permission Issues

### Vault user permissions not updated immediately if the user is added to Tenant CR, and the user does not exist in RHSSO

#### Problem

If a user is added to tenant resource, and the user does not exist in RHSSO, then Vault is not updated with user's permissions immediately.

Description/steps after which this situation occurs:

1. Add a new user to Tenant CR 
2. Attempt to log in to Vault with the added user
3. Vault denies that the user exists, and signs the user up via RHSSO. User is now created on RHSSO (You may check for the user on RHSSO).

#### Recommendation

If the user does not exist in RHSSO, then TO does not create the tenant access for Vault in RHSSO (As the user does not exist in RHSSO).

The user now needs to go to Vault, and sign up using OIDC. Then the user needs to wait for TO to reconcile the updated tenant (reconciliation period is currently 1 hour). After reconciliation, TO will add relevant access for the user in RHSSO.

If the user needs to be added immediately and it is not feasible to wait for next TO reconciliation, then: add a label or annotation to the user, or restart the Tenant controller pod to force immediate reconciliation.