# Nexus

## Introduction

[Nexus](https://www.sonatype.com/products/repository-pro) is a repository manager that can store and manage components, build artifacts, and release candidates in one central location. It can host multiple type of repositories like docker, helm, maven and more.

## Customer nexus endpoints and their purpose

1. **https://nexus-openshift-stakater-nexus.apps.<...>.kubeapp.cloud**

    Nexus base url for web view. A dashboard where you can view all the repositories and settings.

2. **https://nexus-docker-openshift-stakater-nexus.<...>.kubeapp.cloud**

    Nexus docker repository endpoint. It points toward the docker repository in nexus, used to pull and push images.

3. **https://nexus-docker-proxy-openshift-stakater-nexus.<...>.kubeapp.cloud**

    Nexus docker repository proxy. This is a proxy url that points towards dockerhub, used to pull images from dockerhub.

4. **https://nexus-helm-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/helm-charts/**

    Nexus helm repository. This is the nexus helm repository endpoint, used to pull and push helm charts.

5. **https://nexus-repository-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/**

    Nexus maven repository. This is the nexus maven repository endpoint, used for maven apps.
