const Logger = require('@distributedkube/logger');
const { metrics, utils } = require('@distributedkube/metrics');
const { metricsNames, Components, jobStatus } = require('../consts');
const component = Components.CONSUMER;
let log;

class Metrics {
    init(options) {
        this._options = options;
        this.algorithmName = this._options.jobConsumer.job.type;
        log = Logger.GetLogFromContainer();
        this._register();
    }

    _register() {
        metrics.removeMeasure(metricsNames.worker_net);
        metrics.addTimeMeasure({
            name: metricsNames.worker_net,
            labels: ['pipeline_name', 'algorithm_name', 'jobId', 'status'],
            description: 'Algorithm runtime histogram',
            buckets: utils.arithmatcSequence(30, 0, 2)
                .concat(utils.geometricSequence(10, 56, 2, 1).slice(2)).map(i => i * 1000)
        });
        metrics.removeMeasure(metricsNames.worker_succeeded);
        metrics.addCounterMeasure({
            name: metricsNames.worker_succeeded,
            description: 'Number of times the algorithm has completed',
            labels: ['pipeline_name', 'algorithm_name', 'jobId'],
        });
        metrics.removeMeasure(metricsNames.worker_runtime);
        metrics.addSummary({
            name: metricsNames.worker_runtime,
            description: 'Algorithm runtime summary',
            labels: ['pipeline_name', 'algorithm_name', 'jobId', 'status'],
            percentiles: [0.5]
        });
        metrics.removeMeasure(metricsNames.worker_started);
        metrics.addCounterMeasure({
            name: metricsNames.worker_started,
            description: 'Number of times the algorithm has started',
            labels: ['pipeline_name', 'algorithm_name', 'jobId'],
        });
        metrics.removeMeasure(metricsNames.worker_failed);
        metrics.addCounterMeasure({
            name: metricsNames.worker_failed,
            description: 'Number of times the algorithm has failed',
            labels: ['pipeline_name', 'algorithm_name', 'jobId'],
        });
    }

    initMetrics(job) {
        const { pipelineName } = job.data;
        metrics.get(metricsNames.worker_started).inc({
            labelValues: {
                pipeline_name: pipelineName,
                algorithm_name: this.algorithmName,
                jobId: job.data.jobId
            }
        });
        metrics.get(metricsNames.worker_net).start({
            id: job.data.taskId,
            labelValues: {
                pipeline_name: pipelineName,
                algorithm_name: this.algorithmName,
                jobId: job.data.jobId
            }
        });
        metrics.get(metricsNames.worker_runtime).start({
            id: job.data.taskId,
            labelValues: {
                pipeline_name: pipelineName,
                algorithm_name: this.algorithmName,
                jobId: job.data.jobId
            }
        });
    }

    summarizeMetrics({ status, taskId, jobId, pipelineName }) {
        try {
            if (status === jobStatus.FAILED) {
                metrics.get(metricsNames.worker_failed).inc({
                    labelValues: {
                        pipeline_name: pipelineName,
                        algorithm_name: this.algorithmName,
                        jobId
                    }
                });
            }
            else if (status === jobStatus.SUCCEED) {
                metrics.get(metricsNames.worker_succeeded).inc({
                    labelValues: {
                        pipeline_name: pipelineName,
                        algorithm_name: this.algorithmName,
                        jobId
                    }
                });
            }
            metrics.get(metricsNames.worker_net).end({
                id: taskId,
                labelValues: {
                    pipeline_name: pipelineName,
                    jobId,
                    status
                }
            });
            metrics.get(metricsNames.worker_runtime).end({
                id: taskId,
                labelValues: {
                    pipeline_name: pipelineName,
                    jobId,
                    status
                }
            });
        }
        catch (err) {
            log.warning(`failed to report metrics:${jobId} task:${taskId}`, { component }, err);
        }
    }
}

module.exports = new Metrics();
