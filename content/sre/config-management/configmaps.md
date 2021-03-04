# Creating and using configmaps

## Understanding ConfigMaps

Many applications require configuration using some combination of configuration files, command line arguments, and environment variables. In Stakater Agility Platform, these configuration artifacts are decoupled from image content in order to keep containerized applications portable.

The ConfigMap object provides mechanisms to inject containers with configuration data while keeping containers agnostic of Stakater Agility Platform. A config map can be used to store fine-grained information like individual properties or coarse-grained information like entire configuration files or JSON blobs.

The ConfigMap API object holds key-value pairs of configuration data that can be consumed in pods or used to store configuration data for system components such as controllers. For example:

```
kind: ConfigMap
apiVersion: v1
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data: # 1
  example.property.1: hello
  example.property.2: world
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
binaryData:
  bar: L3Jvb3QvMTAw # 2
```

(1) Contains the configuration data.
(2) Points to a file that contains non-UTF8 data, for example, a binary Java keystore file. Enter the file data in Base 64. You can use the binaryData field when you create a config map from a binary file, such as an image.

Configuration data can be consumed in pods in a variety of ways. A config map can be used to:

- Populate environment variable values in containers
- Set command-line arguments in a container
- Populate configuration files in a volume

Users and system components can store configuration data in a config map.

A config map is similar to a secret, but designed to more conveniently support working with strings that do not contain sensitive information.

## Config map restrictions

### A config map must be created before its contents can be consumed in pods.

- Controllers can be written to tolerate missing configuration data. Consult individual components configured by using config maps on a case-by-case basis.
- ConfigMap objects reside in a project.
- They can only be referenced by pods in the same project.

### The Kubelet only supports the use of a config map for pods it gets from the API server.

This includes any pods created by using the CLI, or indirectly from a replication controller. It does not include pods created by using the OpenShift Container Platform node’s --manifest-url flag, its --config flag, or its REST API because these are not common ways to create pods.

## Creating a config map

### Creating a config map from a directory

_TBD_

### Creating a ConfigMap from a file

_TBD_

### Creating a config map from literal values

_TBD_

## Use Cases: Consuming ConfigMaps in pods

### Populating environment variables in containers by using config maps

_TBD_

### Setting command-line arguments for container commands with ConfigMaps

_TBD_

### Injecting content into a volume by using config maps

_TBD_
