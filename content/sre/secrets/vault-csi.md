# Vault CSI Provider

The Vault CSI Provider allows pods to consume Vault secrets using CSI Secrets Store volumes

There are two possible ways to consume secrets from vault:

1. Option # 1 - Consume vault secret via a volume
2. Option # 2 - Consume vault secret via environment variable

Below you can find step by step guide to consume.

## Option # 1 - Consume vault secret via a volume

To mount vault secret in volume, you need to do following:

- **Step 1**: Add label in serviceaccount so it can be granted vault read access to secret path
     ```
      serviceAccount:
        enabled: true
        additionalLabels: 
          stakater.com/vault-access: "true"
     ```

- **Step 2**: Enable ```SecretProviderClass``` object in helm values and define key and value path of vault. For example

    ```
    secretProviderClass:
      enabled: true
      name: postgres-secret
      roleName: '{{.Release.Namespace}}'
      objects: 
        - objectName: postgresql-password
          secretPath: gabbar/data/postgres
          secretKey: postgresql-password
    ``` 

- **Step 3**: Define volume in helm values that use above created ```SecretProviderClass```
  
    ```
    deployment:
       volumes: 
         - name: postgres-secret
           csi:
             driver: secrets-store.csi.k8s.io
             readOnly: true
             volumeAttributes:
               secretProviderClass: postgres-secret
    ```
    
- **Step 4**: Now mount this volume in container
  
  ```
     volumeMounts:
     - name: postgres-secret
       readOnly: true
       mountPath: /data/db-creds
  ```

Your secret should be available at the path defined above

## Option # 2 - Consume vault secret via environment variable

- **Step 1**: Enable ```SecretProviderClass``` object in helm values and define key/value path and secret objects in vault. For example

    ```
    secretProviderClass:
      enabled: true
      name: postgres-secret
      roleName: '{{.Release.Namespace}}'
      objects: 
        - objectName: postgresql-password
          secretPath: gabbar/data/postgres
          secretKey: postgresql-password
      secretObjects:
        - data:
          - key: postgres-password
            objectName: postgresql-password
          secretName: postgres-secret
          type: Opaque 
    ``` 
   
   The value of **secretName** will be the name of kubernetes secret

- **Step 2**: Define volume in helm values that use above created ```SecretProviderClass```
  
    ```
    deployment:
       volumes: 
         - name: postgres-secret
           csi:
             driver: secrets-store.csi.k8s.io
             readOnly: true
             volumeAttributes:
               secretProviderClass: postgres-secret
    ```

- **Step 3**: Now mount this volume in container. 
  
  ```
     volumeMounts:
     - name: postgres-secret
       readOnly: true
       mountPath: /data/db-creds
  ```
  
  Volume mount is required in order to create kubernetes secret. you can mount it any location as its not being used.

- **Step 4**: This secret can be used as environment variable 

```
env:
   - name: POSTGRES_PASSWORD
     valueFrom:
        secretKeyRef:
            name: postgres-secret
            key: postgres-password
```

[Here](https://github.com/stakater-lab/stakater-nordmart-review/blob/main/deploy/values.yaml#L24) you can check example of csi configured 
