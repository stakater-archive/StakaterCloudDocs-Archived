## Maven Project setup with nexus-repository
If you are using maven dependencies from nexus repository, make sure to do changes in settings.xml file in `.m2` folder. Below is the sample `settings.xml` file which you can use or refer to.

    <?xml version="1.0" encoding="UTF-8"?>
    <settings>
    <servers>
        <server>
        <id>nexus</id>
        <username>${env.NEXUS_USERNAME}</username>
        <password>${env.NEXUS_PASSWORD}</password>
        </server>
    </servers>
    <mirrors>
        <mirror>
        <id>nexus</id>
        <url>${env.MAVEN_MIRROR_URL}</url>
        <mirrorOf>*</mirrorOf>
        </mirror>
    </mirrors>
    <profiles>
        <profile>
        <id>nexus</id>
        <!--Enable snapshots for the built in central repo to direct -->
        <!--all requests to nexus via the mirror -->
        <repositories>
            <repository>
            <id>central</id>
            <url>http://central</url>
            <releases><enabled>true</enabled></releases>
            <snapshots><enabled>true</enabled></snapshots>
            </repository>
        </repositories>
        <pluginRepositories>
            <pluginRepository>
            <id>central</id>
            <url>http://central</url>
            <releases><enabled>true</enabled></releases>
            <snapshots><enabled>true</enabled></snapshots>
            </pluginRepository>
        </pluginRepositories>
        </profile>
    </profiles>
    <activeProfiles>
        <!--make the profile active all the time -->
        <activeProfile>nexus</activeProfile>
    </activeProfiles>
    </settings>
---
**NOTE**

Before using this file, please make sure to provide values for env variables i.e. `NEXUS_USERNAME` , `NEXUS_PASSWORD` and `MAVEN_MIRROR_URL`.
On Mac or Linux, one can set these environment values in `.bashrc` or `.bash_profile`. These files live under user's home directory. Use `cd ~` to navigate to home directory. If file is missing, you can create it. Follow below steps to add the environment values:

Open `.bashrc` or `.bash_profile` file. Paste below lines and set your actual environment values. You can find the credentials from Stakater Vault app. In my case, i am able to find it on this path in Vault: `secrets/managed-addons/nexus`
```
export NEXUS_USERNAME=username
export NEXUS_PASSWORD=password
export MAVEN_MIRROR_URL=URL
```
Save and exit the file. Run below command.
```
source ~/.bash_profile
```
- you can start using maven commands now. If it does not work, try restarting the terminal once.
- Read more about `.bashrc` and `.bash_profile` online if you want to decide between the two.
---