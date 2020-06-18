# Azure

SRO supports provisioning clusters on Azure.

## Subscription

An azure subscription is needed to create and manage cluster on azure. The following criteria must be met

- Stakater shall be provided access to a separate subscription.
- The access must be enough to create Applications in Azure AD.
- Stakater shall share an email address that should have full access to this subscription.
- The customer must not use this subscription for other purposes and only stakater shall be responsible for managing resources created in this subscription.
- Resource limits must be applied on the subscription and only the following resources must be allowed to be created.

  |Type        | Limit |
  |------------|------------|
  | Virtual Machines | The limit should be no. of worker + infra + master |
  | Regional vCPUs | The limit should be A x B x 2 , where A = no. of VMS (worker + infra + master), B = vCPUs per VM) |
  | DSV3 family CPUs | Atleast A x B x 2 ,  where A = no. of VMS (worker + infra + master), B = vCPUs per VM) |
  | Public IP addresses | 10 |
  | Standard Sku Public IP Addresses | 10 |
  | Static Public IP Addresses | 10 |
  | Storage Accounts | 10 |
  | Load Balancers   | 6 |
  | Standard Sku Load Balancers | 6 |
  | Virtual Networks | 3 |
  | StandardStorageSnapshots | 10000 (depends on how many disks are used) and backup duration |
  | Network Security Groups | 6 |
  | Premium Storage Managed Disks | 100 (depends on how many disks are used) |
  | Network Interfaces | 30 |
