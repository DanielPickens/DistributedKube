const clonedeep = require('lodash.clonedeep');
const log = require('@distributedkube/logger').GetLogFromContainer();
const { applyStorage, applyImagePullSecret } = require('@distributedkube/kubernetes-client').utils;
const { applyImage } = require('../helpers/kubernetes-utils');
const component = require('../consts/componentNames').K8S;
const { deploymentBoardTemplate, boardIngress, boardService } = require('../templates/optunaboard');
const CONTAINERS = require('../consts/containers');

const applyNodeSelector = (inputSpec, clusterOptions = {}) => {
    const spec = clonedeep(inputSpec);
    if (!clusterOptions.useNodeSelector) {
        delete spec.spec.template.spec.nodeSelector;
    }
    return spec;
};

const createKindsSpec = ({ id, boardReference, versions, registry, clusterOptions, options }) => {
    if (!boardReference) {
        const msg = 'Unable to create deployment spec. boardReference is required';
        log.error(msg, { component });
        throw new Error(msg);
    }
    const deployment = deploymentBoardTemplate(boardReference, id, clusterOptions?.ingressPrefix);
    let deploymentSpec = clonedeep(deployment);
    deploymentSpec = applyNodeSelector(deploymentSpec, clusterOptions);
    deploymentSpec = applyImage(deploymentSpec, CONTAINERS.OPTUNABOARD, versions, registry);
    deploymentSpec = applyStorage(deploymentSpec, options.defaultStorage, CONTAINERS.OPTUNABOARD, 'algorithm-operator-configmap');
    deploymentSpec = applyImagePullSecret(deploymentSpec, clusterOptions?.imagePullSecretName);

    const ingressSpec = boardIngress(boardReference, clusterOptions);
    const serviceSpec = boardService(boardReference);
    return {
        deploymentSpec,
        ingressSpec,
        serviceSpec
    };
};

module.exports = {
    createKindsSpec
};
