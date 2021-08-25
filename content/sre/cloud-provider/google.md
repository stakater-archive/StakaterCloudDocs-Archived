# Google

An GCP account is needed to create and manage cluster on GCP. The following criteria must be met

- Stakater shall be provided access to a separate project.
- The Stakater user must have admin access on the created project.
- Stakater shall share an email address that should have full access to this project.
- The customer must not use this project for other purposes and only stakater shall be responsible for managing resources created in this account.
- Resource limits must be applied on the account and only the following resources must be allowed to be created.

  |Type        | Limit |
    |------------|------------|
  | Virtual Machines | Varies. The limit should be 12 initially. (Initial deployemnt is 3 master + 3 infra + 3 worker)|
  | Regional vCPUs | The limit should be A x B x 2 , where A = no. of VMS (worker + infra + master), B = vCPUs per VM) |
  | In-use global IP addresses | 4 |
  | Service accounts | 5 |
  | Firewall Rules | 11|
  | Forwarding Rules | 2|
  | Routers | 1|
  | Routes | 2|
  | Subnetworks | 2|
  | Firewall Rules | 11|
  | Persistent Disk SSD (GB)| 896|
  | Target Pools | 3|
  | Machine Specifications | 6 machines of 8x32x120G |
  | Region | Region will be identified by the customer |
