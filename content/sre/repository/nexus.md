# Nexus

## Introduction

[Nexus](https://www.sonatype.com/products/repository-pro) is a repository manager that can store and manage components, build artifacts, and release candidates in one central location. It can host multiple type of repositories like docker, helm, maven and more.

## Customer nexus endpoints and their purpose

| URL | Name | Purpose |
|---|---|---|
| https://nexus-openshift-stakater-nexus.apps.<...>.kubeapp.cloud | Nexus base url for web view. | A dashboard where you can view all the repositories and settings. |
| https://nexus-docker-openshift-stakater-nexus.<...>.kubeapp.cloud | Nexus docker repository endpoint. | It points toward the docker repository in nexus, used to pull and push images. |
| https://nexus-docker-proxy-openshift-stakater-nexus.<...>.kubeapp.cloud | Nexus docker repository proxy. | This is a proxy url that points towards dockerhub, used to pull images from dockerhub. |
| https://nexus-helm-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/helm-charts/ | Nexus helm repository. | This is the nexus helm repository endpoint, used to pull and push helm charts. |
| https://nexus-repository-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/ | Nexus maven repository. | This is the nexus maven repository endpoint, used for maven apps. |


We also support whitelisting for these endpoints. Please contact support if you want to enable whitelisting for specific IPs.

## Registering

Visit the nexus web view url [https://nexus-openshift-stakater-nexus.apps.<...>.kubeapp.cloud](_blank) which can be found on your forcastle. For the first time it will ask you for `username` and `email`. Please note that you should use the correct email address there, the one registered with stakater. If you happen to register with wrong `email` address and get locked out. Please contact stakater for resolution.
