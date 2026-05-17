require('dotenv').config();
const { Pool } = require('pg');

// ================================================================
// Connection Pool — Dùng chung pool, không tạo kết nối mới mỗi req
// ================================================================
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10),
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max:                   10,   // tối đa 10 kết nối đồng thời
  idleTimeoutMillis:  30000,   // đóng kết nối nhàn rỗi sau 30s
  connectionTimeoutMillis: 3000, // timeout nếu không kết nối được sau 3s
});

pool.on('error', (err) => {
  console.error('[Pool] Lỗi không mong đợi từ idle client:', err.message);
});

// ================================================================
// Retry Logic — Xử lý failover HA (Patroni thay Leader ~2-5 giây)
// ================================================================
const MAX_RETRIES   = 3;
const RETRY_DELAY   = 2000; // ms
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function query(text, params) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (err) {
      lastError = err;

      // Các lỗi có thể xảy ra trong quá trình Failover DB
      const isTransient =
        err.code === 'ECONNREFUSED'   ||  // DB bị từ chối kết nối
        err.code === 'ECONNRESET'     ||  // Kết nối bị reset
        err.code === 'ETIMEDOUT'      ||  // Timeout
        err.code === '57P01'          ||  // admin_shutdown (Patroni failover)
        err.code === '08006'          ||  // connection_failure
        (err.message || '').includes('read-only')             ||
        (err.message || '').includes('cannot execute')        ||
        (err.message || '').includes('Connection terminated') ||
        (err.message || '').includes('terminating connection');

      if (isTransient && attempt < MAX_RETRIES) {
        console.warn(
          `[DB] Lần thử ${attempt}/${MAX_RETRIES} thất bại: "${err.message}". ` +
          `Chờ ${RETRY_DELAY}ms rồi thử lại...`
        );
        await sleep(RETRY_DELAY);
      } else {
        console.error(`[DB] Query thất bại sau ${attempt} lần thử: ${err.message}`);
        break;
      }
    }
  }

  throw lastError; // Ném lỗi sau 3 lần retry
}

module.exports = { query, pool };
