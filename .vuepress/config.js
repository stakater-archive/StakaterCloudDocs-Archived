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
                title: 'Application Dashboard',
                children: [
                    '/content/sre/forecastle/forecastle'
                ]
            },
            {
                title: 'Pipelines',
                children: [
                    '/content/sre/pipelines/introduction.md',
                    {
                        title: 'Jenkins',
                        children: [
                            '/content/sre/pipelines/jenkins/jenkins.md',
                            '/content/sre/pipelines/jenkins/jenkins-pipeline.md'
                        ]
                    },
                    {
                        title: 'Openshift Pipelines',
                        children: [
                            '/content/sre/pipelines/openshift-pipelines/openshift-pipelines.md',
                            '/content/sre/pipelines/openshift-pipelines/deploying-delivery-pipeline.md',
                            '/content/sre/pipelines/openshift-pipelines/deploying-cicd-pipeline.md'
                        ]
                    }
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
                    '/content/sre/monitoring/app-uptime',
                    '/content/sre/monitoring/app-alerts',
                    '/content/sre/monitoring/goldilocks',
                    '/content/sre/monitoring/kube-resource-report'
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
