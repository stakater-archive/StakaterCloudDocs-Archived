# 1. Pre-Requisistes

This section provides the pre-requisite steps for this workshop

[[toc]]

## 1.1 Fork Repository

::: details Go to the following URL and fork the repo

[Stakater-nordmart-inventory Repository](https://github.com/stakater-lab/stakater-nordmart-inventory) 

![repo-fork](./images/fork-repo.png)
:::

## 1.2 Create Personal Access Token

A Personal Access Token would be required to perform steps in a Tekton Pipeline

::: details Login to your Gihub account and generate a Personal Access Token via this follwoing URL:

`https://github.com/settings/tokens/new`

Access needed for the token are:
- `repo`
- `admin:repo_hook`

![token1](./images/token-access.png)
:::

## 1.3 Deploy Inventory Microservice

Save the manifest, will be used going forward, and deploy inventory microservice in your namespace

::: details 1.3.1 Download Manifest

[Inventory Manifest](https://raw.githubusercontent.com/stakater-lab/stakater-nordmart-inventory/master/deployment/manifests/application/inventory.yaml) 
:::

::: details 1.3.2 Apply Manifest
```bash
 kubectl apply -f simple-taskrun-example.yaml -n <NAMESPACE_NAME>
```
:::
