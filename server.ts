import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality, GenerateContentResponse, GenerateVideosOperation, VideoGenerationReferenceType } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

dotenv.config();

// Initialize Firebase Admin
try {
  initializeApp({
    projectId: firebaseConfig.projectId
  });
} catch (e) {
  console.warn("Firebase Admin init warning:", e);
}
const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

// Stripe Webhook handler
app.post("/api/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.metadata?.uid;
      const plan = session.metadata?.planType as 'monthly' | 'yearly';
      
      if (uid && plan) {
        try {
          await adminDb.collection('users').doc(uid).update({
            plan: plan,
            subscriptionStatus: 'active',
            updatedAt: FieldValue.serverTimestamp()
          });
          console.log(`Updated plan for user ${uid} to ${plan}`);
        } catch (dbErr) {
          console.error("Error updating user plan in Firestore:", dbErr);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '50mb' }));

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is missing");
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is missing");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1500): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Handle both numeric status codes and string-based error statuses from SDK
      const status = error.status || error.code;
      const isTransient = 
        status === 503 || 
        status === 429 || 
        status === "UNAVAILABLE" ||
        status === "RESOURCE_EXHAUSTED" ||
        error.message?.includes("503") || 
        error.message?.includes("429") ||
        error.message?.includes("UNAVAILABLE") ||
        error.message?.includes("high demand");
      
      if (!isTransient || i === maxRetries - 1) throw error;
      
      console.warn(`Transient error (${status || 'unknown'}), retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw lastError;
}

const PRICE_IDS = {
  monthly: 'price_1TVOTlBMbxh6jv0CQyGrtMLL',
  yearly: 'price_1TVOYDBMbxh6jv0C3C9Y4AX9',
};

// Helper to check trial/subscription status securely
const checkAccess = async (userDataClient: any) => {
  if (!userDataClient || !userDataClient.uid) return { allowed: false, message: "Authentication required" };
  
  // Bypass access check for guest user
  if (userDataClient.uid === 'guest_user_free_mode') return { allowed: true };
  
  try {
    let docRef = adminDb.collection('users').doc(userDataClient.uid);
    let userDoc;
    
    try {
      userDoc = await docRef.get();
    } catch (e: any) {
      console.warn("Retrying with default Firestore database...", e.message);
      const defaultDb = getFirestore();
      userDoc = await defaultDb.collection('users').doc(userDataClient.uid).get();
    }

    if (!userDoc.exists) return { allowed: false, message: "User profile not found" };
    
    const userData = userDoc.data() as any;
    
    if (userData.plan === 'monthly' || userData.plan === 'yearly') return { allowed: true };
    
    const trialStart = userData.trialStart ? (userData.trialStart.toDate ? userData.trialStart.toDate() : new Date(userData.trialStart)) : null;
    if (!trialStart) return { allowed: false, message: "No active trial found" };
    
    const today = new Date();
    const trialDurationMs = 7 * 24 * 60 * 60 * 1000;
    const isTrialExpired = (today.getTime() - trialStart.getTime()) > trialDurationMs;
    
    if (isTrialExpired) {
      return { 
        allowed: false, 
        message: "Your 7-day free trial has expired. Please upgrade to a premium plan to continue using AI features.",
        expired: true
      };
    }
    
    return { allowed: true };
  } catch (err) {
    console.error("Access check error:", err);
    return { allowed: false, message: "Error verifying access" };
  }
};

// --- API ROUTES ---

// Stripe Checkout Session
app.post("/api/checkout/create-session", async (req, res) => {
  const { planType, customerEmail } = req.body;
  const priceId = (PRICE_IDS as any)[planType];

  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan selected. Choose 'monthly' or 'yearly'." });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      metadata: {
        uid: req.body.uid,
        planType: planType
      },
      success_url: `${req.headers.origin}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/settings?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Scout: Video Curation
app.post("/api/scout/videos", async (req, res) => {
  const { courseName, userData } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });
  
  try {
    const ai = getAI();
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    }));
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("Scout Videos Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
    const isBusy = error.message?.includes("503") || error.status === "UNAVAILABLE" || error.code === 503;
    
    if (isQuota) return res.status(429).json({ error: "Quota exceeded. Please try again in a bit." });
    if (isBusy) return res.status(503).json({ error: "The AI model is busy. Please try again shortly." });
    
    res.status(500).json({ error: "Failed to curate videos" });
  }
});

