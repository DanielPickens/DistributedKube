const log = require('@distributedkube/logger').GetLogFromContainer();
const Metric = require('../Metric');
const queueUtils = require('../../utils/queue');
const component = require('../../consts/components').ALGORITHM_QUEUE;

class QueueFlatMetric extends Metric {
    constructor(options) {
        super(options);
    }

    calc(options) {
        const results = queueUtils.order(options.algorithms.queue);
        this._log(options.algorithms.queue);
        return results;
    }

    _log(queue) {
        const text = queue.map(q => `${q.data.length + q.pendingAmount} ${q.name}`).sort().join(', ');
        if (text && text !== this._state) {
            log.debug(`requested queue: ${text}`, { component });
            this._state = text;
        }
    }
}

module.exports = QueueFlatMetric;
