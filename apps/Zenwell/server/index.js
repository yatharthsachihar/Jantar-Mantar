const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const productRoutes = require("./routes/products");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

app.get("/", (req, res) => {
  res.json({ message: "Zenwell API is running" });
});

app.use("/api/products", productRoutes);
app.use('/api/enquiries', require('./routes/enquiries'));

async function startServer() {
  try {
    await db();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();
