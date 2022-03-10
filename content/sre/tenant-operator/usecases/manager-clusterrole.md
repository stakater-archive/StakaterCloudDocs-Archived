# Extending Manager ClusterRole

Bill as the cluster admin want to add addtional rules for manager ClusterRole.

Bill can extend rules by adding addtional rbac rules at `managerRoleExtendedRules` in tenant operator Helm Charts
```yaml
managerRoleExtendedRules:
  - apiGroups:
    - user.openshift.io
    resources:
    - groups
    verbs:
    - create
    - delete
    - get
    - list
    - patch
    - update
    - watch
```
