import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ✅ FORCE CORS HEADERS (THIS FIXES EVERYTHING)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// OPTIONAL (still fine to keep)
app.use(cors());

app.use(express.json());

// ✅ HANDLE PREFLIGHT REQUESTS
app.options("*", cors());

// ✅ BODY PARSER
app.use(express.json());


// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ✅ AD GENERATOR
app.post("/generate-ad", (req, res) => {
  try {
    const { product, audience } = req.body;

    if (!product || !audience) {
      return res.status(400).json({ error: "Missing product or audience" });
    }

    const result = `🔥 Introducing ${product}!\nPerfect for ${audience}.\nBoost your business today 🚀`;

    res.json({ result });

  } catch (err) {
    console.error("AD ERROR:", err);
    res.status(500).json({ error: "Ad generation failed" });
  }
});


// ✅ SALES ANALYSIS
app.post("/analyze", (req, res) => {
  try {
    const { salesData } = req.body;

    if (!salesData || salesData.length === 0) {
      return res.status(400).json({ error: "No sales data provided" });
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
    console.error("ANALYSIS ERROR:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});


// ✅ INSIGHTS
app.post("/insights", (req, res) => {
  try {
    res.json({
      insights:
        "Focus on top-performing products and improve low-performing ones using better marketing strategies."
    });
  } catch (err) {
    console.error("INSIGHTS ERROR:", err);
    res.status(500).json({ error: "Insights failed" });
  }
});


// ✅ GROQ AI CHATBOT
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI business assistant helping small businesses grow."
          },
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("GROQ ERROR:", data);
      return res.status(500).json({ error: "AI response failed" });
    }

    const reply = data.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});


// ✅ PORT (CRITICAL FOR RAILWAY)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});