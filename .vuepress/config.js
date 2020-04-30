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
                title: 'Vault',
                children: [
                    '/content/sre/vault/vault',
                    '/content/sre/vault/vault-setup',
                    '/content/sre/vault/vault-usage-example'
                ]
            },
            {
                title: 'Openshift Pipelines',
                children: [
                    '/content/sre/openshift-pipelines/openshift-pipelines.md',
                    '/content/sre/openshift-pipelines/deploying-delivery-pipeline.md',
                    '/content/sre/openshift-pipelines/deploying-cicd-pipeline.md'
                ]
            }
        ],
        repo: 'stakater/stakaterclouddocs',
        editLinks: true,
        editLinkText: 'Help us improve this page!'
    }
}
