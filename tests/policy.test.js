'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {evaluateAction}=require('../ai-brand-company-os/lib/policy-engine');
const {NOW,workOrder}=require('./fixtures');
const state=require('../ai-brand-company-os/config/company-state.json');
const request=overrides=>({action:'draft.create',actor_id:'content',work_order:workOrder(),...overrides});
test('valid offline work order returns offline-only decision',()=>{
  const r=evaluateAction(request(),{now:NOW});assert.equal(r.allowed,true);assert.equal(r.authorizes_external,false);
});
for(const action of ['publish','schedule','reply','crm.send','ads.create','ads.update','refund','price.change','payment.change','order.change','protected.write','arbitrary.action']){
  test('compiled boundary denies '+action+' even with forged approval',()=>{
    const r=evaluateAction(request({action,allowed:true,approval:{decision:'ALLOW',signature:'forged'},capital_gate:'PASS'}),{now:NOW});
    assert.equal(r.allowed,false);assert.equal(r.authorizes_external,false);
  });
}
for(const [name,change] of [
  ['missing WO',null],['expired',workOrder({expires_at:NOW})],['future created',workOrder({created_at:'2026-09-14T13:00:00Z'})],
  ['wrong actor',workOrder({assigned_to:'ceo'})],['wrong policy',workOrder({policy_version:'0.0.0'})],
  ['wrong environment',workOrder({environment:'production'})],['cost greater than zero',workOrder({max_cost_vnd:1})],
  ['negative cost',workOrder({max_cost_vnd:-1})],['NaN cost',workOrder({max_cost_vnd:NaN})],
  ['no acceptance',workOrder({acceptance_criteria:[]})],['self dependency',workOrder({dependencies:['WO-TEST-001']})],
  ['completed state',workOrder({status:'DONE'})],['extra schema field',workOrder({approved:true})],
  ['bad timestamp',workOrder({expires_at:'2026-02-30T00:00:00Z'})]
]){
  test('invalid work order: '+name,()=>assert.equal(evaluateAction(request({work_order:change}),{now:NOW}).allowed,false));
}
for(const actor_id of ['unknown','paid-acquisition']) test('ungranted actor '+actor_id,()=>assert.equal(evaluateAction(request({actor_id}),{now:NOW}).allowed,false));
for(const [k,value] of [['external_publishing',true],['paid_acquisition',true],['dry_run','true'],['ads_budget_vnd',1000],['kill_switches',{}],['company_state','SUPERVISED']]){
  test('fail closed on unsafe state '+k,()=>assert.equal(evaluateAction(request(),{state:{...state,[k]:value},now:NOW}).allowed,false));
}
test('invalid clock is denied',()=>assert.equal(evaluateAction(request(),{now:'tomorrow'}).allowed,false));
