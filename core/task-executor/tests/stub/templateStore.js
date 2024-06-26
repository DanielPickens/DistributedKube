module.exports = [
    {
        name: 'eval-alg',
        algorithmImage: 'distributedkube/algorunner',
        cpu: 0.5,
        mem: '256Mi'
    },
    {
        name: 'green-alg',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 7,
        mem: '512Mi'
    },
    {
        name: 'yellow-alg',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 0.5,
        mem: '128Mi'
    },
    {
        name: 'black-alg',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 0.5,
        mem: '128Mi'
    },
    {
        name: 'max-cpu',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 25,
        mem: '128Mi'
    },
    {
        name: 'max-mem',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '50Gi'
    },
    {
        name: 'max-gpu',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '128Mi',
        gpu: 10
    },
    {
        name: 'big-cpu',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 8,
        mem: '128Mi'
    },
    {
        name: 'big-mem',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '37Gi'
    },
    {
        name: 'big-gpu',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '128Mi',
        gpu: 6
    },
    {
        name: 'node-selector',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '128Mi',
        nodeSelector: {
            type: 'cpu-extreme'
        }
    },
    {
        name: 'node-all-params',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 100,
        mem: '50Gi',
        gpu: 100,
        nodeSelector: {
            type: 'gpu-extreme',
            max: 'bound'
        }
    },
    {
        name: 'selector-multi-values',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '128Mi',
        gpu: 0,
        nodeSelector: {
            "kubernetes.io/hostname": ["node1", "node2", "node3"]
        }
    },
    {
        name: 'selector-multi-values-node4',
        algorithmImage: 'distributedkube/algorithm-example',
        cpu: 1,
        mem: '128Mi',
        gpu: 0,
        nodeSelector: {
            "kubernetes.io/hostname": ["node1", "node2", "node4"]
        }
    }
];
