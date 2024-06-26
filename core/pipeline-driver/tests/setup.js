
const configIt = require('@distributedkube/config');
const storageManager = require('@distributedkube/storage-manager');
const { Factory } = require('@distributedkube/redis-utils');
const bootstrap = require('../bootstrap');
const stateManager = require('../lib/state/state-manager');
const { main: config } = configIt.load();

before(async () => {
    await storageManager.init(config, null, true);
    await bootstrap.init();
    const redis = Factory.getClient(config.redis);
    await redis.flushall();
    await stateManager._etcd._client.client.delete().all()

    global.testParams = {
        config
    }
});
