'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const errors=[],files=[];
function walk(dir) {
  for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if(['.git','node_modules','.runtime','coverage'].includes(e.name))continue;
    const absolute=path.join(dir,e.name);
    if(e.isSymbolicLink()){errors.push('Symlink not supported: '+path.relative(root,absolute));continue;}
    if(e.isDirectory())walk(absolute);else files.push(path.relative(root,absolute).split(path.sep).join('/'));
  }
}
walk(root);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parse=p=>JSON.parse(read(p));
const required=parse('docs/implementation/required-files.json');
for(const p of required.files)if(!files.includes(p))errors.push('Missing required file: '+p);
const registry=parse('Facebook/config/source-registry.json');
const legacy=new Set(registry.legacy.map(x=>x.path));
let jsonCount=0,jsCount=0,linkCount=0,activeMdCount=0,textCount=0;
const fence=String.fromCharCode(96).repeat(3);
const secretPatterns=[
  /EAA[A-Za-z0-9]{40,}/, /gh[pousr]_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{40,}/,
  /(?:app_secret|APP_SECRET)\s*[:=]\s*['"][A-Fa-f0-9]{32}['"]/,
  new RegExp('-----BEGIN '+'(?:RSA |EC |OPENSSH )?PRIVATE KEY-----')
];
for(const p of files) {
  if(!/\.(?:md|json|ya?ml|js|mjs|cjs|txt)$/.test(p)&&!p.endsWith('.env.example')&&p!=='.gitignore')continue;
  const content=read(p);textCount++;
  if(secretPatterns.some(re=>re.test(content)))errors.push('Potential secret detected (value withheld): '+p);
  if(p.endsWith('.json')){try{JSON.parse(content);jsonCount++;}catch{errors.push('Invalid JSON: '+p);}}
  if(/\.(?:js|mjs|cjs)$/.test(p)){
    try{execFileSync(process.execPath,['--check',path.join(root,p)],{stdio:'pipe',timeout:10000});jsCount++;}
    catch{errors.push('Invalid JavaScript syntax: '+p);}
  }
  if(p.endsWith('.md')&&!legacy.has(p)){
    activeMdCount++;
    if((content.match(new RegExp('^'+fence,'gm'))||[]).length%2)errors.push('Unbalanced code fence: '+p);
    const prose=content.replace(new RegExp(fence+'[\\s\\S]*?'+fence,'g'),'');
    for(const m of prose.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)){
      const target=m[1];if(/^(?:https?:|mailto:|#)/i.test(target))continue;
      let clean;try{clean=decodeURIComponent(target.split('#')[0]);}catch{errors.push('Invalid link encoding: '+p);continue;}
      if(!clean)continue;
      const absolute=path.resolve(root,path.dirname(p),clean);linkCount++;
      if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute))errors.push('Broken/out-of-scope active link: '+p+' -> '+target);
    }
  }
}
for(const p of ['ai-brand-company-os/SKILL.md','Facebook/SKILL.md']){
  if(!/^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/.test(read(p)))errors.push('Invalid skill frontmatter: '+p);
}
const state=parse('ai-brand-company-os/config/company-state.json');
if(state.company_state!=='BOOTSTRAP'||state.environment!=='offline'||state.default_autonomy!=='A0'||
 state.dry_run!==true||state.external_publishing!==false||state.paid_acquisition!==false||
 state.ads_budget_vnd!==0||state.capital_gate!=='FAIL'||state.live_transport_implemented!==false||
 !state.kill_switches||['global_external','publishing','crm_send','paid_spend'].some(k=>state.kill_switches[k]!==true))errors.push('Unsafe bootstrap company state');
const runtime=parse('Facebook/config/runtime.json');
if(runtime.mode!=='OFFLINE_ONLY'||runtime.dry_run!==true||runtime.external_publishing!==false||runtime.paid_acquisition!==false||runtime.ads_budget_vnd!==0||runtime.transport!=='NOT_IMPLEMENTED')errors.push('Unsafe Facebook runtime');
if(!/^v\d+\.\d+$/.test(runtime.graph_api.version)||!runtime.graph_api.source.startsWith('https://developers.facebook.com/'))errors.push('Invalid API source registry');
const policy=parse('ai-brand-company-os/config/capital-policy.json');
if(policy.owner_approved!==false||Object.values(policy.thresholds).some(v=>v!==null))errors.push('Capital thresholds must remain undecided for this bootstrap release');
const agents=parse('ai-brand-company-os/config/agent-registry.json').agents;
const profiles=parse('ai-brand-company-os/evals/agent-eval-pack.json').profiles;
if(agents.length!==20||new Set(agents.map(a=>a.id)).size!==20)errors.push('Registry must contain 20 unique roles');
for(const a of agents)if(!profiles[a.eval_profile]||a.autonomy!=='A0'||a.max_cost_vnd!==0||a.external_grant!==null)errors.push('Invalid baseline/eval: '+a.id);
const snapshot=parse('integrations/pijama/product-snapshot.json'),source=parse('integrations/pijama/source-manifest.json');
if(snapshot.publishable!==false||snapshot.live_inventory_verified!==false||snapshot.commit!==source.commit||snapshot.products.length!==3)errors.push('Unsafe/unpinned snapshot');
if(source.retrieved_text_count!==source.files.length||new Set(source.files.map(x=>x.path)).size!==source.files.length)errors.push('Inconsistent source manifest');
for(const p of ['README.md','package.json','PROTECTED-DATA.md','src/data/products.js','src/pages/CheckoutPage.jsx','server/index.js','server/apiHandler.js','server/lib/paymentWebhook.js'])if(!source.files.some(x=>x.path===p&&/^[a-f0-9]{40}$/.test(x.blob_sha)))errors.push('Missing pijama source: '+p);
for(const s of registry.active_runtime_sources)if(!files.includes(s))errors.push('Missing active source: '+s);
for(const p of files.filter(p=>/^(Facebook\/(lib|services|scripts)|ai-brand-company-os\/lib)\//.test(p)&&/\.(js|mjs)$/.test(p))){
  if(/\bfetch\s*\(|https?\.request\s*\(|require\(['"](?:https?|axios|undici)['"]\)/.test(read(p)))errors.push('Unexpected network path: '+p);
}
const result={status:errors.length?'FAIL':'PASS',required_files:required.files.length,json_files:jsonCount,js_syntax_files:jsCount,active_markdown_files:activeMdCount,active_local_links:linkCount,text_files_scanned:textCount,excluded_from_full_certification:['Git history','binary .skill archives','quarantined legacy Markdown links','provider/API deployments','exhaustive all-secret detection'],errors};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
if(errors.length)process.exitCode=1;
