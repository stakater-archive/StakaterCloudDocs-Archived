# Changelog

## v0.0.7

### Changes

- fix: deletion handled for helm release object created by Tronador

## v0.0.6

### Changes

- fix: fix name for generated helm release to conform to kubernetes resource name standards

## v0.0.5

### Changes

- fix: fix a permission issue in rolebinding

## v0.0.4

### Changes

- feat: added ability to set labels for the provisioned namespace

## v0.0.3

### Changes

- refactor: remove git auth and TronadorConfig object
- refactor: remove unused dependencies
- fix: Application and HelmRelease are now required fields for EnvironmentProvisioner
- fix: HelmRelease creation and updation
- feat: added more error handling

## v0.0.2

### Changes

- fix: fix leader election role in chart

## v0.0.1

### Changes

- initial release
