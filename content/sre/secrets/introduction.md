# Introduction to Secrets

[[toc]]

Kubernetes Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. Storing confidential information in a Secret is safer and more flexible than putting it verbatim in a Pod definition or in a container image.

Secrets can contain user credentials required by Pods to access a database. For example, a database connection string consists of a username and password. You can store the username in a file ./username.txt and the password in a file ./password.txt on your local machine.

```sh
# Create files needed for the rest of the example.
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

```sh
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```

## Applying Secret File

There are 2 ways for it.

1. Base64 decode your values & create a Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  config.yaml: |-
    apiUrl: "YXBpLmNvbQo="  # base64 for api.com
    username: YWRtaW4K      # base64 for admin
    password: cGFzc3dvcmQK  # base64 for password
```

2. Use StringData with literal values to create Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: admin
    password: password
```

## Limitations of kubernetes secrets

1. They are not encrypted at rest.
2. By default, cluster admins can see all the secrets of all the tenants.
3. When in use (i.e. mounted as tempfs in the node that runs the pod that is using them), they can be seen by a node administrator.
4. When in use, they can be seen by anyone who has the ability to remote shell into the container.
5. Can not store Kubernetes secrets in Git repo as they are easily decodable and anyone can decode them. 

So to handle this case, we need some other tool to handle this.

SAAP offers two different managed solutions for consuming secrets in more secure fashion:

1. Sealed Secrets
2. Vault
