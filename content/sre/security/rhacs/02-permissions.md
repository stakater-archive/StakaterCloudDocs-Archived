## Roles and Users

### Users

We divide the rhacs users into 2 groups according to the interaction method:

1. Human users and 
2. Machines users

#### 1. Human Users

Human user interacts with rhacs using UI. For Human users, we are using SSO authentication method. So once we grant proper roles to the users. You can refer the role mapping rules mentioned above as the list format. At the first login, account information is registered in the rh-sso which is comming from the IdP. If that information is enough, then registration is performed automatically. If some information is missing, user is requested to update account information and user has to fill out all information. 

#### SSO (oauth) Roles

For human users which login via SSO we have following roles available.

| RHACS Role         | Privileges                                                |
|--------------------|-----------------------------------------------------------|
| Admin              | All                                                       |
| Analyst  (default) | view on everything in cluster , this is the default role  |

On first login you automatically get `Analyst`. 

#### 2. Machine Users

Machine user interacts with roxctl using API or CLI and we are using `rox_api_token` authentication for machines users.

The `rox_api_token` is created automatically in build namespaces to run rhacs steps in tekton pipelines.