const {promisify} = require('util');
const chai = require('chai');
const path = require('path');
const chaiAsPromised = require('chai-as-promised');
const moment = require('moment');
const fse = require('fs-extra');
const storageManager = require('@distributedkube/storage-manager');
const { expect } = chai;
chai.use(chaiAsPromised);
const adapters = ['s3', 'fs'];
let config, settings, cleaner, cleanerManager;
const delay = promisify(setTimeout);
const streamToBuffer = (stream) => {
    return new Promise((resolve) => {
        const _buf = [];
        stream.on('data', (chunk) => _buf.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(_buf)));
        stream.on('error', (err) => resolve(err));
    });
}

describe('Storage', () => {
    before(() => {
        cleanerManager = require('../../lib/core/cleaner-manager');
        cleaner = cleanerManager.getCleaner('storage');
        config = global.testParams.config;
        settings = config.cleanerSettings.storage.settings;
    });
    adapters.forEach((adapter) => {
        describe(adapter, () => {
            before(async () => {
                const newConfig = { ...config, defaultStorage: adapter };
                storageManager._wasInit = false;
                await storageManager.init(newConfig, null, true);
            });
            it('should clean temp objects', async () => {
                await cleaner.clean();

                for (let i = 0; i < 5; i++) {
                    await storageManager.put({ path: path.join('local-distributedkube-index', moment().subtract(settings.maxAge.temp + i, 'minutes').format(storageManager.distributedkubeIndex.DateFormat), 'job' + i), data: [] });

                    for (let j = 1; j <= 5; j++) {
                        const jobId = 'job' + i;
                        const taskId = 'task' + j;
                        const data = { test: 'test' + j };
                        await storageManager.distributedkube.put({ jobId, taskId, data });
                        await storageManager.distributedkubeMetadata.put({ jobId, taskId, data });
                        await storageManager.distributedkubeExecutions.put({ jobId, data });
                        await storageManager.distributedkubeResults.put({ jobId, data });
                    }
                }
                await cleaner.clean();
                for (let i = 0; i < 5; i++) {
                    await storageManager.get({ path: path.join('local-distributedkube-index', moment().subtract(settings.maxAge.temp + i, 'minutes').format(storageManager.distributedkubeIndex.DateFormat), 'job' + i) });

                    for (let j = 1; j <= 5; j++) {
                        const jobId = 'job' + i;
                        const taskId = 'task' + j;
                        expect(storageManager.distributedkube.get({ jobId, taskId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkubeMetadata.get({ jobId, taskId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkubeExecutions.get({ jobId })).to.eventually.rejectedWith(Error);
                        await storageManager.distributedkubeResults.get({ jobId });
                    }
                }
            });
            it('should clean builds objects', async () => {
                const maxAge = 0;
                const size = 3;
                await cleaner.clean({ maxAge });

                for (let i = 0; i < size; i++) {
                    const buildId = `build-${i}`;
                    const file = `${process.cwd()}/tests/storage/mocks/alg.tar.gz`;
                    await storageManager.distributedkubeBuilds.putStream({ buildId, data: fse.createReadStream(file) });
                }
                await delay(300);
                await cleaner.clean({ maxAge });

                for (let i = 0; i < size; i++) {
                    const buildId = `build-${i}`;
                    const stream = await storageManager.distributedkubeBuilds.getStream({ buildId });
                    const result = await streamToBuffer(stream);
                    expect(result).to.be.instanceOf(Error);
                }
            });
            it('should clean results+temp objects', async () => {
                await cleaner.clean();

                for (let i = 0; i < 5; i++) {
                    await storageManager.put({ path: path.join('local-distributedkube-index', moment().subtract(settings.maxAge.results + i, 'minutes').format(storageManager.distributedkubeIndex.DateFormat), 'job' + i), data: [] });

                    for (let j = 1; j <= 5; j++) {
                        const jobId = 'job' + i;
                        const pipelineName = 'pl' + i;
                        const nodeName = 'nn' + i;
                        const taskId = 'task' + j;
                        const fileName = 'fN';
                        const data = { test: 'test' + j };
                        await storageManager.distributedkube.put({ jobId, taskId, data });
                        await storageManager.distributedkubeMetadata.put({ jobId, taskId, data });
                        await storageManager.distributedkubeExecutions.put({ jobId, data });
                        await storageManager.distributedkubeResults.put({ jobId, data });
                        await storageManager.distributedkubeAlgoMetrics.put({ jobId, taskId, pipelineName, nodeName, fileName, data })
                    }
                }
                await cleaner.clean();

                for (let i = 0; i < 5; i++) {
                    expect(storageManager.get({ path: path.join('local-distributedkube-index', moment().subtract(settings.maxAge.results + i, 'minutes').format(storageManager.distributedkubeIndex.DateFormat), 'job' + i) })).to.eventually.rejectedWith(Error);

                    for (let j = 1; j <= 5; j++) {
                        const jobId = 'job' + i;
                        const taskId = 'task' + j;
                        const pipelineName = 'pl' + i;
                        const nodeName = 'nn' + i;
                        const fileName = 'fN';
                        expect(storageManager.distributedkubeMetadata.get({ jobId, taskId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkubeExecutions.get({ jobId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkubeResults.get({ jobId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkube.get({ jobId, taskId })).to.eventually.rejectedWith(Error);
                        expect(storageManager.distributedkubeAlgoMetrics.get({ jobId, taskId, pipelineName, nodeName, fileName })).to.eventually.rejectedWith(Error);
                    }
                }
            });
            it('should get and put object', async () => {
                await cleaner.clean();

                for (let i = 0; i < 5; i++) {
                    await storageManager.put({ path: path.join('local-distributedkube-index', moment().format(storageManager.distributedkubeIndex.DateFormat), 'jobx' + i), data: [] });
                    await storageManager.distributedkube.put({ jobId: 'jobx' + i, taskId: 'task1', data: { test: 'test1' } });
                    await storageManager.distributedkube.put({ jobId: 'jobx' + i, taskId: 'task2', data: { test: 'test2' } });
                    await storageManager.distributedkube.put({ jobId: 'jobx' + i, taskId: 'task3', data: { test: 'test3' } });
                    await storageManager.distributedkube.put({ jobId: 'jobx' + i, taskId: 'task4', data: { test: 'test4' } });
                    await storageManager.distributedkube.put({ jobId: 'jobx' + i, taskId: 'task5', data: { test: 'test5' } });
                }
                await cleaner.clean();

                for (let i = 0; i < 5; i++) {
                    const a = await storageManager.get({ path: path.join('local-distributedkube-index', moment().format(storageManager.distributedkubeIndex.DateFormat), 'jobx' + i) });
                    const b = await storageManager.distributedkube.get({ jobId: 'jobx' + i, taskId: 'task1' });
                    const c = await storageManager.distributedkube.get({ jobId: 'jobx' + i, taskId: 'task2' });
                    const d = await storageManager.distributedkube.get({ jobId: 'jobx' + i, taskId: 'task3' });
                    const e = await storageManager.distributedkube.get({ jobId: 'jobx' + i, taskId: 'task4' });
                    const f = await storageManager.distributedkube.get({ jobId: 'jobx' + i, taskId: 'task5' });
                    await storageManager.distributedkube.delete({ jobId: 'jobx' + i });
                }
                await storageManager.distributedkubeIndex.delete({ date: moment().format(storageManager.distributedkubeIndex.DateFormat) });
            });
        });
    });
});
