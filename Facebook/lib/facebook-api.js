const fs = require('fs');
const path = require('path');

// Helper to load .env without external dependencies
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

loadEnv();

const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
const PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const PAGE_ID = process.env.FB_PAGE_ID || '1213047995235499';
const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v20.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

class FacebookAPI {
  constructor() {
    this.appId = APP_ID;
    this.appSecret = APP_SECRET;
    this.pageToken = PAGE_TOKEN;
    this.pageId = PAGE_ID;
    this.baseUrl = BASE_URL;
  }

  // Health check for token and page
  async healthCheck() {
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${this.pageToken}&access_token=${this.appId}|${this.appSecret}`;
    const tokenRes = await fetch(debugUrl);
    const tokenData = await tokenRes.json();

    const pageRes = await fetch(`${this.baseUrl}/me?access_token=${this.pageToken}`);
    const pageData = await pageRes.json();

    return {
      tokenValid: tokenData?.data?.is_valid === true,
      tokenScopes: tokenData?.data?.scopes || [],
      expiresAt: tokenData?.data?.expires_at,
      pageName: pageData?.name,
      pageId: pageData?.id,
      rawTokenDebug: tokenData,
      rawPageInfo: pageData
    };
  }

  // Get current published feed
  async getFeed(limit = 10) {
    const url = `${this.baseUrl}/${this.pageId}/feed?fields=id,message,created_time,shares,reactions.summary(true),comments.summary(true)&limit=${limit}&access_token=${this.pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(`Meta Graph API Error: ${data.error.message}`);
    return data.data || [];
  }

  // Get scheduled (unpublished) posts
  async getScheduledPosts(limit = 100) {
    const url = `${this.baseUrl}/${this.pageId}/scheduled_posts?fields=id,message,created_time,scheduled_publish_time&limit=${limit}&access_token=${this.pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(`Meta Graph API Error: ${data.error.message}`);
    return data.data || [];
  }

  // Publish a post immediately
  async publishPostNow({ message, link }) {
    const url = `${this.baseUrl}/${this.pageId}/feed`;
    const params = new URLSearchParams({
      message,
      access_token: this.pageToken
    });
    if (link) params.append('link', link);

    const res = await fetch(url, {
      method: 'POST',
      body: params
    });
    const data = await res.json();
    if (data.error) throw new Error(`Meta Publish Error: ${data.error.message}`);
    return data;
  }

  // Schedule a post for future publishing (scheduled_publish_time must be Unix timestamp in seconds, between 10 mins and 75 days)
  async schedulePost({ message, link, scheduledPublishTime }) {
    const url = `${this.baseUrl}/${this.pageId}/feed`;
    const params = new URLSearchParams({
      message,
      published: 'false',
      scheduled_publish_time: Math.floor(scheduledPublishTime).toString(),
      access_token: this.pageToken
    });
    if (link) params.append('link', link);

    const res = await fetch(url, {
      method: 'POST',
      body: params
    });
    const data = await res.json();
    if (data.error) throw new Error(`Meta Schedule Error: ${data.error.message}`);
    return data;
  }

  // Publish a photo immediately with caption
  async publishPhotoNow({ caption, imagePath }) {
    const url = `${this.baseUrl}/${this.pageId}/photos`;
    const form = new FormData();
    const fileBuffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    form.append('source', new Blob([fileBuffer], { type: 'image/jpeg' }), filename);
    if (caption) form.append('caption', caption);
    form.append('access_token', this.pageToken);

    const res = await fetch(url, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data.error) throw new Error(`Meta Photo Publish Error: ${data.error.message}`);
    return data;
  }

  // Schedule a photo for future publishing
  async schedulePhoto({ caption, imagePath, scheduledPublishTime }) {
    const url = `${this.baseUrl}/${this.pageId}/photos`;
    const form = new FormData();
    const fileBuffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    form.append('source', new Blob([fileBuffer], { type: 'image/jpeg' }), filename);
    if (caption) form.append('caption', caption);
    form.append('published', 'false');
    form.append('scheduled_publish_time', Math.floor(scheduledPublishTime).toString());
    form.append('access_token', this.pageToken);

    const res = await fetch(url, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data.error) throw new Error(`Meta Photo Schedule Error: ${data.error.message}`);
    return data;
  }

  // Get Page Insights
  async getInsights() {
    try {
      const url = `${this.baseUrl}/${this.pageId}/insights?metric=page_impressions,page_post_engagements&period=days_28&access_token=${this.pageToken}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return { error: e.message };
    }
  }

