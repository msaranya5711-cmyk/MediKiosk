import { useState, useRef, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Send, Mic, MicOff } from "lucide-react";
import { PulseRing } from "../common/Visuals.jsx";
import { STRINGS, SPEECH_LANG_CODES } from "../../constants/languages.js";
import { localAssistantReply } from "../../constants/assistantPrompts.js";
import { API_BASE_URL } from "../../constants/config.js";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: AI VOICE ASSISTANT
----------------------------------------------------------------*/
export function AIVoiceChat({ language, patientToken, onRecordEntry, onSuggestedSpecialty }) {
  const t = STRINGS[language];
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(false);
  const recognitionRef = useRef(null);
  const endRef = useRef(null);
  const turnCountRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = SPEECH_LANG_CODES[language] || "en-IN";
    window.speechSynthesis.speak(utter);
  };

  const sendToAssistant = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { text: trimmed, mine: true, at: Date.now() }]);
    setDraft("");
    setInterimText("");
    setThinking(true);
    setError("");
    const history = messages.slice(-12).map((m) => ({ role: m.mine ? "user" : "assistant", text: m.text }));
    onRecordEntry?.({ section: "AI Voice Consult", q: "Patient", answer: trimmed });
    try {
      const res = await fetch(`${API_BASE_URL}/claude/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${patientToken}` },
        body: JSON.stringify({ message: trimmed, history, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The assistant is unavailable right now.");
        return;
      }

      setMessages((prev) => [...prev, { text: data.reply, mine: false, at: Date.now() }]);
      speak(data.reply);
      setOffline(false);
      if (data.redFlag) setRedFlag(true);
      if (data.suggestedSpecialty) onSuggestedSpecialty?.(data.suggestedSpecialty);
    } catch {
      setOffline(true);
      const { reply, redFlag: flaggedNow, suggestedSpecialty } = localAssistantReply(
        trimmed,
        language,
        turnCountRef.current
      );
      turnCountRef.current += 1;
      setMessages((prev) => [...prev, { text: reply, mine: false, at: Date.now() }]);
      speak(reply);
      if (flaggedNow) setRedFlag(true);
      if (suggestedSpecialty) onSuggestedSpecialty?.(suggestedSpecialty);
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.micUnsupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_CODES[language] || "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };
    recognition.onresult = (e) => {
      let finalText = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (finalText) {
        setDraft((prev) => (prev ? `${prev} ${finalText}`.trim() : finalText.trim()));
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };
    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError(t.micDenied);
      else if (e.error === "no-speech") setError(t.micNoSpeech);
      else setError(t.micGenericError);
    };
    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError(t.micGenericError);
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="mk-screen max-w-lg mx-auto px-6 py-10 flex flex-col items-center">
      <ShieldCheck size={26} color={C.primary} />
      <h2 className="text-2xl mt-4 text-center" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>
        Talk to the AI assistant
      </h2>
      <p className="text-sm mt-2 text-center" style={{ color: C.inkSoft }}>
        Speak in your own language. This helps build your history for the doctor — it can't diagnose or prescribe anything.
      </p>
      {offline && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: C.warning }}>
          <AlertTriangle size={12} /> Running in offline mode — replies are basic until the connection is back.
        </div>
      )}

      {redFlag && (
        <div
          className="flex items-start gap-2 mt-5 px-4 py-3 rounded-xl text-sm font-semibold w-full"
          style={{ background: C.alertPale, color: C.alert }}
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          This may need urgent attention. Please alert kiosk staff or go to the emergency desk now.
        </div>
      )}

      <div className="w-full mt-6 rounded-3xl flex flex-col" style={{ ...glassStyle(), height: 340 }}>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-xs text-center mt-16" style={{ color: C.inkSoft }}>
              Tap the mic below and start speaking.
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] px-3.5 py-2 rounded-2xl text-sm"
                style={{
                  background: m.mine
                    ? `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`
                    : "rgba(255,255,255,0.08)",
                  color: m.mine ? "#06201C" : C.ink,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && <div className="text-xs" style={{ color: C.inkSoft }}>Thinking…</div>}
          <div ref={endRef} />
        </div>
      </div>

      {error && (
        <div
          className="text-xs font-semibold px-3 py-2 rounded-lg mt-4 w-full text-center"
          style={{ background: C.alertPale, color: C.alert }}
        >
          {error}
        </div>
      )}

      <div className="w-full mt-4 rounded-2xl p-2 pl-4 flex items-center gap-2" style={glassStyle()}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendToAssistant(draft);
            }
          }}
          placeholder={interimText || "Type your message…"}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: C.ink }}
        />
        <button
          type="button"
          onClick={() => sendToAssistant(draft)}
          disabled={!draft.trim() || thinking}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
            opacity: draft.trim() && !thinking ? 1 : 0.45,
            cursor: draft.trim() && !thinking ? "pointer" : "not-allowed",
          }}
        >
          <Send size={15} color="#06201C" />
        </button>
      </div>

      <button
        onClick={listening ? stopListening : startListening}
        className="mt-8 rounded-full flex items-center justify-center relative"
        style={{
          width: 132,
          height: 132,
          background: listening ? C.alert : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
          boxShadow: `0 20px 50px -14px ${listening ? "rgba(232,131,106,0.7)" : "rgba(63,224,197,0.6)"}`,
        }}
      >
        {listening && <PulseRing color={C.alert} />}
        {listening ? <MicOff size={48} color="#fff" /> : <Mic size={48} color="#06201C" />}
      </button>
      <div className="text-xs mt-3" style={{ color: C.inkSoft }}>
        {listening ? "Listening… tap to stop" : "Tap to speak"}
      </div>
    </div>
  );
}
