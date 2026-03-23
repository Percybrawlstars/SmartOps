import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// GENERATE AD (FIXED)
app.post("/generate-ad", (req, res) => {
  try {
    const { product, audience } = req.body;

    const result = `🔥 Introducing ${product}! Perfect for ${audience}. Boost your business today 🚀`;

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ad generation failed" });
  }
});

// ANALYZE
app.post("/analyze", (req, res) => {
  try {
    const { salesData } = req.body;

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
    res.status(500).json({ error: "Analysis failed" });
  }
});

// INSIGHTS
app.post("/insights", (req, res) => {
  res.json({
    insights:
      "Focus on best-selling products and improve low-performing ones.",
  });
});

// CHAT (NO OLLAMA)
app.post("/chat", (req, res) => {
  try {
    const { message } = req.body;

    res.json({
      reply: `💡 Business Tip: Improve marketing, pricing, and customer experience.\n\nYou said: "${message}"`,
    });
  } catch (err) {
    res.status(500).json({ error: "Chat failed" });
  }
});

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});