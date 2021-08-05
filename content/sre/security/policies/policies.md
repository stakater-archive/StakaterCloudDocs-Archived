# Policies

## Overview

Policies are resources that govern the behavior of the Kubernetes cluster, where they provide defaults for configuration and also determines what is allowed or disallowed.

![image](./images/how-policies-work.png)

## Kyverno

Kyverno is a policy engine designed for Kubernetes. It manages policies as Kubernetes native resources and no new language is required to write policies. This allows using familiar tools such as kubectl, git, and kustomize to manage policies. Kyverno policies can validate, mutate, and generate Kubernetes resources.

## How to write Policies?

To add custom policies, user can create `Policy` custom resource. This is a namespaced resource and would only allow policy policy in the relevant namespace.

Detailed walk-through of how to create policies can be found [here](https://kyverno.io/docs/writing-policies)

[For reference: Sample Policies](https://kyverno.io/policies/)

**NOTE:** Creating cluster level policies is not allowed.

### Example

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: require-label-development-team
  annotations:
    policies.kyverno.io/title: Require label Development Team
    policies.kyverno.io/category: Best Practices
    policies.kyverno.io/severity: low
    policies.kyverno.io/subject: Pod
    policies.kyverno.io/description: >-
      Require pods to have development-team label set
spec:
  validationFailureAction: enforce
  rules:
    - name: require-label-development-team
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "The label `development-team` is required"
        anyPattern:
          - metadata:
              labels:
                development-team: "?*"
```

### Failure Actions

To update failure action, we can set the following values for `validationFailureAction` in the `Policy` custom resource. It supports the following values:

### Audit

In `audit` mode, the policy will generate appropriate warnings but won't reject anything. We can view `PolicyReport` custom resource against that policy to view detailed violation report.

### Enforce

In `enforce` mode, the policy will deny/reject all actions that violate the policy. Report is generated against all the violations and is stored in `PolicyReport` custom resource.

### Default Policy

Policies that are enforced by default. User cannot disable these policies since they are considered essential for governance, security etc.

## Stakater Cloud UI

A concrete list of policies is maintained by Stakater for ensuring that clusters follow best practices for security, governance etc. This list of policy can be accessed using our centralized control-plane [Stakater Cloud](https://cloud.stakater.com)

![image](./images/policies-frontend.png)

**NOTE:** Policies added directly to the clusters(Namespaced Policies) cannot be managed through this front-end

## Alternatives to kyverno

### Kyverno vs OPA Gatekeeper

| Features/Capabilities                       | Gatekeeper | Kyverno        |
| ------------------------------------------- | ---------- | -------------- |
| Validation                                  | ✓          | ✓              |
| Mutation                                    | ✓          | ✓              |
| Generation                                  | X          | ✓              |
| Policy as native resources                  | ✓          | ✓              |
| Metrics exposed                             | ✓          | ✓              |
| OpenAPI validation schema (kubectl explain) | X          | ✓              |
| High Availability                           | ✓          | ✓              |
| API object lookup                           | ✓          | ✓              |
| CLI with test ability                       | ✓          | ✓              |
| Policy audit ability                        | ✓          | ✓              |
| Programming required                        | ✓ (Rego)   | ✓ (Javascript) |

## Useful Links

- [https://kubernetes.io/docs/concepts/policy](https://kubernetes.io/docs/concepts/policy/)
- [OPA Gatekeeper vs. Kyverno](https://www.youtube.com/watch?v=9gSrRNmmKBc)
- [Kyverno Policy Agent](https://thenewstack.io/kyverno-kubernetes-configuration-via-policy/)

## FAQ

- Can we manage policies added by customers using Stakater Cloud? No, as of right now there is no option for that.
- Can we disable default policies? No, these policies are critical in maintaining a secure environment for the customers.
