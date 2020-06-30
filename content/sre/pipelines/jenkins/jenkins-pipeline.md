# Pipelines in Jenkins

Jenkins supports two types of pipelines:

1. Declarative pipeline
2. Scripted pipeline

## Declarative Pipeline

Declarative Pipeline provide a simplified and opinionated syntax on top of jenkins pipeline sub-systems. It supports the
 pipeline as code concept and makes the pipeline declarative hence easier to read, write and re-use.
 
### Example

```groovy
pipeline {
    agent none 
    stages {
        stage('Example Build') {
            agent { docker 'maven:3-alpine' } 
            steps {
                echo 'Hello, Maven'
                sh 'mvn --version'
            }
        }
        stage('Example Test') {
            agent { docker 'openjdk:8-jre' } 
            steps {
                echo 'Hello, JDK'
                sh 'java -version'
            }
        }
    }
}
```
 
## Scripted Pipeline

Scripted pipelines were designed more or less as general-purpose domain-specific language built with Groovy. It does not
 come with a fixed structure, and it is up to you how you will define your pipeline logic. The declarative pipeline, 
 on the other hand, is more opinionated, and its structure is well-defined. 
 
### Example
 
 ```groovy
node {
    stage('Example') {
        try {
            sh 'exit 1'
        }
        catch (exc) {
            echo 'Something failed, I should sound the klaxons!'
            throw
        }
    }
}
```

## Stakater Pipeline Library

We have been using jenkins at Stakater for a long time and one issue that we continuously face is how to make those pipelines
re-usable ? Since, most of the pipelines have same action items to perform. 

### Problem 
We often face situations where multiple projects were using the same CI/CD pipeline workflow(optionally with minor changes). 
This resulted in a lot of code duplication and redundant work when trying to update a functionality.

### Solution
We decided to extract out the reusable components from different Jenkinsfile into a pipeline library making it the single 
source of truth and using it for CI/CD workflows of all our applications.

### Usage Example

Pipeline Library makes pipelines declarative, re-usable, easy to understand and maintain. Following is a production ready
pipeline that we are using for a sample application [Stakater Nordmart Inventory](https://github.com/stakater-lab/stakater-nordmart-inventory) 
that we wrote as part of our [Nordmart](https://playbook.stakater.com/content/nordmart/nordmart-intro.html)
pool. 

```groovy
#!/usr/bin/env groovy
@Library('github.com/stakater/stakater-pipeline-library@v2.16.31') _

//Pipeline Steps:
// 1. Create version and generate new tag
// 2. Build application based on `appType` and `goal` using `builderImage`
// 3. Run e2e tests
// 4. Build & push image to `dockerRepositoryURL/appName`
// 5. Generate/Update manifests based on any changes in the templates, that can be deployed on kubernetes
// 6. Notify on slack regarding the build status, if `notifySlack` is true

releaseApplication {
    appName = "inventory"
    appType = "maven"
    builderImage = "stakater/builder-maven:3.5.4-jdk1.8-apline8-v0.0.3"
    goal = "clean package"
    notifySlack = true
    runIntegrationTest = true
    gitUser = "stakater-user"
    gitEmail = "stakater@gmail.com"
    usePersonalAccessToken = true
    tokenCredentialID = 'GithubToken'
    serviceAccount = "jenkins"
    dockerRepositoryURL = 'docker-delivery.stakater.com:443'
    // configuration parameter for e2e tess
    e2eTestJob = false
    e2eJobName = "../stakater-nordmart-e2e-tests/master"
    // configuration for generating kubernetes manifests
    kubernetesGenerateManifests = true
    kubernetesPublicChartRepositoryURL = "https://stakater.github.io/stakater-charts"
    kubernetesChartName = "stakater/application"
    kubernetesChartVersion = "0.0.13"
    kubernetesNamespace = "NAMESPACE_NAME"
    commitToManifestsRepo = true
}
```

For usage details and more features refer to [stakater-pipeline-library](https://github.com/stakater/stakater-pipeline-library/tree/master/docs)

## Useful Resources

- [Stakater Pipeline Library](https://github.com/stakater/stakater-pipeline-library)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Declarative vs Scripted Pipeline](https://www.jenkins.io/doc/book/pipeline/#declarative-versus-scripted-pipeline-syntax)
- [GitOps with Jenkins](https://medium.com/stakater/gitops-for-kubernetes-with-jenkins-7db6304216e0)