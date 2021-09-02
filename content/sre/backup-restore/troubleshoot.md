# Troubleshooting

Following commands are very handy when troubleshooting backup and restore operations:

1. Checking logs for a backup or restore resource:
   - Backup logs

    ```bash
    velero backup logs <backup-name> -n <velero-namespace>
    ```

   - Restore logs

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
