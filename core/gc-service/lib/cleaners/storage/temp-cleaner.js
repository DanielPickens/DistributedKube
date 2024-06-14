const storageManager = require('@distributedkube/storage-manager');
const BaseCleaner = require('./base-cleaner');

class TempCleaner extends BaseCleaner {
    async clean({ jobs }) {
        for (let jobId of jobs) { // eslint-disable-line
            const promiseArray = [];
            promiseArray.push(storageManager.distributedkube.delete({ jobId }));
            promiseArray.push(storageManager.distributedkubeMetadata.delete({ jobId }));
            promiseArray.push(storageManager.distributedkubeExecutions.delete({ jobId }));
            const results = await Promise.allSettled(promiseArray); // eslint-disable-line
            this._handleErrors(results);
        }
    }
}

module.exports = new TempCleaner();
