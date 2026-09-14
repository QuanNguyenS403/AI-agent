'use strict';
// Deliberate hard boundary: this bootstrap build contains NO network transport,
// consumes NO credential, and does not treat JSON decisions as capabilities.
class FacebookAPI {
  async _request() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async request() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async publishPost() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async publishPhoto() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async uploadPhoto() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async publishReel() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async schedulePost() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async deletePost() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async updatePageInfo() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async createCampaign() { throw new Error('LIVE_TRANSPORT_NOT_IMPLEMENTED'); }
  async healthCheck() { return {mode:'OFFLINE_ONLY',network_checked:false,credential_checked:false,live_ready:false}; }
}
module.exports = FacebookAPI;
