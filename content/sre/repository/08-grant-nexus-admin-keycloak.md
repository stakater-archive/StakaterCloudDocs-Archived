## Granting Admin privilege to user for nexus on Keycloak

- Goto routes in `stakater-auth` namespace , open keycloak route , following screen will show up 

  ![Administration Console](./images/keycloak-1.png)

- Select Administration Console. Login credentials are present in secret `rhsso-creds` (previously called `auth-secrets`)  in `stakater-auth` namespace
  
  ![Login Admin Console](./images/keycloak-2.png)

- Click on `Users` from left panel and click on `view all users button`. Select the user you want to assign admin role to.
  
  ![Users](./images/keycloak-3.png)

- On Role Mappings screen , select `nexus3` in client roles drop down. 
  
  ![Role Mappings](./images/keycloak-4.png)

- On user screen select Role Mappings tab , `nexus-oauth-admin` role will be present in left most column , select it and click on `Add selected`
  
  ![nexus oauth admin Role](./images/keycloak-5.png)

- Role is assigned to user
  
  ![add selected role](./images/keycloak-6.png)\

- Now login to nexus repository you will have admin access
  
  ![Nexus Repository](./images/keycloak-7.png)