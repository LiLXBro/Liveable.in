const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Render/Neon usually
  },
  max: 1,                    // Serverless: keep only 1 connection per function instance
  idleTimeoutMillis: 0,      // Release connections immediately when idle
  connectionTimeoutMillis: 5000, // Fail fast if connection cannot be established
});

module.exports = pool;