// Scout: Study Notes
app.post("/api/scout/notes", async (req, res) => {
  const { courseName, modulesList, userData } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are Scout, AI tutor for MAKE ME LEARN. Generate comprehensive study notes for:
      Course: ${courseName}
      Modules: ${modulesList}
      Format with: ## headings, bullet points, code examples where relevant,
      key terms in **bold**, and a 'Quick Recap' section at the end.
      Make it engaging and student-friendly.`,
    }));
    res.json({ notes: response.text });
  } catch (error: any) {
    console.error("Scout Notes Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
    const isBusy = error.message?.includes("503") || error.status === "UNAVAILABLE" || error.code === 503;
    
    if (isQuota) return res.status(429).json({ error: "Quota exceeded. Please try again in a bit." });
    if (isBusy) return res.status(503).json({ error: "The AI model is busy. Please try again shortly." });
    
    res.status(500).json({ error: "Failed to generate notes" });
  }
});

// Scout: Module Specific Notes
app.post("/api/scout/module-notes", async (req, res) => {
  const { courseName, moduleName, userData } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    }));
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Scout Module Notes Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
    const isBusy = error.message?.includes("503") || error.status === "UNAVAILABLE" || error.code === 503;
    
    if (isQuota) return res.status(429).json({ error: "Quota exceeded. Please try again in a bit." });
    if (isBusy) return res.status(503).json({ error: "The AI model is busy. Please try again shortly." });
    
    res.status(500).json({ error: "Failed to generate module details" });
  }
});

// Scout: Dashboard Widget
app.post("/api/scout/dashboard", async (req, res) => {
  const { userData } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a "Scout's Pick Today" for a learning dashboard.
      Choose ONE from these courses: ["python-dev: Python Dev", "ios-swift: iOS & Swift", "ai-art: AI Art & Design", "fullstack: Fullstack Web"].
      Return ONLY valid JSON:
      { 
        "courseId": "the-id", 
        "courseTitle": "Course Title", 
        "module": "A specific module from that course", 
        "tip": "A helpful concept tip", 
        "challenge": "A small practice challenge" 
      }`,
      config: {
        responseMimeType: "application/json",
      }
    }));
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Scout Dashboard Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
    const isBusy = error.message?.includes("503") || error.status === "UNAVAILABLE" || error.code === 503;
    
    if (isQuota) return res.status(429).json({ error: "Quota exceeded. Please try again in a bit." });
    if (isBusy) return res.status(503).json({ error: "The AI model is busy. Please try again shortly." });
    
    res.status(500).json({ error: "Failed to generate dashboard pick" });
  }
});

const SCOUT_PERSONA = `
You are Scout, the master Python Coding Coach, Software Engineer, and Debugging Specialist on the MAKE ME LEARN platform. 
Your core mission is to provide exceptional coding assistance, script analysis, and step-by-step debugging walkthroughs specifically tailored to the Python Dev course.

You MUST follow these strict teaching and tutoring rules:
1. CODE WALKTHROUGHS & DEBUGGING INSTRUCTION:
   - When a student asks for coding options, requests code, or poses a debugging issue, DO NOT simply dump raw solutions.
   - Explain exactly WHY errors happen (such as IndentationError, SyntaxError, TypeError, KeyError, IndexError, ValueError, NameError) in highly accessible terms.
   - Break down coding solutions into structured, highly scannable, step-by-step instructions.
   - All code examples should follow clean PEP-8 style guidelines with clear variable names and inline comments.
   - Use universal real-world metaphors to make abstract software mechanisms (like objects, dictionary keys, list operations, scopes, or decorators) extremely intuitive.

2. LEVERAGE USER COURSE progress CONTEXT:
   - Review the Current Learning Context (including username, enrolled tracks, and currentProgress of finished modules).
   - Dynamically adapt ground-level instruction to reflect what the student has already covered. If they have completed Python basics or variable operators under course 'python-dev', reference those milestones to build confidence (e.g., "Since you have tackled 'Variables and Basic Operators', let's combine that with this loop condition...").
   - Guide them gracefully towards the next milestones, referencing their completed curriculum.

3. FOSTER ACTIVE LEARNING & INQUISITIVENESS:
   - Conclude each response with an active check-for-understanding or a short interactive challenge question (e.g., "What do you think will happen if we pass an empty list to this function?") to spark critical thinking.
`;

