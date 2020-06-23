# Introduction

A container image registry is a service that stores container images. For registry, at Stakater Cloud, we leverage on 
`Openshift Image Registry` which is a cloud-native internal registry that is used to store container images.
Your cluster is set up with the internal OpenShift Container Registry so that OpenShift can automatically build, deploy, 
and manage your application lifecycle from within the cluster.

Images are stored in Custom Resource `Imagestream` and you can view it's details by:

`oc describe Imagestream <image-name>`

## Usage

For CI/CD `openshift-pipelines` are the recommended approach since they are cloud-native, declarative and faster, along 
with other benefits. For integration of `openshift image registry` with `openshift pipelines` kindly go through the documenation
of `Pipelines` and `Deploying Delivery Pipeline` document.

They are fully compatible with other CI/CD tools as well and can be configured based on how they are being accessed.