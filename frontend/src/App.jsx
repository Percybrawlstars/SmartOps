import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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

  // AD GENERATOR
  const generateAd = async () => {
    const res = await fetch("http://smartops-production-a689.up.railway.app/generate-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, audience }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  // FILE UPLOAD
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

  // ANALYZE
  const analyzeSales = async () => {
    const res = await fetch("http://smartops-production-a689.up.railway.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesData }),
    });
    const data = await res.json();
    setAnalysis(data);
  };

  // INSIGHTS
  const getInsights = async () => {
    const res = await fetch("http://smartops-production-a689.up.railway.app/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesData }),
    });
    const data = await res.json();
    setInsights(data.insights);
  };

  // CHAT
  const sendMessage = async () => {
    if (!input) return;

    const newMsgs = [...messages, { role: "user", text: input }];
    setMessages(newMsgs);

    const res = await fetch("http://smartops-production-a689.up.railway.app/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...newMsgs, { role: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] p-5">
        <img src="/logo.png" className="h-8 max-w-[120px]" />

        <div className="mt-6 text-gray-400 space-y-2">
          <div className="text-white">Home</div>
          <div>Analytics</div>
          <div>Tools</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">

        {/* AD GENERATOR */}
        <div className="bg-[#111827] p-5 rounded">
          <h2 className="mb-2">Ad Generator</h2>

          <input
            placeholder="Product"
            className="w-full p-2 bg-gray-800 mb-2"
            onChange={(e) => setProduct(e.target.value)}
          />

          <input
            placeholder="Audience"
            className="w-full p-2 bg-gray-800 mb-2"
            onChange={(e) => setAudience(e.target.value)}
          />

          <button
            onClick={generateAd}
            className="bg-blue-600 w-full p-2 rounded"
          >
            Generate
          </button>

          <p className="mt-3 text-sm">{result}</p>
        </div>

        {/* SALES ANALYTICS */}
        <div className="bg-[#111827] p-5 rounded">
          <h2 className="mb-2">Sales Analytics</h2>

          <input type="file" onChange={handleFileUpload} />

          <button
            onClick={analyzeSales}
            className="bg-purple-600 px-4 py-2 rounded mt-2"
          >
            Analyze
          </button>

          {analysis && (
            <div className="mt-4">
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

              <button
                onClick={getInsights}
                className="bg-green-600 px-4 py-2 rounded mt-4"
              >
                Get Insights
              </button>

              <p className="mt-2 text-gray-300">{insights}</p>
            </div>
          )}
        </div>

        {/* CHAT */}
        <div className="bg-[#111827] p-5 rounded">
          <h2 className="mb-2">Business Chat</h2>

          <div className="h-40 overflow-y-auto mb-2">
            {messages.map((msg, i) => (
              <div key={i}>{msg.text}</div>
            ))}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 bg-gray-800"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 mt-2 p-2 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}