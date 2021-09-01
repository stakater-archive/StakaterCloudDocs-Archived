# Troubleshoot

Following commands and their definitions will help you figure out issues with your backup & restore operations.

1. Checking logs for a backup or restore resource:
   - Backup logs

    ```bash
    velero backup logs <backup-name> -n <velero-namespace>
    ```

   - Restor logs

    ```bash
    velero restore logs <restore-name> -n <velero-namespace>
    ```

2. Download Completed Backups:

   ```bash
    velero backup download <backup-name> -n <velero-namespace>
   ```

3. Describe backups or restores:
    The `--details` flag in the command gives the list of all the resources backedup/restored.
   - Describe backup

    ```bash
     velero describe backup <backup-name> -n <velero-namespace>
     OR
     velero describe backup <backup-name> -n <velero-namespace> --details
    ```

   - Describe restore

    ```bash
     velero describe restore <restore-name> -n <velero-namespace>
     OR
     velero describe restore <restore-name> -n <velero-namespace> --details
    ```

## Possible usage of the commands can be in such manner

1. Check logs for any possible errors

2. Download backups to see if the manifests is correct and the contents are right. (for example, if the object that you backedup is present or not)

3. You can describe a backup/restore resource to quickly get a list of the resources that backedup / restored
