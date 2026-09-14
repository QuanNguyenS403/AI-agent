'use strict';
const runtime = require('../config/runtime.json');
function planDrafts({count=3}={}) {
  if (!Number.isInteger(count) || count < 1 || count > runtime.max_draft_slots) throw new Error('INVALID_DRAFT_COUNT');
  const topics = ['Thiết kế và cách chọn size','Câu hỏi về preorder và giao hàng','Câu chuyện thẩm mỹ thương hiệu'];
  return Array.from({length:count},(_,i)=>({
    content_id:'draft-'+(i+1),status:'DRAFT',topic:topics[i%topics.length],
    hypothesis:'Giải đáp một câu hỏi cụ thể của khách trước khi mua.',
    claims:[],media:null,caption:null,qa_status:'NOT_RUN',approval_status:'NOT_REQUESTED',
    ready_for_publish:false,blocked_by:['CONFIRMED_TRUTH','ASSET_RIGHTS','REAL_MEDIA','INDEPENDENT_QA','LIVE_EXECUTOR']
  }));
}
module.exports = {planDrafts,posts30Days:Object.freeze([])};
