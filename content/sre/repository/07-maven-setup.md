## Maven Project setup with nexus-repository

### If you are using maven dependencies from nexus repository, make sure to do changes in settings.xml file in `.m2` folder. Below is the sample `settings.xml` file which you can use or refer to.


    <?xml version="1.0" encoding="UTF-8"?>
    <settings>
    <servers>
        <server>
        <id>nexus</id>
        <username>${env.NEXUS_USERNAME}</username>
        <password>${env.NEXUS_USERNAME}</password>
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

Before using this file, please make sure to provide values for env variables i.e. `NEXUS_USERNAME` , `NEXUS_USERNAME` and `MAVEN_MIRROR_URL`.

---