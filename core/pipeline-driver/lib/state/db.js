const dbConnect = require('@distributedkube/db');
const log = require('@distributedkube/logger').GetLogFromContainer();
const component = require('../consts/componentNames').STATE_MANAGER;

class DB {
    async init(options) {
        const { provider, ...config } = options.db;
        this._db = dbConnect(config, provider);
        await this._db.init();
        this._wrapJobsService();
        this._exitOnDBProblemBinded = this._exitOnDBProblem.bind(this);
        log.info(`initialized mongo with options: ${JSON.stringify(this._db.config)}`, { component });
    }

    _exitOnDBProblem(error) {
        if (this._db.isFatal(error)) {
            log.error(`db problem + ${error}`, { component }, error);
            process.exit(1);
        }
        return error;
    }

    async updatePdIntervalTimestamp(jobId) {
        await this._db.jobs.updatePdIntervalTimestamp(jobId);
    }

    async updateResult(options) {
        return this._db.jobs.updateResult(options);
    }

    async updateStatus(options) {
        return this._db.jobs.updateStatus(options);
    }

    async fetchStatus(options) {
        return this._db.jobs.fetchStatus(options);
    }

    async fetchPipeline(options) {
        return this._db.jobs.fetchPipeline(options);
    }

    async updatePipeline(options) {
        return this._db.jobs.updatePipeline(options);
    }

    async createJob({ jobId, pipeline, status }) {
        await this._db.jobs.create({ jobId, pipeline, status });
    }

    async getAlgorithmsByName(name) {
        return this._db.algorithms.fetch({ name });
    }

    _wrapJobsService() {
        ['updateResult', 'updateStatus', 'fetchStatus', 'fetchPipeline', 'updatePipeline', 'createJob', 'updatePdIntervalTimestamp'].forEach(propertyName => {
            if (typeof this._db.jobs[propertyName] === 'function') {
                this[propertyName] = this._wrapperForDBProblem(this[propertyName]);
            }
        });
    }

    _wrapperForDBProblem(fn) {
        // eslint-disable-next-line func-names
        const bfn = fn.bind(this);
        if (bfn.constructor.name === 'AsyncFunction') {
            return async (...args) => {
                try {
                    const result = await bfn(...args);
                    return result;
                }
                catch (ex) {
                    this._exitOnDBProblemBinded(ex);
                    throw ex;
                }
            };
        }
        return (...args) => {
            try {
                const result = bfn(...args);
                return result;
            }
            catch (ex) {
                this._exitOnDBProblemBinded(ex);
                throw ex;
            }
        };
    }
}

module.exports = new DB();
