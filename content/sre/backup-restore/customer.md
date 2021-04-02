# Customer backups

There are 3 default backup schedules for customers that are deployed with offered velero tool

| Schedule                       | Backup Frequency |   Backup Retention   | Backup Scope |
| -------------------------- | ---------------- | -------------------- | ---------------- |
| Daily Customer Workload Backup | Every 24 hrs |   Last 7 Backup(s) | Objects + PV Snapshots |
| Hourly Full Cluster Object Backup | Every hour | Last 24 Backup(s) | Objects |
| Weekly Full Backup | Once Every week | Last 4 Backup(s)   | Objects + PV Snapshots |