require("dotenv").config();

const express = require("express");
const path = require("path");
const { initDB } = require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

/* ---------------------- Aiven DB ---------------------- */
initDB();

/* ---------------------- Middleware ---------------------- */
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------------- Static Files ---------------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------------- Routes ---------------------- */
app.use("/upload", uploadRoutes);
app.use("/doc", documentRoutes);

/* ---------------------- Home ---------------------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------------------- Workspace ---------------------- */
app.get("/:workspace", (req, res, next) => {
  if (req.params.workspace.includes(".")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------------------- 404 ---------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ---------------------- Start Server ---------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 SyncNote Server Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("=================================");
});