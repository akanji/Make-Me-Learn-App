async function safeFetchJson(url: string, options: RequestInit) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    
    if (!res.ok) {
      // Try to parse error as JSON, fallback to text
      let errorData;
      if (contentType && contentType.includes("application/json")) {
        errorData = await res.json();
      } else {
        errorData = { error: await res.text() };
      }
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }
    
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return await res.text();
  } catch (err: any) {
    console.error(`Api Call Error (${url}):`, err);
    throw err;
  }
}

export async function callScoutVideos(courseName: string, userData: any) {
  return safeFetchJson("/api/scout/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, userData }),
  });
}

export async function callScoutNotes(courseName: string, modulesList: string[], userData: any) {
  return safeFetchJson("/api/scout/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, modulesList, userData }),
  });
}

export async function callScoutModuleNotes(courseName: string, moduleName: string, userData: any) {
  return safeFetchJson("/api/scout/module-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseName, moduleName, userData }),
  });
}

export async function callScoutDashboard(userData: any) {
  return safeFetchJson("/api/scout/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userData }),
  });
}

export async function callAiChat(messages: { role: string; content: string }[], context: any, userData: any) {
  return safeFetchJson("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context, userData }),
  });
}

export async function generateAiImage(prompt: string, userData: any, aspectRatio: string = "1:1") {
  return safeFetchJson("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData }),
  });
}

export async function generateAiVideo(prompt: string, userData: any, aspectRatio: string = "16:9") {
  return safeFetchJson("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData }),
  });
}

export async function checkVideoStatus(operationName: string) {
  return safeFetchJson("/api/video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });
}

export async function generateAiMusic(prompt: string, userData: any) {
  return safeFetchJson("/api/generate-music", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userData }),
  });
}

export async function analyzeVideo(videoData: string, mimeType: string, userData: any, prompt?: string) {
  return safeFetchJson("/api/analyze-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoData, mimeType, userData, prompt }),
  });
}

export async function transcribeAudio(audioData: string, mimeType: string, userData: any) {
  return safeFetchJson("/api/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioData, mimeType, userData }),
  });
}
