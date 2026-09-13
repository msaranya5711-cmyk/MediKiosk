import { useState, useRef, useEffect } from "react";
import { Lock, Send } from "lucide-react";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SHARED: CHAT PANEL (E2EE)
   Renders one conversation thread. Used both by the patient-facing
   Doctors screen and the staff inbox in PhysicianView — same crypto,
   same wire format, just a different peer.
----------------------------------------------------------------*/
export function ChatPanel({ thread, peerName, onSend, wsError }) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.length]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    try {
      await onSend(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden" style={{ ...glassStyle(), height: 480 }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: C.primaryPale, color: C.primary }}>
          {(peerName || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: C.ink }}>{peerName || "Conversation"}</div>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: C.success }}>
            <Lock size={10} /> End-to-end encrypted
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {(!thread || thread.length === 0) && (
          <div className="text-xs text-center mt-10" style={{ color: C.inkSoft }}>No messages yet — say hello.</div>
        )}
        {(thread || []).map((m, i) => (
          <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[75%] px-3.5 py-2 rounded-2xl text-sm"
              style={{
                background: m.mine ? `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})` : "rgba(255,255,255,0.08)",
                color: m.mine ? "#06201C" : m.error ? C.alert : C.ink,
                borderBottomRightRadius: m.mine ? 4 : 16,
                borderBottomLeftRadius: m.mine ? 16 : 4,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {wsError && (
        <div className="px-5 py-1.5 text-[11px]" style={{ color: C.alert }}>{wsError}</div>
      )}

      <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.line}` }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${C.line}`, color: C.ink }}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`, opacity: !draft.trim() || sending ? 0.5 : 1 }}
        >
          <Send size={16} color="#06201C" />
        </button>
      </div>
    </div>
  );
}
