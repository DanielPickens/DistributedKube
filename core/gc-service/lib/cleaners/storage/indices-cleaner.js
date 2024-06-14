const storageManager = require('@distributedkube/storage-manager');
const BaseCleaner = require('./base-cleaner');

class IndicesCleaner extends BaseCleaner {
    async clean({ indices }) {
        if (indices.length > 0) {
            const results = await Promise.allSettled(indices.map(date => storageManager.distributedkubeIndex.delete({ date })));
            this._handleErrors(results);
        }
    }
}

module.exports = new IndicesCleaner();
