# AWS

Stakater Agility Platform supports provisioning clusters on AWS.

## Subscription

An AWS subscription is needed to create and manage cluster on azure. The following criteria must be met

- Stakater shall be provided access to a separate subscription.
- The Stakater user must have admin access on the created subscription.
- Stakater shall share an email address that should have full access to this subscription.
- The customer must not use this subscription for other purposes and only stakater shall be responsible for managing resources created in this subscription.
- Resource limits must be applied on the subscription and only the following resources must be allowed to be created.

  |Type        | Limit |
    |------------|------------|
  | Virtual Machines | The limit should be 12 i.e of 3 worker + 3 master |
  | Regional vCPUs | The limit should be A x B x 2 , where A = no. of VMS (worker + infra + master), B = vCPUs per VM) |
  | Elastic IPs (EIPs) | 5 |
  | Virtual Private Clouds (VPCs) | 5 |
  | Elastic Load Balancing (ELB/NLB) | 3 |
  | NAT Gateways | 5 |
  | Elastic Network Interfaces (ENIs) | At least 12 |
  | VPC Gateway| 20 |
  | S3 buckets| 99 |
  | Security Groups| 250|
  | Machine Specifications | 6 machines of 8x32x120G |
  | Region | Region will be identified by the customer |
