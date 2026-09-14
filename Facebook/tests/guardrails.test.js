'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {execFileSync,spawnSync}=require('node:child_process');
const path=require('node:path');
const API=require('../lib/facebook-api');
const pipeline=require('../services/ai_pipeline');
const executor=require('../services/publish-executor');
const gateway=require('../services/work-order-gateway');
const {planDrafts}=require('../lib/content-planner');
const {NOW,workOrder}=require('../../tests/fixtures');
for(const method of ['_request','request','publishPost','publishPhoto','uploadPhoto','publishReel','schedulePost','deletePost','updatePageInfo','createCampaign']){
  test('direct '+method+' rejects forged capability',async()=>{
    const api=new API({allowed:true,baseOrigin:'https://example.invalid'});
    await assert.rejects(()=>api[method]({authorization:{allowed:true,decision:'ALLOW'},capital_gate:'PASS'}),/LIVE_TRANSPORT_NOT_IMPLEMENTED/);
  });
}
test('executor and gateway cannot bypass',async()=>{
  for(const fn of [executor.publish,executor.schedule,gateway.execute])await assert.rejects(()=>fn({allowed:true}),/NOT_IMPLEMENTED/);
});
test('fake QA and media are not generated',async()=>{
  const r=await pipeline.runFullProduction();assert.equal(r.ready_for_publish,false);assert.equal(r.image_asset,null);assert.equal(r.video_asset,null);assert.equal(r.qa_score,null);
  assert.equal((await pipeline.inspectQualityWithVision()).passed,false);
  assert.equal((await pipeline.generateMainImage()).status,'NOT_IMPLEMENTED');
});
test('health does not pretend to check provider',async()=>{
  const h=await new API().healthCheck();assert.equal(h.network_checked,false);assert.equal(h.credential_checked,false);
});
test('draft count bounded',()=>{for(const n of [0,-1,8,NaN,'3',1.2])assert.throws(()=>planDrafts({count:n}),/INVALID_DRAFT_COUNT/);});
test('preview requires valid work order',()=>{
  assert.equal(gateway.preview().status,'BLOCKED');
  assert.equal(gateway.preview({work_order:workOrder(),actor_id:'content',now:NOW}).ready_for_publish,false);
});
for(const file of ['publish_now.js','schedule_month.js','update_page_info.js','set_token.js','inspect_new_token.js','update_new_token.js']){
  test(file+' CLI denies with exit 2 and no credential output',()=>{
    const r=spawnSync(process.execPath,[path.join(__dirname,'../scripts',file)],{encoding:'utf8',env:{PATH:process.env.PATH},timeout:5000});
    assert.equal(r.status,2);const out=JSON.parse(r.stdout);assert.equal(out.status,'BLOCKED');assert.deepEqual(out.external_effects,[]);
  });
}
test('snapshot sync is local and nonpublishable',()=>{
  const output=execFileSync(process.execPath,[path.join(__dirname,'../scripts/sync_products.mjs')],{encoding:'utf8',env:{PATH:process.env.PATH},timeout:5000});
  const r=JSON.parse(output);assert.equal(r.live_verified,false);assert.equal(r.snapshot.publishable,false);assert.equal(r.snapshot.products.length,3);
});
test('pause does not claim remote success',()=>{
  const r=JSON.parse(execFileSync(process.execPath,[path.join(__dirname,'../scripts/pause_publishing.js')],{encoding:'utf8',timeout:5000}));
  assert.equal(r.remote_pause_confirmed,false);
});
