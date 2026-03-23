import express from "express";

const app = express();

/* ✅ FORCE CORS */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

/* ✅ ROOT */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ✅ GENERATE AD */
app.post("/generate-ad", (req, res) => {
  const { product, audience } = req.body;

  const result = `🔥 Introducing ${product}! Perfect for ${audience}. Grow your business today 🚀`;

  res.json({ result });
});

/* ✅ ANALYZE SALES */
app.post("/analyze", (req, res) => {
  const { salesData } = req.body;

  const totalSales = salesData.reduce((s, i) => s + i.sales, 0);

  const bestProduct = salesData.reduce((a, b) =>
    a.sales > b.sales ? a : b
  ).name;

  const worstProduct = salesData.reduce((a, b) =>
    a.sales < b.sales ? a : b
  ).name;

  res.json({ totalSales, bestProduct, worstProduct });
});

/* ✅ CHAT (REAL AI - GROQ) */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You help small businesses grow." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data?.choices?.[0]?.message?.content || "AI error"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

/* ✅ PORT */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});