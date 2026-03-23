import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API = "https://smartops-production-a689.up.railway.app";

export default function App() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 Ask me anything about your business." },
  ]);
  const [input, setInput] = useState("");

  // ✅ AD GENERATOR
  const generateAd = async () => {
    try {
      const res = await fetch(`${API}/generate-ad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, audience }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILE UPLOAD
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const rows = event.target.result.split("\n").slice(1);
      const parsed = rows.map((row) => {
        const [name, sales] = row.split(",");
        return { name, sales: Number(sales) };
      });
      setSalesData(parsed);
    };

    reader.readAsText(file);
  };

  // ✅ ANALYZE
  const analyzeSales = async () => {
    const res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ salesData }),
    });

    const data = await res.json();
    setAnalysis(data);
  };

  // ✅ INSIGHTS
  const getInsights = async () => {
    const res = await fetch(`${API}/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ salesData }),
    });

    const data = await res.json();
    setInsights(data.insights);
  };

  // ✅ CHAT
  const sendMessage = async () => {
    if (!input) return;

    const newMsgs = [...messages, { role: "user", text: input }];
    setMessages(newMsgs);

    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...newMsgs, { role: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>SmartOps</h1>

      {/* GENERATOR */}
      <h2>Ad Generator</h2>
      <input
        placeholder="Product"
        onChange={(e) => setProduct(e.target.value)}
      />
      <input
        placeholder="Audience"
        onChange={(e) => setAudience(e.target.value)}
      />
      <button onClick={generateAd}>Generate</button>
      <p>{result}</p>

      {/* SALES */}
      <h2>Sales Analytics</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={analyzeSales}>Analyze</button>

      {analysis && (
        <>
          <p>Total: {analysis.totalSales}</p>
          <p>Best: {analysis.bestProduct}</p>
          <p>Worst: {analysis.worstProduct}</p>

          <BarChart width={500} height={250} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#6366f1" />
          </BarChart>

          <button onClick={getInsights}>Get Insights</button>
          <p>{insights}</p>
        </>
      )}

      {/* CHAT */}
      <h2>Business Chat</h2>
      <div>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}