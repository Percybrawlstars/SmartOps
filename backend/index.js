import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// GENERATE AD
app.post("/generate-ad", (req, res) => {
  try {
    const { product, audience } = req.body;

    if (!product || !audience) {
      return res.status(400).json({ error: "Missing data" });
    }

    const result = `🔥 Introducing ${product}! Perfect for ${audience}.`;

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ANALYZE
app.post("/analyze", (req, res) => {
  try {
    const { salesData } = req.body;

    if (!salesData || salesData.length === 0) {
      return res.status(400).json({ error: "No data" });
    }

    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);

    const bestProduct = salesData.reduce((a, b) =>
      a.sales > b.sales ? a : b
    ).name;

    const worstProduct = salesData.reduce((a, b) =>
      a.sales < b.sales ? a : b
    ).name;

    res.json({ totalSales, bestProduct, worstProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// INSIGHTS
app.post("/insights", (req, res) => {
  res.json({
    insights: "Focus on top products and improve weak ones.",
  });
});

// CHAT
app.post("/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message" });
    }

    res.json({
      reply: `💡 Tip: Improve marketing & customer experience.\n\nYou asked: "${message}"`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat error" });
  }
});

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});