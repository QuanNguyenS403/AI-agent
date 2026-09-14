'use strict';
const { validate, validTime } = require('./schema');
const schema = require('../schemas/work-order.schema.json');
const { INTERNAL } = require('./policy-engine');
const transitions = Object.freeze({
  REQUESTED:['PLANNED','BLOCKED','CANCELLED'], PLANNED:['IN_PROGRESS','BLOCKED','CANCELLED'],
  IN_PROGRESS:['QA_PENDING','BLOCKED','FAILED','CANCELLED'],
  QA_PENDING:['IN_PROGRESS','DONE','BLOCKED','CANCELLED'],
  BLOCKED:['PLANNED','CANCELLED'], FAILED:['CANCELLED'], DONE:[], CANCELLED:[]
});
function transition(wo, next, evidence = {}, now = new Date().toISOString()) {
  const errors = validate(wo,schema);
  if (errors.length) throw new Error('INVALID_WORK_ORDER');
  if (!INTERNAL.includes(wo.action) || wo.environment !== 'offline' || wo.max_cost_vnd !== 0) throw new Error('EXTERNAL_WORKFLOW_NOT_IMPLEMENTED');
  if (!validTime(now) || Date.parse(wo.created_at) > Date.parse(now) ||
      Date.parse(wo.expires_at) <= Date.parse(now)) throw new Error('INVALID_WORK_ORDER_TIME');
  if (!(transitions[wo.status] || []).includes(next)) throw new Error('INVALID_TRANSITION');
  if (next === 'DONE' && (!/^[a-f0-9]{64}$/.test(evidence.digest || '') ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/.test(evidence.reviewer_id || '') ||
      [wo.assigned_to,wo.requested_by].includes(evidence.reviewer_id) || evidence.acceptance_passed !== true)) throw new Error('INDEPENDENT_COMPLETION_EVIDENCE_REQUIRED');
  const result = JSON.parse(JSON.stringify(wo));
  result.status = next;
  if (next === 'DONE') result.artifact_digest = evidence.digest;
  // Pure transition proposal, not a database update, audit log or trusted approval.
  return {work_order:result,transition_event:{work_order_id:wo.id,from:wo.status,to:next,at:now,kind:'OFFLINE_TRANSITION_PROPOSAL'}};
}
module.exports = { transition };
