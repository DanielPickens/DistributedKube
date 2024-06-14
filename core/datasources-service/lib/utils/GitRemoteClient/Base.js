const Log = require('@distributedkube/logger');
class Base {
    constructor(config, rawRepositoryUrl, serviceName) {
        this.config = config;
        this.rawRepositoryUrl = rawRepositoryUrl;
        this.log = Log.GetLogFromContainer(serviceName);
    }
}

module.exports = Base;
