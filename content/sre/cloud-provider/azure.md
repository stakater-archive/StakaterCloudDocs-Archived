# Azure

An azure subscription is needed to create and manage cluster on azure. The following criteria must be met

- Stakater shall be provided access to a separate subscription.
- The access must be enough to create Applications in Azure AD.
- Stakater shall share an email address that should have full access to this subscription.
- The customer must not use this subscription for other purposes and only stakater shall be responsible for managing resources created in this subscription.
- Resource limits must be applied on the subscription and only the following resources must be allowed to be created.

  |Type        | Limit |
  |------------|------------|
  | Virtual Machines | Varies. The limit should be 12 initially. (Initial deployemnt is 3 master + 3 infra + 3 worker) |
  | Regional vCPUs | The limit should be A x B x 2 , where A = no. of VMS (worker + infra + master), B = vCPUs per VM) |
  | Public IP addresses | 5 |
  | Private IP Addresses | 7 |
  | Network Interfaces | 6 |
  | Network Load Balancers   | 3 |
  | Virtual Networks | 1 |
  | StandardStorageSnapshots | 10000 (depends on how many disks are used) and backup duration |
  | Machine Specifications | 6 machines of 8x32x120G |
  | Region | Region will be identified by the customer |
