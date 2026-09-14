'use strict';
const pipeline=require('../services/ai_pipeline');
pipeline.runFullProduction().then(r=>process.stdout.write(JSON.stringify(r,null,2)+'\n')).catch(()=>{process.stderr.write('OFFLINE_PREVIEW_FAILED\n');process.exitCode=1;});
