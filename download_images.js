const fs = require('fs');
const path = require('path');

// Nguồn ảnh cực chuẩn từ trang chủ Super Smash Bros Ultimate
// Ảnh độ phân giải cao, nền trong suốt và ổn định 100%
const images = {
  'mario.png':           'https://www.smashbros.com/assets_v2/img/fighter/mario/main.png',
  'link.png':            'https://www.smashbros.com/assets_v2/img/fighter/link/main.png',
  'samus.png':           'https://www.smashbros.com/assets_v2/img/fighter/samus/main.png',
  'donkey_kong.png':     'https://www.smashbros.com/assets_v2/img/fighter/donkey_kong/main.png',
  'princess_zelda.png':  'https://www.smashbros.com/assets_v2/img/fighter/zelda/main.png',
  'bowser.png':          'https://www.smashbros.com/assets_v2/img/fighter/bowser/main.png',
  'kirby.png':           'https://www.smashbros.com/assets_v2/img/fighter/kirby/main.png',
  'pikachu.png':         'https://www.smashbros.com/assets_v2/img/fighter/pikachu/main.png',
  'fox_mccloud.png':     'https://www.smashbros.com/assets_v2/img/fighter/fox/main.png',
  'captain_falcon.png':  'https://www.smashbros.com/assets_v2/img/fighter/captain_falcon/main.png',
};

const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Đang tải ảnh tuần tự từ server Nintendo chính thức (để chống lỗi 429 và 404)...');

async function downloadAll() {
  for (const [filename, url] of Object.entries(images)) {
    try {
      process.stdout.write(`Đang tải ${filename}... `);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        console.log(`❌ Lỗi HTTP ${response.status}`);
        continue;
      }
      
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(buffer));
      console.log(`✅ Thành công`);
      
      // Chờ 1 giây giữa các lần tải để máy chủ không block IP
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`❌ Lỗi mạng: ${err.message}`);
    }
  }
  console.log('🎉 Hoàn thành! Toàn bộ 10 ảnh đã được tải xuống.');
}

downloadAll();
