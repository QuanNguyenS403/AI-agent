'use strict';
// Synthetic fixtures only. No customer, bank, provider or credential data.
const NOW='2026-09-14T12:00:00Z';
function workOrder(overrides={}) {
  return {id:'WO-TEST-001',version:1,objective_id:'OBJ-TEST',action:'draft.create',
    assigned_to:'content',requested_by:'ceo',environment:'offline',policy_version:'1.0.0',
    status:'PLANNED',created_at:'2026-09-14T00:00:00Z',expires_at:'2026-09-15T00:00:00Z',
    idempotency_key:'draft-test-001',input_refs:[],artifact_digest:null,dependencies:[],
    acceptance_criteria:['Offline draft only; no external action'],max_cost_vnd:0,...overrides};
}
function capitalPolicy() { return {version:'1.0.0',owner_approved:true,currency:'VND',thresholds:{
  min_settled_orders:10,min_observation_days:30,min_realized_profit_vnd:100000,
  min_attribution_coverage:0.9,max_refund_rate:0.1,max_data_age_hours:24,
  reserve_requirement_vnd:200000,max_reinvestment_fraction:0.1,max_test_budget_vnd:10000}}; }
function snapshot(overrides={}) { return {currency:'VND',observed_at:NOW,evidence_verified:true,
  governance_ready:true,commerce_ready:true,reconciled:true,measurement_ready:true,
  operations_ready:true,stop_loss_exercised:true,settled_organic_orders:20,observation_days:30,
  realized_organic_profit_vnd:1000000,verified_cash_vnd:1000000,committed_exposure_vnd:100000,
  requested_budget_vnd:10000,attribution_coverage:0.95,refund_rate:0.02,...overrides}; }
module.exports={NOW,workOrder,capitalPolicy,snapshot};
