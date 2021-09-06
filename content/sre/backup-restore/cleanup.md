# Cleanup

For cleaning up velero resources, deleting them directly from cluster is not recommended.

1. To delete a backup, use command:

    ```bash
        velero delete backup <backup-name> -n <velero-namespace>
    ```

    This will delete all the associated resources with the backup

## Notes

1. If you accidently delete the backup resource directly. Make sure that you delete the backup file from your cloud bucket, which should be the same name as your backup and also delete the volume snapshots associated to this backup (if any)

2. If you accidently delete the backup file from your cloud bucket, then you might not be able to delete the backup using velero command. In that case just delete the backup resource from cluster directly.
