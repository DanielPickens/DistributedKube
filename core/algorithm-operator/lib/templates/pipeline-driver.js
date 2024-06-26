const template = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
        name: 'job-name',
        labels: {
            type: 'pipeline-driver',
            group: 'distributedkube',
            core: 'true',
            'metrics-group': 'pipeline-drivers'
        }
    },
    spec: {
        template: {
            metadata: {
                labels: {
                    group: 'distributedkube',
                    type: 'pipeline-driver',
                    'metrics-group': 'pipeline-drivers'
                }
            },
            spec: {
                serviceAccountName: 'pipeline-driver-serviceaccount',
                containers: [
                    {
                        name: 'pipeline-driver',
                        image: 'distributedkube/pipeline-driver',
                        env: [
                            {
                                name: 'NODE_ENV',
                                value: 'production'
                            },
                            {
                                name: 'METRICS_PORT',
                                value: '3001'
                            },
                            {
                                name: 'INACTIVE_PAUSED_TIMEOUT_MS',
                                value: '60000'
                            },
                            {
                                name: 'POD_ID',
                                valueFrom: {
                                    fieldRef: {
                                        fieldPath: 'metadata.uid'
                                    }
                                }
                            },
                            {
                                name: 'POD_NAME',
                                valueFrom: {
                                    fieldRef: {
                                        fieldPath: 'metadata.name'
                                    }
                                }
                            },
                            {
                                name: 'CONCURRENCY_LIMIT',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'algorithm-operator-configmap',
                                        key: 'PIPELINE_DRIVERS_CONCURRENCY_LIMIT'
                                    }
                                }
                            },
                            {
                                name: 'DEFAULT_STORAGE',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'algorithm-operator-configmap',
                                        key: 'DEFAULT_STORAGE'
                                    }
                                }
                            },
                            {
                                name: 'STORAGE_ENCODING',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'algorithm-operator-configmap',
                                        key: 'STORAGE_ENCODING'
                                    }
                                }
                            },
                            {
                                name: 'STORAGE_RESULTS_THRESHOLD',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'pipeline-driver-configmap',
                                        key: 'STORAGE_RESULTS_THRESHOLD'
                                    }
                                }
                            },
                            {
                                name: 'STATUS_DELAY_MS',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'pipeline-driver-configmap',
                                        key: 'STATUS_DELAY_MS'
                                    }
                                }
                            },
                            {
                                name: 'CLUSTER_NAME',
                                valueFrom: {
                                    configMapKeyRef: {
                                        name: 'algorithm-operator-configmap',
                                        key: 'CLUSTER_NAME'
                                    }
                                }
                            },
                            {
                                name: 'MONGODB_SERVICE_USER_NAME',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: 'mongodb-secret',
                                        key: 'mongodb-username'
                                    }
                                }
                            },
                            {
                                name: 'MONGODB_SERVICE_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: 'mongodb-secret',
                                        key: 'mongodb-password'
                                    }
                                }
                            },
                            {
                                name: 'MONGODB_DB_NAME',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: 'mongodb-secret',
                                        key: 'mongodb-database'
                                    }
                                }
                            }
                        ],
                    }
                ],
                restartPolicy: 'Never'
            }
        },
        backoffLimit: 0
    }
};

module.exports = template;
