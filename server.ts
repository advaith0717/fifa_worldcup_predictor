import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client lazy-loaded
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI analysis features will run in offline simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/analyze-match", async (req, res) => {
  const { homeTeam, awayTeam, homeElo, awayElo, homeForm, awayForm, eloDiff, drawProb, homeWinProb, awayWinProb, h2hText, matchStage } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Return a beautiful mocked analysis if key is missing
      return res.json({
        analysis: `### 🔮 Belo Offline Tactical Insights

**${homeTeam} vs ${awayTeam}** (${matchStage || "Group Stage"})

Due to running in sandbox mode without an active API key, Belo has calculated this preview using historical profiles:

*   **The ELO Differential (${Math.abs(Math.round(eloDiff))} pts):** ${eloDiff > 0 ? homeTeam : awayTeam} holds a technical advantage in structural depth. Expect them to dictate the tempo.
*   **Form & Momentum:** ${homeTeam} enters with a form win-rate of **${Math.round(homeForm * 100)}%** vs **${Math.round(awayForm * 100)}%** for ${awayTeam}.
*   **Tactical Blueprint:** ${homeTeam} will likely seek to break down ${awayTeam}'s defensive low block. Belo predicts a high-intensity mid-pitch engagement.

*To unlock real-time Deep-Reasoning AI analysis, add your GEMINI_API_KEY to the Secrets panel!*`
      });
    }

    const prompt = `You are Belo, a highly sophisticated, tactical, and slightly quirky AI football analyst built for the 2026 World Cup.
Analyze this upcoming match:
- Stage: ${matchStage || "Group Stage"}
- Home/Team A: ${homeTeam} (ELO: ${Math.round(homeElo)}, Form WR: ${Math.round(homeForm * 100)}%)
- Away/Team B: ${awayTeam} (ELO: ${Math.round(awayElo)}, Form WR: ${Math.round(awayForm * 100)}%)
- Prediction Probabilities:
  * ${homeTeam} Win: ${Math.round(homeWinProb * 100)}%
  * Draw: ${Math.round(drawProb * 100)}%
  * ${awayTeam} Win: ${Math.round(awayWinProb * 100)}%
- Head-to-Head Context: ${h2hText || "Limited recent head-to-head records."}

Write a short, professional but charismatic tactical breakdown (around 150-200 words). Make it sound like a smart, non-corporate football expert explaining what the model sees (e.g. form, ELO gap, tactical matchups, penalty shootout likelihood if it's a knockout match). Use clean Markdown formatting with clear bullet points. Do not mention system details, files, or that you are an LLM.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate tactical analysis", details: error.message });
  }
});

// Serve frontend assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Belo Server listening on port ${PORT}`);
  });
}

start();
