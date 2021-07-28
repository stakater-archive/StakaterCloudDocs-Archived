# Bot Account Permissions

Stakater bot account will have following permissions

## GitOps Repo

### Admin

Bot account need to have admin permission in gitops repository as it's going to push to default branch of gitops repository. Bot account is used by tekton pipeline and push changes in gitops repository.

Default branch of repository is usually protected. In order to make any change to gitops repository,developers will have to make PR and merge it to default branch. Bot account need to have admin permission to by pass this rule


## Application Repo

### Write

Bot account need to have write permission in application repository. As bot account is used by tekton pipeline, pipeline bump tag version at the end of successful execution. To push tag to application repository, bot account need to have write permission there.