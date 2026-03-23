import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartOps Backend Running 🚀");
});


// ===============================
// AD GENERATOR
// ===============================
app.post("/generate-ad", async (req, res) => {
  const { product, audience } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Create a high converting ad for ${product} targeting ${audience}`,
        stream: false,
      }),
    });

    const data = await response.json();

    res.json({ result: data.response || "No response generated" });

  } catch (err) {
    console.error("AD ERROR:", err);
    res.status(500).json({ error: "Ad generation failed" });
  }
});


// ===============================
// ANALYTICS
// ===============================
app.post("/analyze", (req, res) => {
  const { salesData } = req.body;

  if (!salesData || salesData.length === 0) {
    return res.json({ totalSales: 0 });
  }

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);

  const sorted = [...salesData].sort((a, b) => b.sales - a.sales);

  res.json({
    totalSales,
    bestProduct: sorted[0].name,
    worstProduct: sorted[sorted.length - 1].name,
  });
});


// ===============================
// INSIGHTS
// ===============================
app.post("/insights", async (req, res) => {
  const { salesData } = req.body;

  try {
    const summary = salesData.map(s => `${s.name}:${s.sales}`).join(",");

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Give short business insights based on: ${summary}`,
        stream: false,
      }),
    });

    const data = await response.json();

    res.json({ insights: data.response || "No insights generated" });

  } catch (err) {
    console.error("INSIGHTS ERROR:", err);
    res.status(500).json({ error: "Insights failed" });
  }
});


// ===============================
// CHATBOT (FIXED)
// ===============================
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `You are a business expert. Answer clearly:\n\n${message}`,
        stream: false,
      }),
    });

    const data = await response.json();

    console.log("CHAT:", data);

    res.json({ reply: data.response || "No reply from AI" });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});


// ===============================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});