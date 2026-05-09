const pool = require('./db');

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ DB connected:', res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

test();