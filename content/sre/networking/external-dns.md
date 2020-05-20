# External DNS

[ExternalDNS](https://github.com/kubernetes-sigs/external-dns) is a Kubernetes addon that configures public DNS servers 
with information about exposed Kubernetes services to make them discoverable.

This helps us automate the process of adding DNS entries to the corresponding hosting service for DNS domains. Currently,
it supports the following DNS providers:
- aws, azure, cloudflare, coredns, designate, digitalocoean, google, infoblox, rfc2136, transip

## Walkthrough of external-dns on AWS

### 1. Create an AWS IAM user with the following permissions attached

- AmazonRoute53FullAccess
- Route53CreateHostedZone

For details: https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md#setting-up-externaldns-for-services-on-aws

### 2. Generate Access Keys

### 3. Create a new project 

`oc new-project external-dns`

### 4. Create a secret that contains credentials for that AWS user

```yaml
apiVersion: v1
data:
  AWS_ACCESS_KEY_ID: <concealed>
  AWS_SECRET_ACCESS_KEY: <concealed>
kind: Secret
metadata:
  name: external-dns-creds
  namespace: external-dns
type: Opaque
```

### 5. Create rbac

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-dns
  namespace: external-dns
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: external-dns
rules:
  - apiGroups: [""]
    resources: ["services","endpoints","pods"]
    verbs: ["get","watch","list"]
  - apiGroups: ["extensions"]
    resources: ["ingresses"]
    verbs: ["get","watch","list"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["list"]
  - apiGroups: ["route.openshift.io"]
    resources: ["routes"]
    verbs: ["get","watch","list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: external-dns-viewer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: external-dns
subjects:
  - kind: ServiceAccount
    name: external-dns
    namespace: external-dns
```

### 6. Create SecurityContext

```yaml
apiVersion: v1
kind: SecurityContextConstraints
metadata:
  name: external-dns-scc
users:
  - system:serviceaccount:external-dns:external-dns
requiredDropCapabilities:
  - MKNOD
  - SYS_CHROOT
runAsUser:
  type: RunAsAny
seLinuxContext:
  type: RunAsAny
fsGroup:
  type: RunAsAny
volumes:
  - configMap
  - downwardAPI
  - emptyDir
  - persistentVolumeClaim
  - projected
  - secret
```

### 7. Deploy external-dns

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: external-dns
  namespace: external-dns
spec:
  releaseName: external-dns
  chart:
    repository: https://kubernetes-charts.storage.googleapis.com 
    name: external-dns
    version: 2.4.2
  values:
    image:
      registry: docker.io
      repository: stakater/external-dns
      tag: latest
      pullPolicy: IfNotPresent
    sources:
      - openshift-route
    domainFilters:
      - custom-domain.com
    provider: aws
    txtOwnerId: external-dns
    txtPrefix: external-dns-
    registry: txt
    extraEnv:
    - name: AWS_ACCESS_KEY_ID
      valueFrom:
        secretKeyRef:
          name: external-dns-creds
          key: AWS_ACCESS_KEY_ID
    - name: AWS_SECRET_ACCESS_KEY
      valueFrom:
        secretKeyRef:
          name: external-dns-creds
          key: AWS_SECRET_ACCESS_KEY
    policy: sync
    rbac:
      create: false
      serviceAccountName: external-dns
      apiVersion: v1beta1
    tolerations:
    - key: "dedicated"
      operator: "Equal"
      value: "app"
      effect: "NoSchedule"
    resources:
      limits:
        cpu: 50m
        memory: 100Mi
      requests:
        memory: 50Mi
        cpu: 10m
```


NOTE: In it's current state external-dns is not completely functional on openshift. Will add an update here as soon as the issue is resolved.

For further details and configuration related to other clouds: [External-dns Tutorials](https://github.com/kubernetes-sigs/external-dns/tree/master/docs/tutorials)