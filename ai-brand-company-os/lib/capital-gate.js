'use strict';
const defaultPolicy = require('../config/capital-policy.json');
const { validTime } = require('./schema');
const thresholdNames = ['min_settled_orders','min_observation_days','min_realized_profit_vnd','min_attribution_coverage','max_refund_rate','max_data_age_hours','reserve_requirement_vnd','max_reinvestment_fraction','max_test_budget_vnd'];
const integer = n => Number.isSafeInteger(n) && n >= 0;
const ratio = n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;
function evaluateCapitalGate(snapshot, policy = defaultPolicy, now = new Date().toISOString()) {
  const fail = reason => ({result:'FAIL',authorizes_spend:false,kind:'OFFLINE_DIAGNOSTIC',gates:Array.from({length:7},(_,i)=>({id:'G'+i,result:'FAIL',reason}))});
  if (!snapshot || typeof snapshot !== 'object' || !policy || !validTime(now)) return fail('INVALID_INPUT');
  const t = policy.thresholds;
  if (policy.owner_approved !== true || policy.currency !== 'VND' || !t ||
      thresholdNames.some(k => t[k] === null || t[k] === undefined) ||
      Object.keys(t).some(k => !thresholdNames.includes(k))) return fail('OWNER_THRESHOLDS_UNDECIDED');
  const ratioKeys = ['min_attribution_coverage','max_refund_rate','max_reinvestment_fraction'];
  if (thresholdNames.some(k => !(ratioKeys.includes(k) ? ratio(t[k]) : integer(t[k]))) ||
      t.min_settled_orders < 1 || t.min_observation_days < 1 || t.min_realized_profit_vnd < 1 ||
      t.max_data_age_hours < 1 || t.max_test_budget_vnd < 1 ||
      t.max_reinvestment_fraction <= 0 || t.min_attribution_coverage <= 0) return fail('INVALID_THRESHOLDS');
  const numericFields = ['settled_organic_orders','observation_days','realized_organic_profit_vnd','verified_cash_vnd','committed_exposure_vnd','requested_budget_vnd'];
  if (numericFields.some(k => !integer(snapshot[k])) ||
      !ratio(snapshot.attribution_coverage) || !ratio(snapshot.refund_rate) ||
      !validTime(snapshot.observed_at) || snapshot.currency !== 'VND') return fail('INVALID_SNAPSHOT');
  const age = (Date.parse(now)-Date.parse(snapshot.observed_at))/3600000;
  if (age < 0 || age > t.max_data_age_hours) return fail('STALE_OR_FUTURE_EVIDENCE');
  const available = snapshot.verified_cash_vnd - t.reserve_requirement_vnd - snapshot.committed_exposure_vnd;
  const reinvestment = Math.floor(snapshot.realized_organic_profit_vnd * t.max_reinvestment_fraction);
  const checks = [
    [snapshot.governance_ready === true && snapshot.evidence_verified === true,'GOVERNANCE_EVIDENCE'],
    [snapshot.commerce_ready === true && snapshot.reconciled === true,'COMMERCE_RECONCILIATION'],
    [snapshot.settled_organic_orders >= t.min_settled_orders && snapshot.observation_days >= t.min_observation_days && snapshot.realized_organic_profit_vnd >= t.min_realized_profit_vnd && snapshot.refund_rate <= t.max_refund_rate,'ORGANIC_ECONOMICS'],
    [Number.isSafeInteger(available) && available >= snapshot.requested_budget_vnd && snapshot.requested_budget_vnd > 0 && snapshot.requested_budget_vnd <= Math.min(t.max_test_budget_vnd,reinvestment),'TREASURY_AND_ENVELOPE'],
    [snapshot.measurement_ready === true && snapshot.attribution_coverage >= t.min_attribution_coverage,'MEASUREMENT_COVERAGE'],
    [snapshot.operations_ready === true && snapshot.stop_loss_exercised === true,'OPERATIONAL_EVIDENCE'],
    [false,'TRUSTED_SIGNERS_AND_LIVE_AUTHORIZATION_NOT_IMPLEMENTED']
  ];
  return {result:'FAIL',authorizes_spend:false,kind:'OFFLINE_DIAGNOSTIC',available_cash_vnd:available,
    gates:checks.map(([ok,reason],i)=>({id:'G'+i,result:ok?'PASS':'FAIL',reason}))};
}
module.exports = { evaluateCapitalGate };
