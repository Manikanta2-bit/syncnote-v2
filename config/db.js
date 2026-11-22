const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL.split("?")[0];

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        doc_id VARCHAR(255) PRIMARY KEY,
        content TEXT DEFAULT '',
        files JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Aiven PostgreSQL Connected & Table Ready");
  } catch (err) {
    console.error("❌ Aiven DB Error:", err);
  }
}

module.exports = { pool, initDB };
