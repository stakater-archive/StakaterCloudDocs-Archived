# Troubleshooting Guide

## Permission Issues

### User permissions not updated immediately after user added to Tenant CR

#### Problem

User is added to tenant, Vault is not updated with user's permissions immediately.

Description/steps after which this situation occurs:

1. Add a new user to Tenant CR
2. Attempt to log in to Vault with the added user
3. Vault denies that the user exists, and signs the user up via RHSSO. User is now created on RHSSO (You may check for the user on RHSSO). Tenant Operator logs say that the user does not exist on RHSSO (but the user actually exists). 

If the TO controller pod is restarted at this point, TO will not show any error for the user after being restarted. Log in to Vault will also succeed after restart. 

#### Recommendation

If the user does not exist in RHSSO, then TO does not create the tenant access for Vault in RHSSO (As the user does not exist in RHSSO). (Steps 1 - 3)

The user now needs to go to Vault, and sign up using OIDC. Then the user needs to wait for TO to reconcile this (reconciliation period is currently 1 hour). After reconciliation, TO will add relevant access for the user in RHSSO.

It the user needs to be added immediately and it is not feasible to wait for next TO reconciliation, then add a label or annotation to the user, to force immediate reconciliation.