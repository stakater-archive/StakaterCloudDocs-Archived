# Accessing the registry

## Authentication
There are two supported ways for authentication:

- **SSO**:
You can authenticate by the identity provider which your organization integrated with SRO. (for instance, google, Azure AD and so on)

- **Local user authentication**:
For access from within the cluster, nexus local user authenitcation is using partially for now (For docker registry and helm chart repository).

## Consuming the nexus API
You can follow the general OIDC flow to get the access token. Once you get access token, you can consume any protected resources in nexus you have privileges.
