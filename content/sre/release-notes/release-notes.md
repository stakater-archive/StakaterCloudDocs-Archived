# Release Notes

Below is a monthly report published alongside new or updated software that details the technical features of the Stakater App Agility Platform. For new releases, these notes provide end-users with a brief summary of the features. For updates to existing products, the notes educate end-users on how the new version of the software improves upon the former.

## February2022

### Nexus urls updated

As part of re-organizing our add-on tools chain we updated nexus URLs.


| Updated Urls                                                         |
|----------------------------------------------------------------------|
| `https://nexus-stakater-nexus.apps.<BASE_DOMAIN>`                    |
| `https://nexus-docker-stakater-nexus.apps.<BASE_DOMAIN>`             |
| `https://nexus-docker-proxy-stakater-nexus.apps.<BASE_DOMAIN>  `     |
| `https://nexus-helm-stakater-nexus.apps.<BASE_DOMAIN>/repository/helm-charts/` |
| `https://nexus-repository-stakater-nexus.apps.<BASE_DOMAIN>/repository/` |
| `https://nexus-stakater-nexus.apps.<BASE_DOMAIN>`                    |


Following updates required to be done on workflows

- Re-seal dockerconfigjson secret with updated repository url
- Respective helm and docker urls were to be updated in pipelines and code repositories
- nexus-docker-config-forked fqdns were updated
- managed-addons/nexus/docker secret updated in vault