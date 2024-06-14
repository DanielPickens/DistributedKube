const { uid } = require('@distributedkube/uid');

const delay = d => new Promise(r => setTimeout(r, d));

const createJobId = () => uid();

module.exports = {
    delay,
    createJobId
};

