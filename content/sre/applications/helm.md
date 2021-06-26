# Helm

Helm is a package manager for Kubernetes (think apt or yum). It works by combining several manifests into a single package that is called a chart. Helm also supports chart storage in remote or local Helm repositories that function like package registries such as Maven Central, Ruby Gems, npm registry, etc.

Helm is currently the only solution that supports

- The grouping of related Kubernetes manifests in a single entity (the chart)
- Basic templating and value support for Kubernetes manifests
- Dependency declaration between applications (chart of charts)
- A registry of available applications to be deployed (Helm repository)
- A view of a Kubernetes cluster in the application/chart level
- Management of installation/upgrades of charts as a whole
- Built-in rollback of a chart to a previous version without running a CI/CD pipeline again

You can find a list of public curated charts in the [default](https://github.com/helm/charts/tree/master/stable) Helm repository.

## Charts and sub-charts

The most basic way to use Helm is by having a single chart that holds a single application. The single chart will contain all the resources needed by your application such as deployments, services, config-maps etc.

However, you can also create a chart with dependencies to other charts (a.k.a. umbrella chart) which are completely external using the requirements.yaml file. Using this strategy is optional and can work well in several organizations. Again, there is no definitive answer on right and wrong here, it depends on your team process.

