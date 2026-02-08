const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const os = require("os");

const db = require("./db"); // ✅ shared DB connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* =====================================================
   SYSTEM INFO (HOSTNAME + IP)
===================================================== */
app.get("/api/system-info", (req, res) => {
  const hostname = os.hostname();

  const ip =
    Object.values(os.networkInterfaces())
      .flat()
      .find(i => i.family === "IPv4" && !i.internal)?.address || "Unknown";

  res.json({ hostname, ip });
});

/* =====================================================
   ADMIN LOGIN
===================================================== */
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const r = await db.query(
      "SELECT id, name FROM admins WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (r.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ adminName: r.rows[0].name });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET ADMINS
===================================================== */
app.get("/api/admins", async (req, res) => {
  try {
    const r = await db.query("SELECT id, name FROM admins ORDER BY name");
    res.json(r.rows);
  } catch (err) {
    console.error("FETCH ADMINS ERROR:", err.message);
    res.status(500).json([]);
  }
});

/* =====================================================
   CREATE COMPLAINT (USER)
===================================================== */
app.post("/api/complaints", async (req, res) => {
  const { category, title, description, hostname, ip } = req.body;

  try {
    await db.query(
      `
      INSERT INTO complaints
      (category, title, description, hostname, ip, status)
      VALUES ($1, $2, $3, $4, $5, 'OPEN')
      `,
      [category, title, description, hostname, ip]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("CREATE COMPLAINT ERROR:", err.message);
    res.status(500).json({ success: false });
  }
});

/* =====================================================
   GET COMPLAINTS (ADMIN)
===================================================== */
app.get("/api/complaints", async (req, res) => {
  try {
    const r = await db.query(`
      SELECT
        c.id,
        c.category,
        c.title,
        c.description,
        c.hostname,
        c.ip,
        c.status,
        a.name AS assigned_admin
      FROM complaints c
      LEFT JOIN admins a ON c.assigned_admin = a.id
      ORDER BY c.id DESC
    `);

    res.json(r.rows);

  } catch (err) {
    console.error("FETCH COMPLAINTS ERROR:", err.message);
    res.status(500).json([]);
  }
});

/* =====================================================
   ASSIGN COMPLAINT TO ADMIN
===================================================== */
app.post("/api/complaints/assign", async (req, res) => {
  const { id, adminId } = req.body;

  try {
    await db.query(
      "UPDATE complaints SET assigned_admin=$1 WHERE id=$2",
      [adminId, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("ASSIGN ERROR:", err.message);
    res.status(500).json({ success: false });
  }
});

/* =====================================================
   UPDATE COMPLAINT STATUS
===================================================== */
app.post("/api/complaints/status", async (req, res) => {
  const { id, status } = req.body;

  try {
    await db.query(
      "UPDATE complaints SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err.message);
    res.status(500).json({ success: false });
  }
});

/* =====================================================
   START SERVER
===================================================== */
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
