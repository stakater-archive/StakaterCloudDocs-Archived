# Accessing the registry

## Authentication
There are two supported ways for authentication:

- **Session Token**:
You can authenticate against user session token but that token is only valid for 24 hours. 

- **Service Account**:
For access from within the cluster, service account is the recommended approach. 

## Authorization

### Pulling Images

For pulling images from image registry, user/serviceAccount must have the `registry-viewer` role
```shell script
oc policy add-role-to-user registry-viewer <user_name>
```

### Pushing Images
For pushing images to image registry, user/serviceAccount must have the `registry-editor` role
```shell script
oc policy add-role-to-user registry-editor <user_name>
```

When using `session token` authorization is based on access for projects/namespaces. Meanwhile, since `service account`
are tied to namespaces, you'll only have access to the specific namespace that the service account belongs to.


## Accessing registry directly from outside the cluster

Although it's not recommended, but in case it's a hard requirement for some end user. They can request to someone from 
Stakater Cloud team and they will expose a secure route for you that will be accessible over the internet.
In future all these options will be available to end users via a dashboard.

## Useful Resources

- https://docs.openshift.com/container-platform/4.4/registry/accessing-the-registry.html
- https://cloud.ibm.com/docs/openshift?topic=openshift-registry#route_internal_registry