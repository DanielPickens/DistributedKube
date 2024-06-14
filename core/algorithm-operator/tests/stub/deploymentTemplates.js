const algorithmQueueTemplate = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
        name: 'algorithm-queue-algorithm-name',
        labels: {
            type: 'algorithm-queue',
            app: 'algorithm-queue-algorithm-name',
            group: 'distributedkube',
            core: 'true'
        }
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: {
                app: 'algorithm-queue-algorithm-name'
            }
        },
        template: {
            metadata: {
                labels: {
                    app: 'algorithm-queue-algorithm-name',
                    group: 'distributedkube'
                }
            },
            spec: {
                nodeSelector: {
                    core: 'true'
                },
                containers: [
                    {
                        name: 'algorithm-queue',
                        image: 'distributedkube/algorithm-queue:latest',
                        ports: [
                            {
                                containerPort: 3000
                            }
                        ],
                        env: [
                            {
                                name: 'ALGORITHM_TYPE',
                                value: 'algorithm-name'
                            },
                            {
                                name: 'NODE_ENV',
                                value: 'kube'
                            },
                            {
                                name: 'METRICS_PORT',
                                value: '3000'
                            }
                        ]
                    }
                ]
            }
        }
    }
}

module.exports = {
    algorithmQueueTemplate
}