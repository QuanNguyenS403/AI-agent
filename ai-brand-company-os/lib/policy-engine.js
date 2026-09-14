'use strict';
const { validate, validTime } = require('./schema');
const woSchema = require('../schemas/work-order.schema.json');
const defaultPolicy = require('../config/policy.json');
const defaultState = require('../config/company-state.json');
const registry = require('../config/agent-registry.json');
const INTERNAL = Object.freeze(['source.inspect','draft.create','analysis.compute']);
function deny(reason, details = []) { return Object.freeze({allowed:false,decision:'DENY',reason,details,authorizes_external:false}); }
function evaluateAction(request, options = {}) {
  const { policy = defaultPolicy, state = defaultState, now = new Date().toISOString() } = options;
  if (!request || typeof request !== 'object' || Array.isArray(request)) return deny('INVALID_REQUEST');
  // This compiled boundary is independent of flags, receipts and caller assertions.
  if (!INTERNAL.includes(request.action)) return deny('EXTERNAL_OR_UNKNOWN_ACTION_NOT_IMPLEMENTED');
  if (!validTime(now)) return deny('INVALID_CLOCK');
  if (!state || state.company_state !== 'BOOTSTRAP' || state.environment !== 'offline' ||
      state.default_autonomy !== 'A0' || state.dry_run !== true || state.external_publishing !== false ||
      state.paid_acquisition !== false || state.ads_budget_vnd !== 0 || state.capital_gate !== 'FAIL' ||
      state.live_transport_implemented !== false ||
      !state.kill_switches || ['global_external','publishing','crm_send','paid_spend'].some(k => state.kill_switches[k] !== true)) return deny('UNSAFE_OR_UNKNOWN_STATE');
  if (!policy || policy.version !== defaultPolicy.version || policy.environment !== 'offline' ||
      policy.max_cost_vnd !== 0 || !Array.isArray(policy.allowed_actions) || !policy.allowed_actions.includes(request.action)) return deny('INVALID_POLICY');
  const agent = registry.agents.find(a => a.id === request.actor_id);
  if (!agent || !agent.enabled || !agent.allowed_actions.includes(request.action)) return deny('ACTOR_NOT_GRANTED');
  const wo = request.work_order;
  const errors = validate(wo,woSchema);
  if (errors.length) return deny('INVALID_WORK_ORDER',errors);
  if (wo.assigned_to !== request.actor_id || wo.action !== request.action || wo.environment !== 'offline' ||
      wo.policy_version !== policy.version || wo.max_cost_vnd !== 0) return deny('SCOPE_MISMATCH');
  const n = Date.parse(now);
  if (Date.parse(wo.created_at) > n || Date.parse(wo.expires_at) <= n || Date.parse(wo.expires_at) <= Date.parse(wo.created_at)) return deny('WORK_ORDER_TIME_INVALID');
  if (!['PLANNED','IN_PROGRESS'].includes(wo.status)) return deny('WORK_ORDER_NOT_EXECUTABLE');
  if (wo.dependencies.includes(wo.id)) return deny('SELF_DEPENDENCY');
  return Object.freeze({allowed:true,decision:'ALLOW_OFFLINE_ONLY',reason:'SCOPED_INTERNAL_ARTIFACT',work_order_id:wo.id,authorizes_external:false});
}
module.exports = { evaluateAction, INTERNAL };
