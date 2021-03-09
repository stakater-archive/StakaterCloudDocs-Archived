# Configuring a KeyCloak identity provider 

In the realm you want to provide access, create a new Client:

- Client ID: `ap-broker`
- Name: `Stakater Agility Platform - Broker (OR whatever is suitable)`
- Enabled: `ON`
- Client Protocol: `openid-connect`
- Access Type: `Confidential`
- Standard Flow Enabled: `ON`
- Service Accounts Enabled: `ON`
- Authorization Enabled: `ON`
- Redirect URI: Ask Stakater Support team to provide the redirect URI

Now on the newly created `Client`; go to `Credentials` tab and copy the `Secret` mentioned there. That is the secret Stakater team will be needing in order to authenticate your keycloak.

## Items provided by Stakater Support
- `Redirect URIs`

## Items to be provided to Stakater Support
- `Client ID`
- `client Secret`