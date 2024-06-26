const packageJson = require(process.cwd() + '/package.json');
const formatter = require('../../lib/helpers/formatters');
const config = module.exports = {};

const useSentinel = !!process.env.REDIS_SENTINEL_SERVICE_HOST;
config.serviceName = packageJson.name;
config.version = packageJson.version;
config.intervalMs = process.env.INTERVAL_MS || 10000;
config.boardsIntervalMs = process.env.BOARDS_INTERVAL_MS || 2000;
config.boardTimeOut = formatter.parseInt(process.env.BOARDS_TIMEOUT, 3 * 60 * 60) * 1000;
config.defaultStorage = process.env.DEFAULT_STORAGE || 's3';
config.buildMode = process.env.BUILD_MODE || 'kaniko';
config.isDevMode = formatter.parseBool(process.env.DEV_MODE, false);

config.algorithmQueueBalancer = {
    limit: formatter.parseInt(process.env.ALGORITHM_QUEUE_CONCURRENCY_LIMIT, 5),
    maxIdleTime: formatter.parseInt(process.env.ALGORITHM_QUEUE_MAX_IDLE_TIME, 5 * 60 * 60 * 1000),
};

config.JobsMessageQueue = {
    enableCheckStalledJobs: false,
    prefix: 'algorithm-queue',
};

config.redis = {
    host: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_HOST : process.env.REDIS_SERVICE_HOST || 'localhost',
    port: useSentinel ? process.env.REDIS_SENTINEL_SERVICE_PORT : process.env.REDIS_SERVICE_PORT || 6379,
    sentinel: useSentinel,
};

config.driversSetting = {
    name: 'pipeline-driver',
    concurrency: formatter.parseInt(process.env.PIPELINE_DRIVERS_CONCURRENCY_LIMIT, 5),
    minAmount: formatter.parseInt(process.env.PIPELINE_DRIVERS_AMOUNT, 5),
    scalePercent: parseFloat(process.env.PIPELINE_DRIVERS_SCALE_PERCENT || 0.5),
    reconcileInterval: formatter.parseInt(process.env.PIPELINE_DRIVERS_RECONCILE_INTERVAL, 5000)
};

config.db = {
    provider: 'mongo',
    mongo: {
        auth: {
            user: process.env.MONGODB_SERVICE_USER_NAME || 'tester',
            password: process.env.MONGODB_SERVICE_PASSWORD || 'password',
        },
        host: process.env.MONGODB_SERVICE_HOST || 'localhost',
        port: formatter.parseInt(process.env.MONGODB_SERVICE_PORT, 27017),
        dbName: process.env.MONGODB_DB_NAME || 'distributedkube',
    }
};

config.etcd = {
    protocol: 'http',
    host: process.env.ETCD_CLIENT_SERVICE_HOST || '127.0.0.1',
    port: process.env.ETCD_CLIENT_SERVICE_PORT || 4001,
    serviceName: config.serviceName
};

config.kubernetes = {
    isLocal: !!process.env.KUBERNETES_SERVICE_HOST,
    namespace: process.env.NAMESPACE || 'default',
    isPrivileged: formatter.parseBool(process.env.IS_PRIVILEGED, true),
    version: '1.9'
};

config.jaeger = {
    host: process.env.JAEGER_AGENT_SERVICE_HOST,
}

config.resources = {
    algorithmQueue: {
        memory: parseFloat(process.env.ALGORITHM_QUEUE_MEMORY) || 256,
        cpu: parseFloat(process.env.ALGORITHM_QUEUE_CPU) || 0.1
    },
    algorithmBuilderMain: {
        memory: parseFloat(process.env.ALGORITHM_BUILDER_MAIN_MEMORY) || 256,
        cpu: parseFloat(process.env.ALGORITHM_BUILDER_MAIN_CPU) || 0.1,
    },
    algorithmBuilderBuilder: {
        memory: parseFloat(process.env.ALGORITHM_BUILDER_BUILDER_MEMORY) || 256,
        cpu: parseFloat(process.env.ALGORITHM_BUILDER_BUILDER_CPU) || 1
    },
    enable: formatter.parseBool(process.env.RESOURCES_ENABLE, false),
    useResourceLimits: formatter.parseBool(process.env.USE_RESOURCE_LIMITS, false),
};

config.healthchecks = {
    path: process.env.HEALTHCHECK_PATH || '/healthz',
    port: process.env.HEALTHCHECK_PORT || '5000',
    maxDiff: process.env.HEALTHCHECK_MAX_DIFF || '30000',
    logExternalRequests: formatter.parseBool(process.env.LOG_EXTERNAL_REQUESTS, true)
};
