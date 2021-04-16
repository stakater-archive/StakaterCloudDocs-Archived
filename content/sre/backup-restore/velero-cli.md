# Velero CLI setup

For velero related tasks/sample. It's better to setup the velero CLI. It can perform various task against the velero server deployed on the cluster.

Download the appropraite release from here https://github.com/vmware-tanzu/velero/releases and then follow the steps:

Note: Below commands are linux specific

1. Open a command line and change directory to the Velero CLI download.
2. To unzip the download file:
    ~~~
    tar -xzf velero-<VERSION>-<PLATFORM>.tar.gz 
    cd velero-<VERSION>-<PLATFORM>/
    ~~~
3. To change the permissions and put the Velero CLI in the system path:
    ~~~
    chmod +x velero
    ~~~
4. To make the Velero CLI globally available, move the CLI to the system path:
    ~~~
    cp velero /usr/local/bin/velero
    ~~~
5. Verify the installation:
    ~~~
    velero version
    ~~~
    Should see something like:
    ```
    velero version

    Client:
        Version: v1.4.2
    ```
