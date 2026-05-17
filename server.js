require('dotenv').config();
const express = require('express');
const path    = require('path');
const app     = express();

// ── Trust Nginx reverse proxy headers ─────────────────────────────
app.set('trust proxy', 1);

// ── View engine: EJS ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files (CSS, JS, images/uploads) ────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────
const charactersRouter = require('./src/routes/characters');
app.use('/', charactersRouter);

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', { message: 'Trang không tồn tại (404).' });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server] Lỗi không xử lý được:', err);
  res.status(500).render('error', { message: 'Lỗi server nội bộ (500).' });
});

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  Nintendo Collection đang chạy tại cổng ${PORT}`);
  console.log(`📊  DB: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
