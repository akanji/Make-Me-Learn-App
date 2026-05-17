import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality, GenerateContentResponse, GenerateVideosOperation, VideoGenerationReferenceType } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- API ROUTES ---

// Scout: Video Curation
app.post("/api/scout/videos", async (req, res) => {
  const { courseName } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Scout, an AI tutor for MAKE ME LEARN. For the course: ${courseName}, suggest 3 high-quality YouTube tutorial videos. Return ONLY valid JSON: [{ "title": "...", "youtubeId": "...", "duration": "...", "reason": "..." }] Only return real, existing YouTube video IDs. Focus on beginner-to-advanced progression.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              youtubeId: { type: Type.STRING },
              duration: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["title", "youtubeId", "duration", "reason"]
          }
        }
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("Scout Videos Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED";
    res.status(isQuota ? 429 : 500).json({ error: isQuota ? "Quota exceeded. Try again in a bit." : "Failed to curate videos" });
  }
});

// Scout: Study Notes
app.post("/api/scout/notes", async (req, res) => {
  const { courseName, modulesList } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Scout, AI tutor for MAKE ME LEARN. Generate comprehensive study notes for:
      Course: ${courseName}
      Modules: ${modulesList}
      Format with: ## headings, bullet points, code examples where relevant,
      key terms in **bold**, and a 'Quick Recap' section at the end.
      Make it engaging and student-friendly.`,
    });
    res.json({ notes: response.text });
  } catch (error: any) {
    console.error("Scout Notes Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED";
    res.status(isQuota ? 429 : 500).json({ error: isQuota ? "Quota exceeded. Try again in a bit." : "Failed to generate notes" });
  }
});

// Scout: Module Specific Notes
app.post("/api/scout/module-notes", async (req, res) => {
  const { courseName, moduleName } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Scout, AI tutor for MAKE ME LEARN. Generate a comprehensive module study guide for:
      Course: ${courseName}
      Module: ${moduleName}
      
      Return ONLY valid JSON with the following structure:
      {
        "title": "${moduleName}",
        "aiNotes": "Detailed study notes in Markdown format",
        "scoutMission": "A specific mission/task for the student (scout theme)",
        "tutorFocus": "What the student should focus on (tutoring advice)",
        "labs": "Step-by-step practical lab exercise",
        "videos": [{ "title": "Educational Video Title", "url": "YouTube URL" }],
        "onlineLinks": [{ "title": "Resource Name", "url": "Resource URL" }]
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Scout Module Notes Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED";
    res.status(isQuota ? 429 : 500).json({ error: isQuota ? "Quota exceeded. Try again in a bit." : "Failed to generate module details" });
  }
});

// Scout: Dashboard Widget
app.post("/api/scout/dashboard", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a "Scout's Pick Today" for a learning dashboard. Return JSON with:
      { "module": "Recommended module to review", "tip": "A concept tip", "challenge": "A small practice challenge" }`,
      config: {
        responseMimeType: "application/json",
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Scout Dashboard Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED";
    res.status(isQuota ? 429 : 500).json({ error: isQuota ? "Quota exceeded. Try again in a bit." : "Failed to generate dashboard pick" });
  }
});

// General Chat / AI Tutor
app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body;
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are Scout, the AI learning assistant for MAKE ME LEARN Platform. You help students with Python Dev, Web Design, Mobile Dev, Game Design, Graphics Design, and UI/UX Design. Context: ${JSON.stringify(context)}. Be concise, educational, and encouraging. Use code blocks for code examples.`,
      }
    });

    // Simple one-off response for now, simplified for the endpoint
    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMessage });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    if (error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED") {
      return res.status(429).json({ error: "Scout is a bit overwhelmed right now (Quota Exceeded). Please wait a moment or consider selecting a paid API key in Settings." });
    }
    res.status(500).json({ error: "Chat failed" });
  }
});

// Image Generation
app.post("/api/generate-image", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: "1K"
        }
      }
    });
    
    let base64 = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64 = part.inlineData.data;
        break;
      }
    }
    
    if (base64) {
      res.json({ imageUrl: `data:image/png;base64,${base64}` });
    } else {
      res.status(500).json({ error: "No image generated" });
    }
  } catch (error) {
    console.error("Image Gen Error:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Video Generation (Start)
app.post("/api/generate-video", async (req, res) => {
  const { prompt, aspectRatio = "16:9" } = req.body;
  try {
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });
    res.json({ operationName: operation.name });
  } catch (error) {
    console.error("Video Gen Start Error:", error);
    res.status(500).json({ error: "Video generation failed to start" });
  }
});

// Video Status
app.post("/api/video-status", async (req, res) => {
  const { operationName } = req.body;
  try {
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done });
  } catch (error) {
    console.error("Video Status Error:", error);
    res.status(500).json({ error: "Failed to check video status" });
  }
});

// Video Download/Proxy
app.post("/api/video-download", async (req, res) => {
  const { operationName } = req.body;
  try {
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!uri) return res.status(404).json({ error: "Video not found or not ready" });

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
    });
    
    res.setHeader('Content-Type', 'video/mp4');
    const reader = videoRes.body?.getReader();
    if (!reader) return res.status(500).json({ error: "Stream error" });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error("Video Download Error:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

// Music Generation
app.post("/api/generate-music", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO]
      }
    });

    let audioBase64 = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
      }
    }

    res.json({ audioData: audioBase64, mimeType });
  } catch (error) {
    console.error("Music Gen Error:", error);
    res.status(500).json({ error: "Music generation failed" });
  }
});

// Video Content Analysis
app.post("/api/analyze-video", async (req, res) => {
  const { videoData, mimeType, prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: videoData, mimeType } },
          { text: prompt || "Analyze the content of this video and summarize key takeaways." }
        ]
      }
    });
    res.json({ analysis: response.text });
  } catch (error) {
    console.error("Video Analysis Error:", error);
    res.status(500).json({ error: "Video analysis failed" });
  }
});

// Audio Transcription
app.post("/api/transcribe", async (req, res) => {
  const { audioData, mimeType } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
          { inlineData: { data: audioData, mimeType } },
          { text: "Transcribe the following audio exactly." }
        ]
      }
    });
    res.json({ transcription: response.text });
  } catch (error) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
