const { nodeKind } = require('@distributedkube/consts');
const { getIngressParams } = require('../helpers/kubernetes-utils');

const gatewayService = ({ algorithmName }) => ({
    kind: 'Service',
    apiVersion: 'v1',
    metadata: {
        name: `service-gateway-${algorithmName}`,
        annotations: {
            'prometheus.io/scrape': 'true'
        },
        labels: {
            app: nodeKind.Gateway,
            group: 'distributedkube',
            core: 'true',
            type: nodeKind.Gateway,
            'algorithm-name': algorithmName,
        }
    },
    spec: {
        selector: {
            'algorithm-name': algorithmName,
            'metrics-group': 'workers',
            group: 'distributedkube'
        },
        ports: [
            {
                name: 'gateway',
                port: 80,
                targetPort: 3005
            }
        ]
    }
});

const gatewayIngress = ({ algorithmName, gatewayName }, { ingressHost, ingressPrefix = '', ingressUseRegex = false, ingressClass = 'nginx' } = {}) => {
    const { apiVersion, backend, pathType } = getIngressParams(`service-gateway-${algorithmName}`, 80);
    return ({
        apiVersion,
        kind: 'Ingress',
        metadata: {
            name: `ingress-gateway-${algorithmName}`,
            annotations: {
                'nginx.ingress.kubernetes.io/rewrite-target': ingressUseRegex ? '/$2' : '/',
                'nginx.ingress.kubernetes.io/ssl-redirect': 'false',
                'nginx.ingress.kubernetes.io/proxy-read-timeout': '50000',
                'nginx.ingress.kubernetes.io/proxy-body-size': '5000m',
                'kubernetes.io/ingress.class': ingressClass
            },
            labels: {
                app: `ingress-${nodeKind.Gateway}`,
                core: 'true',
                type: nodeKind.Gateway,
                'algorithm-name': algorithmName,
            }
        },
        spec: {
            rules: [
                {
                    http: {
                        paths: [{
                            path: ingressUseRegex ? `${ingressPrefix}/distributedkube/gateway/${gatewayName}(/|$)(.*)` : `${ingressPrefix}/distributedkube/gateway/${gatewayName}`,
                            backend,
                            pathType
                        }]
                    },
                    host: ingressHost || undefined
                }
            ]
        }
    });
};

module.exports = {
    gatewayService,
    gatewayIngress
};
