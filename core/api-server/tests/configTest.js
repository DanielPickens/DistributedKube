const { expect } = require('chai');
const configIt = require('@distributedkube/config');
const path = require('path');
let envSave = {};
describe('config', () => {
    beforeEach(() => {
        envSave = { ...process.env };
        delete require.cache[require.resolve(path.resolve('config/main/config.base.js'))];
    });
    afterEach(() => {
        process.env = envSave;
    });
    it('empty env', () => {
        const { main } = configIt.load();
        expect(main.debugUrl.path).to.eql('distributedkube/debug');
        expect(main.swagger.path).to.eql('');
    });
    it('ingress prefix env', () => {
        process.env.INGRESS_PREFIX = '/foo';
        const { main } = configIt.load();
        expect(main.debugUrl.path).to.eql('/foo/distributedkube/debug');
        expect(main.swagger.path).to.eql('/foo');
    });
    it('base path env', () => {
        process.env.BASE_URL_PATH = '/distributedkube/api-server';
        const { main } = configIt.load();
        expect(main.debugUrl.path).to.eql('distributedkube/debug');
        expect(main.swagger.path).to.eql('/distributedkube/api-server');
    });
    it('ingress and base path env', () => {
        process.env.BASE_URL_PATH = '/distributedkube/api-server';
        process.env.INGRESS_PREFIX = '/foo';
        const { main } = configIt.load();
        expect(main.debugUrl.path).to.eql('/foo/distributedkube/debug');
        expect(main.swagger.path).to.eql('/foo/distributedkube/api-server');
    });
});
