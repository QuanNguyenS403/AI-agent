'use strict';
const {evaluateAction} = require('../../ai-brand-company-os/lib/policy-engine');
function authorizeDraft(workOrder, actorId, now) {
  return evaluateAction({action:'draft.create',actor_id:actorId,work_order:workOrder},{now});
}
function assertExternalDisabled() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
module.exports = {authorizeDraft,assertExternalDisabled};
