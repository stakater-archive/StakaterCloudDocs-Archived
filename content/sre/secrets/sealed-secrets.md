# Sealed Secrets

[[toc]]

## Overview

[SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) controller solves the problem of storing kubernetes secret data securely by encrypting the configurations. It can only be decrypted by sealed secret controller running in cluster.

### Problem: Downside of Kubernetes Secrets

In Kubernetes Secrets, the data is stored as base64 encoded string, which is easily decryptable.

### Solution

Sealed Secrets resolved the issue by encryting the data which is only decryptable by component of sealed secret running in cluster.

## Architecutre

SealedSecrets is composed of two components:

* `Controller`: A cluster-side component for data decryption.
* `Kubeseal`: A client-side utility for data encryption. It uses asymmetric cryptography methods for data encryption.

[![SealedSecret Architecture Diagram](./images/sealed-secret.png)](https://engineering.bitnami.com/articles/sealed-secrets.html)

[Source](https://engineering.bitnami.com/articles/sealed-secrets.html)

### Terms

Following terms will be used a lot in this workshop, so following is their explanation.

* `Secret`: Kubernetes secret which stores data in base64 form.
* `Kubeseal`: A client-side CLI used for data encryption.
* `SealedSecret`: CRD created by SealedSecret Operator, which means the resource that is encrypted and can be pushed to git as well.
* `Key Pair`: The public-private key pair used to encrypt data.

### Working

SealedSecrets Controller generate a public/private key pair that it uses to encrypt/decrypt data. This key pair is generated once when the SealedSecrets Controller is deployed. The secrets sealed by one controller cannot be decrypted by another controller because the key pair is different for every deployed controller. 

So an issue arises, that if you want to replicate your environment, can you use the same SealedSecrets into another cluster/environment. So answer is yes. SealedSecrets Controller stores key pair as a K8s secret. To reuse it, you can fetch the key pair secret and keep it in a secure place like Vault (never check key pair on git) and apply the key pair secret whenever you want to reuse the key pair with a different controller.

There are two ways to seal a secret:

1. Using Controller

Use the command given below to generate sealed-secret:

```bash
sudo kubeseal --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE  < UNSEALED-SECRET.yaml > SEALED-SECRET.yaml
```

2. Using Cert

Use the following command to get the cert and store it in a file:

```bash
sudo kubeseal --fetch-cert --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE
```

To encrypt the data with cert use the command given below:

```bash
sudo kubeseal --cert CERT-FILE < UNSEALED-SECRET.yaml > SEALED-SECRET.yaml
```

An example is of how sealed secret encryptes the data is given below:

**Data**

Following data needs to protected:

1- `mysql user`: root

2- `mysql password`: @mysqlpassword 

3- `mysql database`: test-database

**Unsealed Data**

Kubernetes secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secrets
  namespace: nordmart-dev-apps
data:
  mysql_user: cm9vdA==  # <- base64 encoded root
  mysql_password: QG15c3FscGFzc3dvcmQ=  # <- base64 encoded @mysqlpassword
  mysql_database: dGVzdC1kYXRhYmFzZQ==  # -< base64 encoded test-database
```

**Sealed Data**

Encrypted kubernetes secret:

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: mysql-secrets
  namespace: nordmart-dev-apps
spec:
  encryptedData:
    mysql_user: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq.....
    mysql_password: AyBQ@XZOSAK@+A@DZAASDasd21@6.....
    mysql_database: Raz+1@2ZQzia921@ea21@a21az23.......
```

# Scenario

[[toc]]

## Overview

In this document, we will follow a scenario in which we want to deploy a MySQL instance for the Nordmart Catalog microservice. Following version of sealed secret will be used in this workshop

```
Chart Version: 1.6.0
Image Version: V0.9.5
```

## Scenario Guidelines

1. There are two ways to install the SealedSecret server side controller:

    ClusterRole use in both methods:

    ```yaml
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
    name: secrets-unsealer
    labels:
        app.kubernetes.io/name: "sealed-secret-name"
    rules:
    - apiGroups:
        - bitnami.com
        resources:
        - sealedsecrets
        verbs:
        - get
        - list
        - watch
        - update
    - apiGroups:
        - ""
        resources:
        - secrets
        verbs:
        - get
        - create
        - update
        - delete
    - apiGroups:
        - ""
        resources:
        - events
        verbs:
        - create
        - patch
    ```
    
    1. Using Kubernetes manifest:

    ```bash
    kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.5/controller.yaml
    ```
    It will create a CRD and install the SealedSecret controller in the `kube-system` namespace.
 
    2. Using helm manifest:

```yaml
  apiVersion: helm.fluxcd.io/v1
  kind: HelmRelease
  metadata:
    name: stakater
    namespace: demo
  spec:
    releaseName: stakater
    chart:
      repository: https://kubernetes-charts.storage.googleapis.com
      name: sealed-secrets
      version: 1.6.0
    values:
      image:
        repository: quay.io/bitnami/sealed-secrets-controller
        tag: v0.9.5
        pullPolicy: IfNotPresent
      controller:
        create: true
      crd:
        create: false
      rbac:
        create: true
      secretName: "sealed-secrets-key"
      serviceAccount:
        create: true
        name: "stakater-sealed-secret-sa"
```

2. Install the Sealed Secret Client side tools using the steps given below:

```bash
# Set release variable to latest
release=$(curl --silent "https://api.github.com/repos/bitnami-labs/sealed-secrets/releases/latest" | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p')
# Set your OS
GOOS=$(go env GOOS)
# Set your Architecture
GOARCH=$(go env GOARCH)
# Get the Kubeseal Binary
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/$release/kubeseal-$GOOS-$GOARCH
# Install the binary
sudo install -m 755 kubeseal-$GOOS-$GOARCH /usr/local/bin/kubeseal
```

3. Create a secret that will be used in the MySQL manifest:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secrets
  namespace: demo
data:
  mysql_user: cm9vdA==  # <- base64 encoded root
  mysql_password: QG15c3FscGFzc3dvcmQ=  # <- base64 encoded @mysqlpassword
  mysql_database: dGVzdC1kYXRhYmFzZQ==  # -< base64 encoded test-database
```

4. There are two ways to seal the above secret:

**Using Controller**

Use the command given below to generate sealed-secret:

```bash
kubeseal --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE  < UNSEALED-SECRET.yaml -o yaml > SEALED-SECRET.yaml
```

**Using Cert**

Use the following command to get the cert and store it in a file:

```bash
sudo kubeseal --fetch-cert --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE > CERT-FILE
```

To encrypt the data with cert use the command given below:

```bash
sudo kubeseal --cert CERT-FILE < UNSEALED-SECRET.yaml -o yaml > SEALED-SECRET.yaml
```


Once the secret is sealed it will look like this:

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: mysql-secrets
  namespace: demo
spec:
  encryptedData:
    mysql_user: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq.....
    mysql_password: AyBQ@XZOSAK@+A@DZAASDasd21@6.....
    mysql_database: Raz+1@2ZQzia921@ea21@a21az23.......
```

6. Now you can add the file to your version control and in your CI/CD, you can specify to `kubectl apply` this file to create the SealedSecret, for now I will apply it manually but this same command can run in Jenkins or Gitlab CI or any other tool you use:

```
sudo kubectl apply -f SEALED-SECRET.yaml -n NAMESPACE
```

7. Once the sealed secret resource is created the controller will perform following operations:

    1. It will detect the sealed secret resource.
    2. It will unseal it using its private key.
    3. It will store the unsealed secret in the namespace specific in the manifest.

8. Check the namespace in which sealed secret was created, whether the sealed secret was unsealed or not. If the secret exists move to the next step otherwise check the logs of the controller.

9. Delpy the MySQL using the manifest given below:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: mysql
  name: mysql-svc
  namespace: demo
spec:
  ports:
  - name: "mysql-port"
    port: 3306
    targetPort: 3306
  selector:
    app: mysql
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: demo
spec:
  serviceName: "mysql"
  selector:
    matchLabels:
      app: mysql
  replicas: 1
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: mysql
    spec:

      initContainers:
      - image: busybox
        name: mysql-volume-cleaner
        args: [/bin/sh, -c, 'rm -rf /var/lib/mysql/lost+found || true']
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-pvc

      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secrets
              key: mysql_password
        ports:
        - containerPort: 3306
          name: tcp
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-pvc
        resources: {}
  volumeClaimTemplates:
  - metadata:
      name: mysql-pvc
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: hdd
      resources:
        requests:
          storage: 5Gi
```

10. Check whether the MySQL has been deployed correctly or not by using mysql shell:

```bash
# enter the mysql pod

kubectl -n NAMESPACE exec -it POD-NAME /bin/bash

# use the mysql shell
mysql -u root -p
```

11. If the `mysql-secret` is updated we will use [Reloader](https://github.com/stakater/Reloader#secret) tool to update MySQL Statefulset. It requires following annotations to be added in MySQL statefulset manifest:

```yaml
kind: Deployment
metadata:
  annotations:
    secret.reloader.stakater.com/reload: "mysql-secret"
spec:
  template: metadata:
```

## SealedSecret Decryption
SealedSecret can be decrypted online using the steps given below:

1. Get the secret key

```bash
 kubectl get secret -n NAMESPACE -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > MASTER.yaml
```

2. Convert the list to a Secret Object.

3. Use the command given below to decrypt the SealedSecret:

```bash
kubeseal --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE < SEALED-SECRET.yaml --recovery-unseal --recovery-private-key MASTER.yaml -o yaml > UNSEALED.yaml
```


## SealedSecret usage in Jenkins or GitOps strategy:

SealedSecret can be stored anywhere. The user just need to use the command given below to apply the changes:

```bash
kubectl apply -f SEALED-SECRET.yaml -n NAMESPACE
```

# Key Management

[[toc]]

## Overview
This document provides guidelines on the management of SealedSecret keys.

## Secret Rotation

There are two ways to secure the secrets:

### Key Renewal

In this method the SealedSecret keys will be rotated/renewed. The are two ways for key renewal:

#### Scheduled

By default, KeyPairs are automatically renewed every `30 days`. This can be configured on controller startup with the `--key-renew-period=<value>` flag. The value field can be given as golang duration flag (eg: 720h30m). A value of 0 will disable automatic key renewal.

The feature has been historically called "key rotation" but this term can be confusing. Sealed secrets are not automatically rotated and old keys are not deleted when new keys are generated. Old sealed secrets resources can be still decrypted.

Once the key is renewed we need to fetch the cert and seal the secrets again.


#### Non-scheduled / Early Key Renewal

To renew the key before the expiration date, follow the guideline given below:

1. Label the old key as compromised.

```bash
sudo kubectl -n NAMESPACE label secrets SECRET-NAME sealedsecrets.bitnami.com/sealed-secrets-key=compromised --overwrite=true
```

2. Make sure that the `compromised` label is assigned. 

3. Restart the controller.

4. Get the new public key:
    
```bash
sudo kubeseal --fetch-cert --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE
```

5. Store the key in a file.

6. Re-seal your secrets with the new key.
```bash
sudo kubeseal --cert CERT-FILE < UNSEALED-SECRET.yaml -o yaml > SEALED-SECRET.yaml
```

## How to reuse SealedSecret Key

Sealed secret has one problem that a key pair is generated only once, so a sealed secret generated for one cluster will not be usable in another cluster. This problem can be resolved by reusing the decryption key. To do it follow the steps given below:

1. Get the decryption key using the command given below:

    ```bash
    sudo  kubectl get secret -n NAMESPACE -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > MASTER.yaml
    ```

    Store this key at the secure location like data key vault.

2. Now this key can be used in another cluster like
    ```bash
    sudo kubectl apply -f MASTER.yaml
    ```
    Make sure the key is being created in the correct `namespace`. When the SealedSecret controller starts it will scan the namespace to check whether a key already exists or not.


# Caveats

[[toc]]

## Overview

This section contains the caveats in the current version of SealedSecret.

## ClusterRole Issue

It requires ClusterRole to watch the SealedSecrets. If ClusterRole is not provided, it doesn't operate and continually generates error regarding the cluster-scope RBAC issue.

SealedSecret team is working on a feature to restrict the controller watch to only selected namespaces.

We have given ClusterRole to the SealedSecret's service account with following rules:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secrets-unsealer
  labels:
    app.kubernetes.io/name: "sealed-secret-name"
rules:
  - apiGroups:
      - bitnami.com
    resources:
      - sealedsecrets
    verbs:
      - get
      - list
      - watch
      - update
  - apiGroups:
      - ""
    resources:
      - secrets
    verbs:
      - get
      - create
      - update
      - delete
  - apiGroups:
      - ""
    resources:
      - events
    verbs:
      - create
      - patch
```

## Multi-tenancy

SealedSecret Controller uses ClusterRole to watch SealedSecret resources in all cluster namespaces, so therefore mutli-tenancy cannot be acheived.

## Where to Save Original Secrets

Again the question arises, where do we save the original secrets.


## Key Renewal / Rotation

Its keys are renewed after 30 days by default. New key will not be able to decrypt the old sealed secrets. So if a secret is deleted from a namespace then its controller will not be able to generate secret from the old sealed secret, which makes the old sealed secrets useless.

So, the user needs to generate new sealed secrets from the secrets again.

## Secret Key Security

If secret key is compromised, then your sealed secrets might get decrypted.

## Secret Key Storage

SealedSecert's key pair must be placed in a secure source like vaults etc.

## SealedSecrets Management

Before using SealedSecrets following questions must be answered:

1. Who will generate SealedSecrets?
2. Who will maintain it?

## No Sync as of Now

If one deletes the secret manually, it will not create it again, it only processes it once only

## Similar Tools

List of alternative tools are given below:

1. [Vault](https://www.vaultproject.io/docs/platform/k8s/run.html).

2. [Kamus](https://github.com/Soluto/kamus).

3. [Helm Secrets](https://github.com/futuresimple/helm-secrets): Only when using helm

