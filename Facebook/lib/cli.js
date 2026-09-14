'use strict';
function blocked(action) {
  process.stdout.write(JSON.stringify({status:'BLOCKED',action,reason:'LIVE_TRANSPORT_NOT_IMPLEMENTED',external_effects:[]})+'\n');
  process.exitCode=2;
}
module.exports = {blocked};
