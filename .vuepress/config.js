module.exports = {
    title: 'Stakater Agility Platform Documentation',
    description: 'Stakater Agility Platform Documentation',
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    plugins: [
        [
            '@vuepress/active-header-links',
            '@vuepress/medium-zoom',
            '@vuepress/back-to-top',
            'vuepress-plugin-container'
        ],
    ],
    markdown: {
        lineNumbers: true,
        anchor: { permalink: false },
        // options for markdown-it-toc
        toc: { includeLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    },
    themeConfig: {
        sidebar: [
            {
                title: 'Introduction',
                children: [
                    '/content/sre/introduction/introduction.md',
                    '/content/sre/introduction/why-sro.md',
                    '/content/sre/introduction/sro-overview.md',
                    '/content/sre/introduction/sro-features.md',                  
                    '/content/sre/introduction/sro-key-differentiators.md'                    
                ]
            },
            {
                title: 'Cloud Provider',
                children: [
                    '/content/sre/cloud-provider/azure.md',
                    '/content/sre/cloud-provider/aws.md', 
                    '/content/sre/cloud-provider/google.md',
                    '/content/sre/cloud-provider/binero.md'                    
                ]
            },
            {
                title: 'Application Dashboard',
                children: [
                    '/content/sre/forecastle/forecastle.md'
                ]
            },
            {
                title: 'GitOps',
                children: [
                    '/content/sre/gitops/introduction.md',                    
                    '/content/sre/gitops/github.md',
                    '/content/sre/gitops/gitlab.md',                    
                    '/content/sre/gitops/faqs.md'                    
                ]
            },
            {
                title: 'Authentication and Authorization',
                children: [
                    '/content/sre/authentication-authorization/google-idp.md',
                    '/content/sre/authentication-authorization/keycloak-idp.md'                    
                ]                
            },
            {
                title: 'Pipelines',
                children: [
                    '/content/sre/pipelines/introduction.md',
                    {
                        title: 'Tekton',
                        children: [
                            '/content/sre/pipelines/openshift-pipelines/openshift-pipelines.md',
                            '/content/sre/pipelines/openshift-pipelines/deploying-delivery-pipeline.md',
                            '/content/sre/pipelines/openshift-pipelines/deploying-cicd-pipeline.md'
                        ]
                    }
                ]
            },
            {
                title: 'Artifact Management',
                children: [
                    '/content/sre/registry/registry.md',
                    '/content/sre/registry/accessing-registry.md'
                ]
            },
            {
                title: 'Code Quality',
                children: [
                    '/content/sre/code-quality/sonarqube.md'
                ]
            },
            {
                title: 'Logging',
                children: [
                    '/content/sre/logging/logging.md'
                ]
            },                        
            {
                title: 'Monitoring',
                children: [
                    '/content/sre/monitoring/app-uptime.md',
                    '/content/sre/monitoring/app-alerts.md',
                    '/content/sre/monitoring/goldilocks.md',
                    '/content/sre/monitoring/kube-resource-report.md'
                ]
            },
            {
                title: 'Alerting',
                children: [
                    '/content/sre/alerting/downtime-notifications-uptimerobot.md',
                    '/content/sre/alerting/log-alerts.md'
                ]                
            },            
            {
                title: 'Autoscaling',
                children: [
                    '/content/sre/autoscaling/autoscaling.md'
                ]
            },
            {
                title: 'Backup & Restore',
                children: [
                    '/content/sre/backup-restore/backup-restore.md'
                ]
            },
            {
                title: 'Networking',
                children: [
                    '/content/sre/networking/routes.md',
                    '/content/sre/networking/route-sharding.md',
                    '/content/sre/networking/external-dns.md'
                ]
            },
            {
                title: 'Configs Management',
                children: [
                    '/content/sre/config-management/configmaps.md'
                ]
            },            
            {
                title: 'Secrets Management',
                children: [
                    '/content/sre/secrets/introduction.md',
                    '/content/sre/secrets/sealed-secrets.md',
                    '/content/sre/secrets/vault.md'
                ]
            },
            {
                title: 'Support',
                children: [
                    '/content/sre/support/support.md'
                ]
            },
            {
                title: 'Frequently Asked Questions',
                children: [
                    '/content/sre/faq/product.md',
                    '/content/sre/faq/operations.md',
                    '/content/sre/faq/purchasing.md',
                    '/content/sre/faq/customization.md',
                    '/content/sre/faq/developers.md'
                ]
            }            
        ],
        repo: 'stakater/stakaterclouddocs',
        editLinks: true,
        editLinkText: 'Help us improve this page!'
    }
}
