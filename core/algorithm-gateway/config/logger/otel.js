//add otel logging 

const { createLogger } = require('@opentelemetry/sdk-node');
const { LogLevel } = require('@opentelemetry/core');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

const provider = new NodeTracerProvider({
    logLevel: LogLevel.ERROR,
});

const traces = require('./traces');
traces.register();

provider.register();

module.exports = provider;

const logger = require('./logger');

module.exports = config;
const config = require('./config.base');



logger.info('TracerProvider initialized');

for (const key in process.env) {
    if (key.startsWith('OTEL_')) {
        logger.info(`${key}=${process.env[key]}`);
    }
}

const zipkinExporter = new ZipkinExporter({
    serviceName: 'algorithm-gateway',
    url: 'http://localhost:9411/api/v2/spans',
});
provider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));

const { createLogger } = require('@distributedkube/logger');
const logger = createLogger();

module.exports = logger;

// Path: core/algorithm-gateway/config/logger/config.base.js

const config = {};

config.transport = {
    console: true
};

config.console = {

    json: false,
    colors: false,
    format: 'wrapper::{level}::{message}',
    level: process.env.distributedkube_LOG_LEVEL
};

config.options = {
    throttle: {
        wait: 30000
    }
};



// module.exports = config;

// // Path: core/algorithm-gateway/config/logger/index.js

// const { createLogger } = require('@distributedkube/logger');
// const config = require('./config.base');

// const logger = createLogger(config);

// module.exports = logger;

// // Path: core/algorithm-gateway/config/logger/otel.js


