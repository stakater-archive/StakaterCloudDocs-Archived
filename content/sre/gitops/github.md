# Configuring gitops-config repo on GitHub

- Create a git repo and name it `gitops-config`
- Enable branch protection; `Settings > Branches > Branch protection rules` and then click `Add rule` and select following only

![main-branch-protection-rule](./images/main-branch-protection-rule.png)

- Add the Stakater bot user as collaborator with `Admin` permissions (ask Stakater team about the bot user id); `Settings > Manage access > Invite people or team`

![grant-admin-access](./images/grant-admin-access.png)
