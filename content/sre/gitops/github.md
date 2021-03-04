# Configuring gitops-config repo on GitHub

- Create a git repo and name it `gitops-config`
- Enable branch protection; `Settings > Branches > Branch protection rules` and then click `Add rule` and select following only

![main-branch-protection-rule](./images/main-branch-protection-rule.png)

- Add the Stakater bot user as collaborator with `Admin` permissions (ask Stakater team about the bot user id); `Settings > Manage access > Invite people or team`

We need to provide `Admin` permissions because bot user pushes mainfest directly to main branch from the tekton pipelines.

The bot user has only `Admin` permissions on this repo.

For developers we want them to make PR's for changes in `gitops-config` repo; but we need to allow bot user to bypass the rule; so, therefore has to be admin.

![grant-admin-access](./images/grant-admin-access.png)
