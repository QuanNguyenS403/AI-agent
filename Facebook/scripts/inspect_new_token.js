const appId = '3341130182741925';
const appSecret = '39d833a2e9c1f1e53e146296d8fd84aa';
const newToken = 'EAAvevX2wz6UBSZAnZAaeEIzjMvShjCO3kjCj8laoSm4iQHmByzxlIKa81XyELe9TORkDyWvQ8t93BQkvdxEynRVJKyElihqqxspY5jANZABgH3ZCvhzOBHyMsmrG4KGHAOG2RgBd7wyeE97mW5eloHh1ayECW0QhDrpeSTpbZCuWdmi9jStQjYCiUPK1gdJZABP93grwWBcMpdRPSA78d1QZCpooflyD4yj4qdoahCxznAZD';

async function check() {
  const dRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${newToken}&access_token=${appId}|${appSecret}`);
  const dData = await dRes.json();
  console.log('--- DEBUG TOKEN ---');
  console.log(JSON.stringify(dData, null, 2));

  const meRes = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${newToken}`);
  const meData = await meRes.json();
  console.log('--- ME INFO ---');
  console.log(JSON.stringify(meData, null, 2));

  // If token is short-lived, exchange it
  if (dData?.data?.expires_at > 0) {
    console.log('⏳ Token có hạn dùng, tiến hành nâng cấp lên Long-lived / Permanent token...');
    const exUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${newToken}`;
    const exRes = await fetch(exUrl);
    const exData = await exRes.json();
    console.log('Exchanged token result:', exData);
  }
}

check().catch(console.error);
