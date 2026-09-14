// Read-only pinned snapshot preview. Does not clone, import remote JS, fetch, or write files.
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const snapshot=require('../../integrations/pijama/product-snapshot.json');
process.stdout.write(JSON.stringify({status:'PINNED_SNAPSHOT_ONLY',live_verified:false,snapshot},null,2)+'\n');
