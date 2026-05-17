export async function callScoutVideos(courseName: string) {
  const res = await fetch("/api/scout/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName }),
  });
  return res.json();
}

export async function callScoutNotes(courseName: string, modulesList: string[]) {
  const res = await fetch("/api/scout/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, modulesList }),
  });
  return res.json();
}

export async function callScoutModuleNotes(courseName: string, moduleName: string) {
  const res = await fetch("/api/scout/module-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, moduleName }),
  });
  return res.json();
}

export async function callScoutDashboard() {
  const res = await fetch("/api/scout/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function callAiChat(messages: { role: string; content: string }[], context: any) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });
  return res.json();
}

export async function generateAiImage(prompt: string, aspectRatio: string = "1:1") {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio }),
  });
  return res.json();
}

export async function generateAiVideo(prompt: string, aspectRatio: string = "16:9") {
  const res = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio }),
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

export async function generateAiMusic(prompt: string) {
  const res = await fetch("/api/generate-music", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}
