```dockerfile
FROM maven:3.8.2-openjdk-11 as  builder

WORKDIR /usr/src/app

RUN mkdir -p dependencies/ \
    && touch dependencies/.dockerignore \
    && mkdir -p snapshot-dependencies/ \
    && touch snapshot-dependencies/.dockerignore \
    && mkdir -p spring-boot-loader/ \
    && touch spring-boot-loader/.dockerignore \
    && mkdir -p application/ \
    && touch application/.dockerignore

COPY pom.xml /usr/src/app
# NOTE we assume there's only 1 jar in the target dir
COPY target/*.jar target/app.jar

RUN java -Djarmode=layertools -jar target/app.jar extract

FROM registry.access.redhat.com/ubi8/openjdk-11
LABEL maintainer="Stakater"

# Environment variables
ENV LANG="C.utf8" LANGUAGE="C.utf8" LC_ALL="C.utf8"
ENV PROFILES="default,docker"
ENV JAVA_MAIN_CLASS="org.springframework.boot.loader.JarLauncher"
ENV JAVA_OPTS_APPEND="-Djava.security.egd=file:/dev/./urandom -Duser.timezone=UTC"
ENV JAVA_ARGS=""

ENV HOME=/deployments
USER root
RUN mkdir -p ${HOME} \
    && mkdir -p ${HOME}/log \
    && chgrp -R 0 ${HOME} ${HOME}/log \
    && chmod -R g=u ${HOME} ${HOME}/log

USER 1001

# Expose the following port(s)
EXPOSE 8443

WORKDIR $HOME

# Copy required files from build machine
COPY --from=builder /usr/src/app/dependencies/ $HOME/
COPY --from=builder /usr/src/app/snapshot-dependencies/ $HOME/
COPY --from=builder /usr/src/app/spring-boot-loader/ $HOME/
COPY --from=builder /usr/src/app/application/ $HOME/

VOLUME /tmp
VOLUME ${HOME}/log
```