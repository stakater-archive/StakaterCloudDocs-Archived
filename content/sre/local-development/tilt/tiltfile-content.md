```bash
# VERY IMPORTANT NOTES:
# 1. This Tiltfile is for a Java project and same Tiltfile can't be used for all sorts of application; some tweaks are required - this Tiltfile is being used for this Java based application: https://github.com/stakater-lab/stakater-nordmart-review
# 2. The Dockerfile must have a specific structure for this Tiltfile to work - for reference look this Dockerfile

# For more on Extensions, see: https://docs.tilt.dev/extensions.html
load('ext://restart_process', 'docker_build_with_restart')

settings = read_json('tilt_options.json', default={})

if settings.get("namespace"):
  namespace =  settings.get("namespace")

if settings.get("default_registry"):
  default_registry(settings.get("default_registry").format(namespace), host_from_cluster='image-registry.openshift-image-registry.svc:5000/{}'.format(namespace))

if settings.get("allow_k8s_contexts"):
  allow_k8s_contexts(settings.get("allow_k8s_contexts"))

# Watch source code and on change rebuild artifacts and place in target folder
local_resource(
  'compile',
  'mvn package && ' +
  ########################################################################################
  # TODO: Update this to match what your pom file produces application-v1-2.0-SNAPSHOT.jar
  ########################################################################################
  'java -Djarmode=layertools -jar target/application-v1-2.0-SNAPSHOT.jar extract --destination target/jar-extracted && ' +
  'rsync --delete --inplace --checksum -r target/jar-extracted/ target/jar',
  deps=['src', 'pom.xml'])

# Keeps the docker image updated
docker_build_with_restart(
  #############################################
  # TODO: Update to match your application name
  #############################################
  'stakater/application-v1',
  '.',
  entrypoint=['java', 'org.springframework.boot.loader.JarLauncher'],
  #########################################################
  # NOTE: Remember Dockerfile must have a particular format
  #########################################################  
  dockerfile='./Dockerfile',
  live_update=[
    sync('./target/jar/dependencies', '/opt/app'),
    sync('./target/jar/spring-boot-loader', '/opt/app'),
    sync('./target/jar/snapshot-dependencies', '/opt/app'),
    sync('./target/jar/application', '/opt/app'),
  ])

yaml = helm('./deploy/', namespace=namespace, values=['./tilt/values-local.yaml'])

k8s_yaml(yaml)

#######################################################################
# NOTE: These are application dependent; so, you will need to update it
#######################################################################
k8s_resource('review-mongodb', port_forwards=['27017:27017'])
k8s_resource('application-v1', port_forwards=['9000:8443'], resource_deps=['compile'])
```