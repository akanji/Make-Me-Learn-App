export async function callScoutVideos(courseName: string, userData: any) {
  const res = await fetch("/api/scout/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, userData }),
  });
  return res.json();
}

export async function callScoutNotes(courseName: string, modulesList: string[], userData: any) {
  const res = await fetch("/api/scout/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, modulesList, userData }),
  });
  return res.json();
}

export async function callScoutModuleNotes(courseName: string, moduleName: string, userData: any) {
  const res = await fetch("/api/scout/module-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, moduleName, userData }),
  });
  return res.json();
}

export async function callScoutDashboard(userData: any) {
  const res = await fetch("/api/scout/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userData }),
  });
  return res.json();
}

export async function callAiChat(messages: { role: string; content: string }[], context: any, userData: any) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context, userData }),
  });
  return res.json();
}

export async function generateAiImage(prompt: string, userData: any, aspectRatio: string = "1:1") {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData }),
  });
  return res.json();
}

export async function generateAiVideo(prompt: string, userData: any, aspectRatio: string = "16:9") {
  const res = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData }),
  });
  return res.json();
}

export async function checkVideoStatus(operationName: string) {
  const res = await fetch("/api/video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });
  return res.json();
}

export async function generateAiMusic(prompt: string, userData: any) {
  const res = await fetch("/api/generate-music", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userData }),
  });
  return res.json();
}

export async function analyzeVideo(videoData: string, mimeType: string, userData: any, prompt?: string) {
  const res = await fetch("/api/analyze-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoData, mimeType, userData, prompt }),
  });
  return res.json();
}

export async function transcribeAudio(audioData: string, mimeType: string, userData: any) {
  const res = await fetch("/api/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioData, mimeType, userData }),
  });
  return res.json();
}
