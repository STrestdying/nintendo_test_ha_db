const express = require('express');
const router  = express.Router();
const { query } = require('../db/pool');

// ── GET / ─ Trang chính: bộ sưu tập nhân vật ──────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM nintendo_characters ORDER BY debut_year ASC, name ASC'
    );
    res.render('index', { characters: result.rows });
  } catch (err) {
    console.error('[Route /] Lỗi lấy dữ liệu:', err.message);
    res.status(503).render('error', {
      message: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.',
    });
  }
});

// ── GET /api/characters ─ JSON API (dùng cho AJAX / mở rộng sau) ──
router.get('/api/characters', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM nintendo_characters ORDER BY debut_year ASC'
    );
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (err) {
    console.error('[API] Lỗi:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database tạm thời không khả dụng. Vui lòng thử lại.',
    });
  }
});

module.exports = router;
