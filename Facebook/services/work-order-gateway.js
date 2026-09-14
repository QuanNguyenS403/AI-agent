'use strict';
const {authorizeDraft} = require('../lib/governance');
const {planDrafts} = require('../lib/content-planner');
function preview({work_order,actor_id,count=3,now}={}) {
  const decision = authorizeDraft(work_order,actor_id,now);
  if (!decision.allowed) return {status:'BLOCKED',decision,ready_for_publish:false};
  return {status:'DRAFT',decision,drafts:planDrafts({count}),ready_for_publish:false,external_effects:[]};
}
async function execute() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
module.exports = {preview,execute};
