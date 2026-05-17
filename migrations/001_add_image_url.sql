-- ================================================================
-- Migration 001: Thêm cột image_url vào bảng nintendo_characters
-- Chạy 1 lần duy nhất trên PostgreSQL server
-- Kết nối vào: psql -h 192.168.1.5 -p 5432 -U postgres -d postgres
-- ================================================================

-- Bước 1: Thêm cột image_url nếu chưa có
ALTER TABLE nintendo_characters
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Bước 2: Cập nhật URL ảnh cho từng nhân vật
UPDATE nintendo_characters SET image_url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png'
  WHERE name = 'Mario';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/zelda_gamepedia_en/images/4/4e/BotW_Link_Render.png/revision/latest/scale-to-width-down/300?cb=20170423190635'
  WHERE name = 'Link';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/metroid/images/d/d9/Samus_Aran_Other_M.png/revision/latest/scale-to-width-down/300?cb=20100903172509'
  WHERE name = 'Samus Aran';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/donkeykong/images/7/7d/Donkey_Kong_Country_Tropical_Freeze_artwork.png/revision/latest/scale-to-width-down/300?cb=20140123130735'
  WHERE name = 'Donkey Kong';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/zelda_gamepedia_en/images/6/6e/BotW_Zelda_Render.png/revision/latest/scale-to-width-down/300?cb=20170423190635'
  WHERE name = 'Princess Zelda';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/mario/images/d/d5/Bowser_NSMBU_render.png/revision/latest/scale-to-width-down/300?cb=20120924135614'
  WHERE name = 'Bowser';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/kirby/images/5/54/KRtDL_Kirby.png/revision/latest/scale-to-width-down/300?cb=20111110105610'
  WHERE name = 'Kirby';

UPDATE nintendo_characters SET image_url = 'https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png'
  WHERE name = 'Pikachu';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/starfox/images/9/9b/FoxMcCloudSSBU.png/revision/latest/scale-to-width-down/300?cb=20180613171508'
  WHERE name = 'Fox McCloud';

UPDATE nintendo_characters SET image_url = 'https://static.wikia.nocookie.net/fzero/images/8/8c/CptFalcon.png/revision/latest/scale-to-width-down/300?cb=20130914023213'
  WHERE name = 'Captain Falcon';

-- Xác nhận kết quả
SELECT character_id, name, image_url FROM nintendo_characters ORDER BY character_id;
