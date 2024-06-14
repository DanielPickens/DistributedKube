const storageManager = require('@distributedkube/storage-manager');
const BaseCleaner = require('./base-cleaner');
const { isTimeBefore } = require('../../utils/time');

class BuildsCleaner extends BaseCleaner {
    async clean({ builds }) {
        if (builds.length > 0) {
            const results = await Promise.allSettled(builds.map(b => storageManager.storage.delete({ path: b.path })));
            this._handleErrors(results);
        }
    }

    async getBuildsToDelete({ maxAge }) {
        const buildsPath = storageManager.distributedkubeBuilds.createPath({ buildId: '' });
        const buildsFiles = await storageManager.distributedkubeBuilds.listWithStats({ path: buildsPath });
        const builds = buildsFiles.filter(b => isTimeBefore(b.mtime, maxAge));
        return builds;
    }
}

module.exports = new BuildsCleaner();