// General Chat / AI Tutor
app.post("/api/chat", async (req, res) => {
  const { messages, context, userData } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `${SCOUT_PERSONA}\n\nCurrent Learning Context: ${JSON.stringify(context)}`,
        temperature: 0.7,
      }
    });

    // Simple one-off response for now, simplified for the endpoint
    const lastMessage = messages[messages.length - 1].content;
    const response = await withRetry(() => chat.sendMessage({ message: lastMessage }));
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    const isQuota = error.message?.includes("429") || error.status === "RESOURCE_EXHAUSTED" || error.code === 429;
    const isBusy = error.message?.includes("503") || error.status === "UNAVAILABLE" || error.code === 503;
    
    if (isQuota) {
      return res.status(429).json({ error: "Scout is a bit overwhelmed right now (Quota Exceeded). Please wait a moment or consider selecting a paid API key in Settings." });
    }
    if (isBusy) {
      return res.status(503).json({ error: "Scout is currently busy with high demand. Please try again in a few seconds." });
    }
    res.status(500).json({ error: "Chat failed" });
  }
});

// Image Generation
app.post("/api/generate-image", async (req, res) => {
  const { prompt, aspectRatio = "1:1", userData, model = "gemini-2.5-flash-image" } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    let base64 = "";

    if (model.startsWith("imagen-")) {
      const response = await withRetry(() => ai.models.generateImages({
        model: model,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        }
      }));
      if (response.generatedImages?.[0]?.image?.imageBytes) {
        base64 = response.generatedImages[0].image.imageBytes;
      }
    } else {
      const response = await withRetry(() => ai.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: "1K"
          }
        }
      }));
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64 = part.inlineData.data;
          break;
        }
      }
    }
    
    if (base64) {
      res.json({ imageUrl: `data:image/png;base64,${base64}` });
    } else {
      res.status(500).json({ error: "No image generated" });
    }
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    res.status(500).json({ error: error.message || "Image generation failed" });
  }
});

// Video Generation (Start)
app.post("/api/generate-video", async (req, res) => {
  const { prompt, aspectRatio = "16:9", userData, model = "veo-3.1-lite-generate-preview" } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const operation = await ai.models.generateVideos({
      model: model,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: model === 'veo-3.1-lite-generate-preview' ? '720p' : '1080p',
        aspectRatio: aspectRatio
      }
    });
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error("Video Gen Start Error:", error);
    res.status(500).json({ error: error.message || "Video generation failed to start" });
  }
});

// Video Status
app.post("/api/video-status", async (req, res) => {
  const { operationName } = req.body;
  try {
    const ai = getAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done });
  } catch (error) {
    console.error("Video Status Error:", error);
    res.status(500).json({ error: "Failed to check video status" });
  }
});

// Video Download/Proxy (Optimized to download as block stream array buffer)
app.post("/api/video-download", async (req, res) => {
  const { operationName } = req.body;
  try {
    const ai = getAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!uri) return res.status(404).json({ error: "Video not found or not ready" });

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
    });
    
    const arrayBuffer = await videoRes.arrayBuffer();
    res.setHeader('Content-Type', 'video/mp4');
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Video Download Error:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

// Music Generation
app.post("/api/generate-music", async (req, res) => {
  const { prompt, userData, model = "lyria-3-clip-preview" } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const response = await ai.models.generateContentStream({
      model: model,
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
  } catch (error: any) {
    console.error("Music Gen Error:", error);
    res.status(500).json({ error: error.message || "Music generation failed" });
  }
});

// Video Content Analysis
app.post("/api/analyze-video", async (req, res) => {
  const { videoData, mimeType, prompt, userData, model = "gemini-2.5-flash" } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const response = await withRetry(() => ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: videoData, mimeType } },
          { text: prompt || "Analyze the content of this video and summarize key takeaways." }
        ]
      }
    }));
    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Video Analysis Error:", error);
    res.status(500).json({ error: error.message || "Video analysis failed" });
  }
});

// Audio Transcription (Chirp 2 speech translation configuration included)
app.post("/api/transcribe", async (req, res) => {
  const { audioData, mimeType, userData, model = "gemini-2.5-flash" } = req.body;
  const access = await checkAccess(userData);
  if (!access.allowed) return res.status(403).json({ error: access.message, expired: (access as any).expired });

  try {
    const ai = getAI();
    const isChirp = model === "chirp-2-speech-to-text";
    const promptText = isChirp 
      ? "Transcribe the following audio precisely. Break it down using timestamps [MM:SS] and distinguish speakers (e.g., Speaker A, Speaker B) if there are multiple. Output with high academic and professional speech translation fidelity."
      : "Transcribe the following audio exactly.";

    const response = await withRetry(() => ai.models.generateContent({
      model: isChirp ? "gemini-2.5-flash" : model, 
      contents: {
        parts: [
          { inlineData: { data: audioData, mimeType } },
          { text: promptText }
        ]
      }
    }));
    res.json({ transcription: response.text });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: error.message || "Transcription failed" });
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
