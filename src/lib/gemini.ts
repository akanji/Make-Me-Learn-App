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

export async function generateAiImage(prompt: string, userData: any, aspectRatio: string = "1:1", model: string = "gemini-2.5-flash-image") {
  return safeFetchJson("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData, model }),
  });
}

export async function generateAiVideo(prompt: string, userData: any, aspectRatio: string = "16:9", model: string = "veo-3.1-lite-generate-preview") {
  return safeFetchJson("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio, userData, model }),
  });
}

export async function checkVideoStatus(operationName: string) {
  return safeFetchJson("/api/video-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });
}

export async function downloadVideo(operationName: string): Promise<Blob> {
  const res = await fetch("/api/video-download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationName }),
  });
  if (!res.ok) {
    throw new Error(`Failed to download completed video resource: ${res.statusText}`);
  }
  return res.blob();
}

export async function generateAiMusic(prompt: string, userData: any, model: string = "lyria-3-clip-preview") {
  return safeFetchJson("/api/generate-music", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userData, model }),
  });
}

export async function analyzeVideo(videoData: string, mimeType: string, userData: any, prompt?: string, model: string = "gemini-2.5-flash") {
  return safeFetchJson("/api/analyze-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoData, mimeType, userData, prompt, model }),
  });
}

export async function transcribeAudio(audioData: string, mimeType: string, userData: any, model: string = "gemini-2.5-flash") {
  return safeFetchJson("/api/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioData, mimeType, userData, model }),
  });
}

export async function callScoutCodeAudit(code: string, moduleName: string, courseTitle: string, userData: any) {
  return safeFetchJson("/api/scout/code-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, moduleName, courseTitle, userData }),
  });
}
