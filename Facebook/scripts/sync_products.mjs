import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_REPO_DIR = 'd:/Pijima/pijama';
const WEBSITE_PRODUCTS_PATH = 'file:///d:/Pijima/pijama/src/data/products.js';
const CATALOG_PATH = path.resolve(__dirname, '../config/offer_catalog.json');
const BRAND_PROFILE_PATH = path.resolve(__dirname, '../config/brand_profile.yaml');

export async function syncProducts() {
  console.log('====================================================');
  console.log('🔄 ĐỒNG BỘ DỮ LIỆU SẢN PHẨM TỪ GITHUB REPO (QuanNguyenS403/pijama.git)');
  console.log('====================================================\n');

  try {
    // 0. Pull latest code from GitHub repository
    try {
      console.log('📡 Đang cập nhật commit mới nhất từ https://github.com/QuanNguyenS403/pijama.git...');
      const gitOutput = execSync(`git -C "${LOCAL_REPO_DIR}" pull origin main`, { encoding: 'utf8' });
      console.log(`✔️ Trạng thái Git: ${gitOutput.trim()}`);
    } catch (gitErr) {
      console.warn('⚠️ Cảnh báo: Không thể pull từ GitHub (tiếp tục với dữ liệu local hiện tại):', gitErr.message);
    }

    // 1. Import dynamic products from website source code
    const websiteModule = await import(WEBSITE_PRODUCTS_PATH + '?t=' + Date.now());
    const liveProducts = websiteModule.products || [];
    console.log(`📦 Tìm thấy ${liveProducts.length} sản phẩm đang chạy thực tế trên website:`);

    liveProducts.forEach((p, idx) => {
      console.log(`   [${idx + 1}] ${p.name} (${p.subtitle || ''}) - Giá: ${p.price ? p.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}`);
    });

    // 2. Read existing offer_catalog.json
    let currentCatalog = { products: [] };
    if (fs.existsSync(CATALOG_PATH)) {
      currentCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    }

    const previousIds = new Set((currentCatalog.products || []).map(p => p.id));
    const liveIds = new Set(liveProducts.map(p => p.id));

    // Detect additions and removals
    const addedProducts = liveProducts.filter(p => !previousIds.has(p.id));
    const removedProducts = (currentCatalog.products || []).filter(p => !liveIds.has(p.id));

    console.log('\n📊 KẾT QUẢ ĐỐI SOÁT:');
    if (addedProducts.length > 0) {
      console.log(`   ✨ Sản phẩm MỚI THÊM: ${addedProducts.map(p => p.name).join(', ')}`);
    } else {
      console.log('   ✔️ Không có sản phẩm mới thêm.');
    }

    if (removedProducts.length > 0) {
      console.log(`   ⚠️ Sản phẩm ĐÃ LOẠI BỎ: ${removedProducts.map(p => p.name).join(', ')} (Sẽ ngưng đăng bài)`);
    } else {
      console.log('   ✔️ Không có sản phẩm bị loại bỏ.');
    }

    // 3. Transform live products into standardized catalog
    const formattedProducts = liveProducts.map(p => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle || '',
      badge: p.badge || '',
      color: p.fengShui?.color || (p.colors && p.colors[0]?.label) || '',
      element: p.fengShui?.element || '',
      element_good_for: p.fengShui?.goodFor || [],
      energy_note: p.fengShui?.energyNote || '',
      fabric: p.fabric || '',
      fabric_specs: p.fabricDetail || '',
      design_highlights: (p.highlights || []).join(' · '),
      sizes: p.sizes || ['S', 'M'],
      price: p.price,
      original_price: p.originalPrice || null,
      discount: p.discount || 0,
      tags: p.tags || []
    }));

    // Update catalog file
    const updatedCatalog = {
      ...currentCatalog,
      currency: 'VND',
      collection: 'Thu Đông 2026',
      product_line: '10PM Pijama',
      last_synced_at: new Date().toISOString(),
      products: formattedProducts
    };

    fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf8');
    console.log('\n✅ Đã cập nhật file: config/offer_catalog.json');
    console.log('🎯 Hệ thống tự động đảm bảo nội dung đăng bài Facebook luôn đồng bộ 100% với danh mục website!');
    console.log('====================================================\n');

    return {
      total: liveProducts.length,
      added: addedProducts.length,
      removed: removedProducts.length,
      products: formattedProducts
    };
  } catch (err) {
    console.error('❌ Lỗi khi đồng bộ sản phẩm:', err.message);
    throw err;
  }
}

// If run directly via node scripts/sync_products.mjs
if (process.argv[1] && process.argv[1].endsWith('sync_products.mjs')) {
  syncProducts().catch(console.error);
}
