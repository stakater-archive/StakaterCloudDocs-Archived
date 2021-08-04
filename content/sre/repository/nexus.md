# Nexus

## Introduction

[Nexus](https://www.sonatype.com/products/repository-pro) is a repository manager that can store and manage components, build artifacts, and release candidates in one central location. It can host multiple type of repositories like docker, helm, maven and more.

## Customer nexus endpoints and their purpose

| URL | Name | Purpose |
|---|---|---|
| <span>https:</span>//nexus-openshift-stakater-nexus.apps.<...>.kubeapp.cloud | Nexus base url for web view. | A dashboard where you can view all the repositories and settings. |
| <span>https:</span>//nexus-docker-openshift-stakater-nexus.<...>.kubeapp.cloud | Nexus docker repository endpoint. | It points toward the docker repository in nexus, used to pull and push images. |
| <span>https:</span>//nexus-docker-proxy-openshift-stakater-nexus.<...>.kubeapp.cloud | Nexus docker repository proxy. | This is a proxy url that points towards dockerhub, used to pull images from dockerhub. |
| <span>https:</span>//nexus-helm-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/helm-charts/ | Nexus helm repository. | This is the nexus helm repository endpoint, used to pull and push helm charts. |
| <span>https:</span>//nexus-repository-openshift-stakater-nexus.<...>.kubeapp.cloud/repository/ | Nexus maven repository. | This is the nexus maven repository endpoint, used for maven apps. |

We also support whitelisting for these endpoints. Please contact support if you want to enable whitelisting for specific IPs.

