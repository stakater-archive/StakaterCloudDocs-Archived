module.exports = {
    title: 'Stakater Cloud Documentation',
    description: 'Stakater Cloud Documentation',
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
                    '/content/sre/introduction/introduction',
                    '/content/sre/introduction/why-sro',
                    '/content/sre/introduction/sro-overview',
                    '/content/sre/introduction/sro-features',                  
                    '/content/sre/introduction/sro-key-differentiators'                    
                ]
            },            {
                title: 'Backup & Restore',
                children: [
                    '/content/sre/backup-restore/backup-restore.md'
                ]
            },
            {
                title: 'Cloud Provider',
                children: [
                    '/content/sre/cloud-provider/azure'
                ]                
            },
            {
                title: 'Ingress Monitor Controller',
                children: [
                    '/content/sre/imc/ingress-monitor-controller.md'
                ]
            },
            {
                title: 'Networking',
                children: [
                    '/content/sre/networking/routes',
                    '/content/sre/networking/route-sharding',
                    '/content/sre/networking/external-dns'
                ]
            },
            {
                title: 'Pipelines',
                children: [
                    '/content/sre/openshift-pipelines/openshift-pipelines.md',
                    '/content/sre/openshift-pipelines/deploying-delivery-pipeline.md',
                    '/content/sre/openshift-pipelines/deploying-cicd-pipeline.md'
                ]
            },
            {
                title: 'Registry',
                children: [
                    '/content/sre/registry/registry.md',
                    '/content/sre/registry/accessing-registry.md'
                ]
            },
            {
                title: 'Application Monitoring',
                children: [
                    '/content/sre/application-monitoring/application-alerts.md'
                ]
            },
            {
                title: 'Sealed Secrets',
                children: [
                    '/content/sre/sealed-secrets/introduction',
                    '/content/sre/sealed-secrets/workshop',
                    '/content/sre/sealed-secrets/management',
                    '/content/sre/sealed-secrets/caveats'
                ]
            },
            {
                title: 'User Management',
                children: [
                    '/content/sre/user-management/giving-access-to-oauth-users'
                ]
            },
            {
                title: 'Vault',
                children: [
                    '/content/sre/vault/vault',
                    '/content/sre/vault/vault-setup',
                    '/content/sre/vault/vault-usage-example'
                ]
            },
            {
                title: 'Frequently Asked Questions',
                children: [
                    '/content/sre/faq/product',
                    '/content/sre/faq/operations',
                    '/content/sre/faq/purchasing',
                    '/content/sre/faq/customization',
                    '/content/sre/faq/developers'                    
                ]
            }
        ],
        repo: 'stakater/stakaterclouddocs',
        editLinks: true,
        editLinkText: 'Help us improve this page!'
    }
}
