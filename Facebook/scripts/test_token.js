'use strict';
const FacebookAPI = require('../lib/facebook-api');
new FacebookAPI().healthCheck().then(r=>process.stdout.write(JSON.stringify(r)+'\n')).catch(()=>{process.stderr.write('OFFLINE_HEALTH_FAILED\n');process.exitCode=1;});