  // --- INSTAGRAM GRAPH API INTEGRATION ---
  // Get linked Instagram Business Profile
  async getInstagramProfile() {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    const url = `${this.baseUrl}/${igId}?fields=id,username,name,biography,website,profile_picture_url,followers_count,follows_count,media_count&access_token=${this.pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(`Instagram API Error: ${data.error.message}`);
    return data;
  }

  // Get Instagram Media posts
  async getInstagramMedia(limit = 10) {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    const url = `${this.baseUrl}/${igId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(`Instagram API Error: ${data.error.message}`);
    return data.data || [];
  }

  // Step 1: Create Instagram Media Container
  async createInstagramMediaContainer({ imageUrl, caption }) {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    const url = `${this.baseUrl}/${igId}/media`;
    const params = new URLSearchParams({
      image_url: imageUrl,
      caption: caption || '',
      access_token: this.pageToken
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();
    if (data.error) throw new Error(`Instagram Container Error: ${data.error.message}`);
    return data; // returns { id: 'creation_id' }
  }

  // Step 2: Publish Instagram Media Container
  async publishInstagramMedia(creationId) {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    const url = `${this.baseUrl}/${igId}/media_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: this.pageToken
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();
    if (data.error) throw new Error(`Instagram Publish Error: ${data.error.message}`);
    return data; // returns { id: 'media_id' }
  }

  // Check Instagram Container Status (useful for video/reels rendering)
  async checkInstagramContainerStatus(creationId) {
    const url = `${this.baseUrl}/${creationId}?fields=status_code,status&access_token=${this.pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  // Create Instagram Carousel Container
  async createInstagramCarouselContainer({ childrenIds, caption }) {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    const url = `${this.baseUrl}/${igId}/media`;
    const params = new URLSearchParams({
      media_type: 'CAROUSEL',
      children: childrenIds.join(','),
      caption: caption || '',
      access_token: this.pageToken
    });

    const res = await fetch(url, { method: 'POST', body: params });
    const data = await res.json();
    if (data.error) throw new Error(`Instagram Carousel Error: ${data.error.message}`);
    return data;
  }

  // Create & Publish Instagram Reel (Video 9:16)
  async publishInstagramReel({ videoUrl, caption, shareToFeed = true }) {
    const igId = process.env.FB_IG_ID || '17841435718022746';
    console.log(`🎬 1. Khởi tạo container Instagram Reel cho: @${process.env.FB_IG_USERNAME || 'quannguyens403'}`);
    
    // 1. Create Reels Container
    const containerUrl = `${this.baseUrl}/${igId}/media`;
    const params = new URLSearchParams({
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption || '',
      share_to_feed: shareToFeed.toString(),
      access_token: this.pageToken
    });

    const cRes = await fetch(containerUrl, { method: 'POST', body: params });
    const cData = await cRes.json();
    if (cData.error) throw new Error(`Instagram Reel Container Error: ${cData.error.message}`);
    
    const creationId = cData.id;
    console.log(`   ✔️ Container ID: ${creationId}. Đang đợi Instagram xử lý video render...`);

    // 2. Poll container status until FINISHED
    let attempts = 0;
    while (attempts < 15) {
      await new Promise(r => setTimeout(r, 4000));
      attempts++;
      const statusData = await this.checkInstagramContainerStatus(creationId);
      console.log(`   ⏳ Kiểm tra tiến độ (${attempts}/15): ${statusData.status_code || statusData.status || 'PROCESSING'}`);
      if (statusData.status_code === 'FINISHED') {
        break;
      }
      if (statusData.status_code === 'ERROR') {
        throw new Error(`Instagram Video Processing Error: ${statusData.status}`);
      }
    }

    // 3. Publish
    console.log(`🚀 2. Xuất bản Instagram Reel lên feed...`);
    return await this.publishInstagramMedia(creationId);
  }

  // --- FACEBOOK VIDEO & REELS METHODS ---
  // Publish a video directly to Facebook Page
  async publishVideoNow({ videoPath, title, description }) {
    const url = `${this.baseUrl}/${this.pageId}/videos`;
    const form = new FormData();
    const fileBuffer = fs.readFileSync(videoPath);
    const filename = path.basename(videoPath);
    form.append('source', new Blob([fileBuffer], { type: 'video/mp4' }), filename);
    if (title) form.append('title', title);
    if (description) form.append('description', description);
    form.append('access_token', this.pageToken);

    const res = await fetch(url, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data.error) throw new Error(`Facebook Video Publish Error: ${data.error.message}`);
    return data;
  }

  // Schedule a video on Facebook Page
  async scheduleVideo({ videoPath, title, description, scheduledPublishTime }) {
    const url = `${this.baseUrl}/${this.pageId}/videos`;
    const form = new FormData();
    const fileBuffer = fs.readFileSync(videoPath);
    const filename = path.basename(videoPath);
    form.append('source', new Blob([fileBuffer], { type: 'video/mp4' }), filename);
    if (title) form.append('title', title);
    if (description) form.append('description', description);
    form.append('published', 'false');
    form.append('scheduled_publish_time', Math.floor(scheduledPublishTime).toString());
    form.append('access_token', this.pageToken);

    const res = await fetch(url, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data.error) throw new Error(`Facebook Video Schedule Error: ${data.error.message}`);
    return data;
  }
}

module.exports = new FacebookAPI();
