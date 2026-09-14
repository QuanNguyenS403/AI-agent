'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {transition}=require('../ai-brand-company-os/lib/work-order');
const {evaluateCapitalGate}=require('../ai-brand-company-os/lib/capital-gate');
const {NOW,workOrder,capitalPolicy,snapshot}=require('./fixtures');
test('pure transition does not mutate source',()=>{
  const wo=workOrder();const r=transition(wo,'IN_PROGRESS',{},NOW);
  assert.equal(r.work_order.status,'IN_PROGRESS');assert.equal(wo.status,'PLANNED');
});
test('cannot skip to DONE',()=>assert.throws(()=>transition(workOrder(),'DONE',{},NOW),/INVALID_TRANSITION/));
test('external workflow stays blocked',()=>assert.throws(()=>transition(workOrder({action:'publish'}),'IN_PROGRESS',{},NOW),/NOT_IMPLEMENTED/));
test('self completion is rejected',()=>assert.throws(()=>transition(workOrder({status:'QA_PENDING'}),'DONE',{digest:'a'.repeat(64),reviewer_id:'content',acceptance_passed:true},NOW),/EVIDENCE/));
test('complete offline proposal requires review metadata',()=>{
  const r=transition(workOrder({status:'QA_PENDING'}),'DONE',{digest:'a'.repeat(64),reviewer_id:'quality-assurance',acceptance_passed:true},NOW);
  assert.equal(r.work_order.status,'DONE');assert.equal(r.transition_event.kind,'OFFLINE_TRANSITION_PROPOSAL');
});
test('terminal work cannot restart',()=>assert.throws(()=>transition(workOrder({status:'DONE'}),'IN_PROGRESS',{},NOW),/INVALID_TRANSITION/));
test('default undecided capital policy fails',()=>{
  const r=evaluateCapitalGate(snapshot(),undefined,NOW);assert.equal(r.result,'FAIL');assert.equal(r.authorizes_spend,false);
});
test('even favorable synthetic data never issues spending authority',()=>{
  const r=evaluateCapitalGate(snapshot(),capitalPolicy(),NOW);
  assert.equal(r.gates.slice(0,6).every(g=>g.result==='PASS'),true);
  assert.equal(r.gates[6].result,'FAIL');assert.equal(r.result,'FAIL');assert.equal(r.authorizes_spend,false);
});
for(const value of [null,undefined,-1,NaN,Infinity,'10000',1.5]) test('invalid budget '+String(value),()=>{
  const r=evaluateCapitalGate(snapshot({requested_budget_vnd:value}),capitalPolicy(),NOW);
  assert.equal(r.gates.every(g=>g.result==='FAIL'),true);assert.equal(r.authorizes_spend,false);
});
for(const [name,changes,gate] of [
  ['unreconciled',{reconciled:false},1],['no organic profit',{realized_organic_profit_vnd:0},2],
  ['cash insufficient',{verified_cash_vnd:0},3],['unknown measurement',{measurement_ready:null},4],
  ['no stop exercise',{stop_loss_exercised:false},5]
]) test('capital rejects '+name,()=>assert.equal(evaluateCapitalGate(snapshot(changes),capitalPolicy(),NOW).gates[gate].result,'FAIL'));
test('future evidence rejected',()=>assert.equal(evaluateCapitalGate(snapshot({observed_at:'2026-09-15T00:00:00Z'}),capitalPolicy(),NOW).gates[0].reason,'STALE_OR_FUTURE_EVIDENCE'));
test('stale evidence rejected',()=>assert.equal(evaluateCapitalGate(snapshot({observed_at:'2026-09-10T00:00:00Z'}),capitalPolicy(),NOW).gates[0].reason,'STALE_OR_FUTURE_EVIDENCE'));
test('unbounded threshold rejected',()=>{const p=capitalPolicy();p.thresholds.max_reinvestment_fraction=Infinity;assert.equal(evaluateCapitalGate(snapshot(),p,NOW).gates[0].reason,'INVALID_THRESHOLDS');});
test('empty thresholds rejected',()=>{const p=capitalPolicy();p.thresholds={};assert.equal(evaluateCapitalGate(snapshot(),p,NOW).result,'FAIL');});
