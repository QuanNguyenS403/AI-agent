'use strict';
// No injectable adapter or receipt can turn this scaffold into a live publisher.
async function publish() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
async function schedule() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
module.exports = {publish,schedule};
