const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "belajar_express",
  waitForConnections: true,
  connectionLimit: 20,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ Terhubung ke MySQL — database "belajar_express"`);
    conn.release();
  } catch (err) {
    console.error("❌ Gagal terhubung ke MySQL:", err.message);
    console.error('   Pastikan Laragon sudah running & database "belajar_express" sudah ada.');
  }
}

testConnection();

module.exports = pool;