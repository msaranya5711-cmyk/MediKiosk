import { API_BASE_URL } from "../constants/config.js";

/* ---------------------------------------------------------------
   SECURE SUMMARY CALL — Module C: structured summary generation
   Calls our own backend proxy (routes/claude.js) instead of the
   Anthropic API directly. The backend attaches the real system
   prompt, holds the API key, rate-limits, and enforces a session.
----------------------------------------------------------------*/
export async function generateClinicalSummary({ answers, mode, docs, redFlag, patientToken }) {
  const transcript = answers.map((a) => `${a.section}: Q: ${a.q} A: ${a.answer}`).join("\n");
  const docText = docs.map((d) => `${d.label} (${d.date}): ${d.fields?.map((f) => `${f.k} — ${f.v}`).join("; ") || ""}`).join("\n");

  const prompt = `PATIENT CONVERSATION TRANSCRIPT:\n${transcript}\n\nDIGITIZED PRIOR DOCUMENTS:\n${docText || "None uploaded."}\n\nRED FLAG DETECTED: ${redFlag ? "YES — mentioned symptoms consistent with a possible emergency." : "No"}\n\nMODE: ${mode}`;

  // Cap what we send — mirrors the backend's own limit so we fail fast
  // locally instead of round-tripping a request we know will be rejected.
  if (prompt.length > 8000) {
    return fallbackSummary({ answers, mode, docs, redFlag });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/claude/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(patientToken ? { Authorization: `Bearer ${patientToken}` } : {}),
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`backend responded ${response.status}`);
    const data = await response.json();
    if (!data.summary) throw new Error("empty response");
    return data.summary;
  } catch {
    // Any failure (network, timeout, backend down, rate-limited) falls
    // back to a locally-built summary so the kiosk flow never hard-stops.
    return fallbackSummary({ answers, mode, docs, redFlag });
  } finally {
    clearTimeout(timeout);
  }
}

export function fallbackSummary({ answers, mode, docs }) {
  const get = (section) => answers.filter((a) => a.section === section).map((a) => a.answer).join(", ");
  const lines = [
    `CHIEF COMPLAINT\n${get("Chief Complaint") || "Nil contributory."}`,
    `HISTORY OF PRESENT ILLNESS\n${get("History of Present Illness") || "Nil contributory."}`,
    `PAST MEDICAL & SURGICAL HISTORY\n${get("Past Medical History")}, ${get("Past Surgical History")}`,
    `DRUG & ALLERGY HISTORY\n${get("Drug & Allergy History") || "Nil contributory."}`,
    `FAMILY HISTORY\n${get("Family History") || "Nil contributory."}`,
    `PERSONAL HISTORY\n${get("Personal History") || "Nil contributory."}`,
    `REVIEW OF SYSTEMS\n${get("Review of Systems") || "Nil contributory."}`,
    `PRIOR INVESTIGATIONS SUMMARY\n${docs.map((d) => `${d.label} (${d.date})`).join("; ") || "No prior documents uploaded."}`,
  ];
  if (mode === "ayush") lines.push(`AYURVEDIC ASSESSMENT\n${get("Prakriti Assessment (Ayurveda)") || "Nil contributory."}`);
  return lines.join("\n\n");
}
