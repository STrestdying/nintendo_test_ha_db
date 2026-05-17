const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  'mario.png':           'https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png',
  'link.png':            'https://upload.wikimedia.org/wikipedia/en/0/0c/Link_Legend_of_Zelda.png',
  'samus.png':           'https://upload.wikimedia.org/wikipedia/en/7/77/Samus_Aran_Metroid_Dread.png',
  'donkey_kong.png':     'https://upload.wikimedia.org/wikipedia/en/1/1d/Donkey_Kong_in_Mario_Kart_8.png',
  'princess_zelda.png':  'https://upload.wikimedia.org/wikipedia/en/2/25/Princess_Zelda_SSBU.png',
  'bowser.png':          'https://upload.wikimedia.org/wikipedia/en/9/92/Bowser_Stock_Art_2021.png',
  'kirby.png':           'https://upload.wikimedia.org/wikipedia/en/2/2d/SSU_Kirby_artwork.png',
  'pikachu.png':         'https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png',
  'fox_mccloud.png':     'https://upload.wikimedia.org/wikipedia/en/5/52/Fox_McCloud.png',
  'captain_falcon.png':  'https://upload.wikimedia.org/wikipedia/en/1/15/Captain_Falcon.png',
};

const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('Đang tải ảnh từ Wikipedia...');

Object.entries(images).forEach(([filename, url]) => {
  const filepath = path.join(uploadsDir, filename);
  
  const options = {
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  };

  const download = (downloadUrl) => {
    https.get(downloadUrl, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Xử lý khi Wikipedia chuyển hướng link (Redirect)
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, downloadUrl).href;
        }
        download(redirectUrl);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Thành công: ${filename}`);
        });
      } else {
        console.log(`❌ Lỗi ${filename}: HTTP ${res.statusCode}`);
      }
    }).on('error', (err) => {
      console.log(`❌ Lỗi network ${filename}:`, err.message);
    });
  };

  download(url);
});
