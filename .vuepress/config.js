module.exports = {
    title: 'Stakater Red Hat Openshift Documentation',
    description: 'Stakater Red Hat Openshift Documentation',
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
            },
            {
                title: 'Cloud Provider',
                children: [
                    '/content/sre/cloud-provider/azure'
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
                title: 'Monitoring',
                children: [
                    '/content/sre/monitoring/ingress-monitor-controller',
                    '/content/sre/monitoring/application-alerts'
                ]
            },
            {
                title: 'Application Workloads',
                children: [
                    '/content/sre/application/autoscaling.md'
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
                    '/content/sre/networking/routes',
                    '/content/sre/networking/route-sharding',
                    '/content/sre/networking/external-dns'
                ]
            },
            {
                title: 'Secrets Management',
                children: [
                    '/content/sre/secrets/introduction',
                    '/content/sre/secrets/sealed-secrets',
                    '/content/sre/secrets/vault'
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
            },
            {
                title: 'Support',
                children: [
                    '/content/sre/support/support'
                ]
            }
        ],
        repo: 'stakater/stakaterclouddocs',
        editLinks: true,
        editLinkText: 'Help us improve this page!'
    }
}
