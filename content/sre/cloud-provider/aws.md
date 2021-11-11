# AWS

An AWS account is needed to create and manage cluster on aws. The following criteria must be met

- An account on AWS.
- A Stakater user (ask Stakater team for the email to use for this user) with admin privileges on a separate project (Recommended). See the [required permissions](https://docs.openshift.com/container-platform/4.9/installing/installing_aws/installing-aws-account.html#installation-aws-permissions_installing-aws-account) for AWS if you do not want to grant admin privilege.
- Resource limits must be applied on the account and the following resources must be allowed to be created.

  |Type        | Limit |
    |------------|------------|
  | Virtual Machines | Varies. The limit should be 12 initially. (Initial deployemnt is 3 master + 3 infra + 3 worker)|
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
