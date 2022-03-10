module.exports = {
  title: "Stakater App Agility Platform Documentation",
  description: "Stakater App Agility Platform Documentation",
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  plugins: [
    [
      "@vuepress/active-header-links",
      "@vuepress/medium-zoom",
      "@vuepress/back-to-top",
      "vuepress-plugin-container",
    ],
  ],
  markdown: {
    lineNumbers: true,
    anchor: { permalink: false },
    // options for markdown-it-toc
    toc: { includeLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  },
  themeConfig: {
    sidebar: [
      {
        title: "Introduction",
        children: [
          "/content/sre/introduction/introduction.md",
          "/content/sre/introduction/why-sro.md",
          "/content/sre/introduction/sro-overview.md",
          "/content/sre/introduction/sro-features.md",
          "/content/sre/introduction/sro-key-differentiators.md",
        ],
      },
      {
        title: "Managed AddOns",
        children: ["/content/sre/addons/introduction.md"],
      },
      {
        title: "Cloud Provider",
        children: [
          "/content/sre/cloud-provider/introduction.md",
          "/content/sre/cloud-provider/azure.md",
          "/content/sre/cloud-provider/aws.md",
          "/content/sre/cloud-provider/google.md",
          "/content/sre/cloud-provider/binero.md",
        ],
      },
      {
        title: "Applications",
        children: [
          "/content/sre/applications/cloud-native-app.md",
          "/content/sre/applications/helm.md",
          "/content/sre/forecastle/forecastle.md",
        ],
      },
      {
        title: "GitOps",
        children: [
          "/content/sre/gitops/introduction.md",
          "/content/sre/gitops/github.md",
          "/content/sre/gitops/gitlab.md",
          "/content/sre/gitops/bot-account.md",
          "/content/sre/gitops/structure.md",
          "/content/sre/gitops/environments.md",
          "/content/sre/gitops/faqs.md"
        ],
      },
      {
        title: "Onboarding",
        children: [
          "/content/sre/onboarding/tenant-onboarding.md",
          "/content/sre/onboarding/application-onboarding.md",
          "/content/sre/onboarding/environment-onboarding.md",
          "/content/sre/onboarding/cluster-onboarding.md",
          "/content/sre/onboarding/quota-onboarding.md",
          "/content/sre/onboarding/developer-training.md"
        ],
      },
      {
        title: "Authentication and Authorization",
        children: [
          "/content/sre/authentication-authorization/google-idp.md",
          "/content/sre/authentication-authorization/azure-idp.md",
          "/content/sre/authentication-authorization/keycloak-idp.md",
          "/content/sre/authentication-authorization/saml-idp.md",
          "/content/sre/authentication-authorization/saap-authorization-roles.md",
          "/content/sre/authentication-authorization/curated-list-operators.md"
        ],
      },
      {
        title: "Continuous Integration & Deployment (CI&CD)",
        children: [
          "/content/sre/pipelines/introduction.md"
        ],
      },
      {
        title: "ArgoCD",
        children: [
          "/content/sre/argocd/01-introduction.md"
        ],
      },
      {
        title: "Artifacts Management",
        children: [
          "/content/sre/repository/01-introduction.md",
          "/content/sre/repository/06-accessing-repository.md",
          "/content/sre/repository/03-permissions.md",
          "/content/sre/repository/04-routes.md",
           "/content/sre/repository/08-grant-nexus-admin-keycloak.md",
          "/content/sre/repository/05-FAQ.md"
        ],
      },
      {
        title: "Code Quality",
        children: [
          "/content/sre/code-quality/01-introduction.md",
          "/content/sre/code-quality/sonarqube-upgrade.md"
        ],
      },
      {
        title: "Logging",
        children: [
          "/content/sre/logging/logging.md",
          "/content/sre/logging/kibana-view-logs.md",
        ],
      },
      {
        title: "Monitoring",
        children: [
          "/content/sre/monitoring/01-introduction.md",
          "/content/sre/monitoring/02-maturity-model.md",
          "/content/sre/monitoring/app-uptime.md",
          "/content/sre/monitoring/app-alerts.md",
          "/content/sre/monitoring/goldilocks.md",
          "/content/sre/monitoring/kube-resource-report.md",
          "/content/sre/monitoring/grafana-dashboard.md",
        ],
      },
      {
        title: "Alerting",
        children: [
          "/content/sre/alerting/downtime-notifications-uptimerobot.md",
          "/content/sre/alerting/workload-application-alerts.md",
          "/content/sre/alerting/log-alerts.md",
          "/content/sre/alerting/predefined-prometheusrules.md"
        ],
      },
      {
        title: "Autoscaling",
        children: ["/content/sre/autoscaling/autoscaling.md"],
      },
      {
        title: "Storage",
        children: ["/content/sre/storage/volume-expander.md"],
      },
      {
        title: "Backup & Restore",
        children: [
          "/content/sre/backup-restore/01-introduction.md",
          "/content/sre/backup-restore/velero-cli.md",
          "/content/sre/backup-restore/backup-restore.md",
          "content/sre/backup-restore/troubleshoot.md",
          "content/sre/backup-restore/cleanup.md",
          "/content/sre/backup-restore/stateful-app-example.md",
          "/content/sre/backup-restore/restore-with-gitops.md",
          "/content/sre/backup-restore/02-limitations.md"
        ],
      },
      {
        title: "Networking",
        children: [
          "/content/sre/networking/routes.md",
          "/content/sre/networking/hosting-dns.md",
          "/content/sre/networking/external-dns.md",
        ],
      },
      {
        title: "Secrets Management",
        children: [
          "/content/sre/secrets/introduction.md",
          "/content/sre/secrets/sealed-secrets.md",
          "/content/sre/secrets/vault.md",
        ],
      },
      {
        title: "Local Development",
        children: [
          "/content/sre/local-development/inner-loop.md",
          "/content/sre/local-development/inner-vs-outer-loop.md",
          "/content/sre/local-development/local-development-workflow.md",
          "/content/sre/local-development/tilt/step-by-step-guide.md",
        ],
      },
      {
        title: "Security",
        children: ["/content/sre/security/policies/policies.md"],
      },
      {
        title: "Cluster Configuration",
        children: ["/content/sre/cluster-configuration/node-configuration.md"],
      },
      {
        title: "Support",
        children: ["/content/sre/support/support.md"],
      },
      {
        title: "Tenant-Operator",
        children: [
          "/content/sre/tenant-operator/overview.md",
          "/content/sre/tenant-operator/argocd.md",
          "/content/sre/tenant-operator/customresources.md",
          "/content/sre/tenant-operator/tenant_roles.md",
          "/content/sre/tenant-operator/installation.md",
          "/content/sre/tenant-operator/usecases/use-cases.md",
          "/content/sre/tenant-operator/integration-config.md",
          "/content/sre/tenant-operator/vault-authentication.md",
          "/content/sre/tenant-operator/faq.md",
          "/content/sre/tenant-operator/changelog.md",
        ],
      },
      {
        title: "External Secret Operator",
        children: [
          "/content/sre/external-secret-operator/introduction.md",
          "/content/sre/external-secret-operator/workflow.md",
          "/content/sre/external-secret-operator/getting-started.md",
        ],
      },
      {
         title:"Tronador",
         children: [
            "/content/sre/tronador/overview.md",
            "/content/sre/tronador/environment_provisioner.md",
            "/content/sre/tronador/config_file.md",
            "/content/sre/tronador/cluster_task.md",
         ]
      },
      {
        title: "Frequently Asked Questions",
        children: [
          "/content/sre/faq/product.md",
          "/content/sre/faq/operations.md",
          "/content/sre/faq/purchasing.md",
          "/content/sre/faq/customization.md",
          "/content/sre/faq/developers.md",
        ],
      },
      {
        title: "Release Notes",
        children: ["/content/sre/release-notes/release-notes.md"],
      },
    ],
    repo: "stakater/stakaterclouddocs",
    editLinks: true,
    editLinkText: "Help us improve this page!",
  },
};
