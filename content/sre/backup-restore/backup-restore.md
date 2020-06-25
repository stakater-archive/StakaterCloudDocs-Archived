# Backup and Restore

Back up and restore applications on SRO (Stakater Red Hat OpenShift)

## Backup

Stakater takes automatic backup of all kubernetes resources(manifests) and volumes. The backups are stored in your cloud account. By default, backups are taken after every 1 hour and are retained for 24 hours. To enable more frequent, resource specific or varying retention, please contact Stakater Support.

## Restore

Resources can be restored on demand. Please contact support and specify the following 

- Time to restore back to.
- Namespaces to include/exclude from backup
- Resources to include/exclude from backup
- LabelSelector to filter objects to restore
- Whether to include cluster resources or not
- Whether to restore PVs or not
