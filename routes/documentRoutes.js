const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.get("/:id", async (req, res) => {
  const docId = req.params.id;

  try {
    let result = await pool.query(
      "SELECT doc_id, content, files FROM documents WHERE doc_id = $1",
      [docId]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        "INSERT INTO documents (doc_id, content, files) VALUES ($1, $2, $3::jsonb) RETURNING doc_id, content, files",
        [docId, "", JSON.stringify([])]
      );
    }

    const row = result.rows[0];
    res.json({
      docId: row.doc_id,
      content: row.content,
      files: row.files || []
    });
  } catch (err) {
    console.error("Read Error:", err);
    res.status(500).json({
      error: "Read failed"
    });
  }
});

router.post("/:id", async (req, res) => {
  const docId = req.params.id;
  const content = req.body.content || "";
  const files = JSON.stringify(req.body.files || []);

  try {
    const result = await pool.query(
      `INSERT INTO documents (doc_id, content, files, updated_at)
       VALUES ($1, $2, $3::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (doc_id)
       DO UPDATE SET
         content = EXCLUDED.content,
         files = EXCLUDED.files,
         updated_at = CURRENT_TIMESTAMP
       RETURNING doc_id, content, files`,
      [docId, content, files]
    );

    const row = result.rows[0];
    res.json({
      docId: row.doc_id,
      content: row.content,
      files: row.files || []
    });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({
      error: "Save failed"
    });
  }
});

module.exports = router;
