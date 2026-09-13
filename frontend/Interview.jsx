import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, AlertTriangle, Mic, MicOff, ChevronRight } from "lucide-react";
import { Chip } from "../common/Chip.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { TiltCard } from "../common/TiltCard.jsx";
import { PulseRing } from "../common/Visuals.jsx";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { STRINGS, SPEECH_LANG_CODES } from "../../constants/languages.js";
import { BASE_STEPS, AYUSH_STEP, RED_FLAG_KEYWORDS } from "../../constants/clinicalQuestions.js";
import { C } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: INTERVIEW
----------------------------------------------------------------*/
export function Interview({ mode, language, onComplete }) {
  const t = STRINGS[language];
  const steps = mode === "ayush" ? [...BASE_STEPS, AYUSH_STEP] : BASE_STEPS;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [typed, setTyped] = useState("");
  const [listening, setListening] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [micError, setMicError] = useState("");
  const [micSupported] = useState(() => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition));

  const recognitionRef = useRef(null);
  const advancingRef = useRef(false);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition may already be stopped
      }
    };
  }, []);

  const current = steps[idx];

  const checkRedFlag = useCallback((text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    const keywords = [...(RED_FLAG_KEYWORDS[language] || []), ...RED_FLAG_KEYWORDS.en];
    return keywords.some((k) => lower.includes(k.toLowerCase()));
  }, [language]);

  const submitAnswer = useCallback((overrideText) => {
    if (advancingRef.current) return;
    const answerText = (typeof overrideText === "string" ? overrideText : typed).trim();
    if (!answerText) return;
    advancingRef.current = true;

    const flaggedNow = checkRedFlag(answerText);
    const nextAnswers = [
      ...answers,
      { section: current.section, q: current.q.en, answer: answerText },
    ];
    const finalRedFlag = redFlag || flaggedNow;

    setAnswers(nextAnswers);
    setRedFlag(finalRedFlag);
    setListening(false);
    setTyped("");
    setMicError("");
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }

    if (idx + 1 < steps.length) {
      setIdx(idx + 1);
      advancingRef.current = false;
    } else {
      onComplete(nextAnswers, finalRedFlag);
    }
  }, [answers, checkRedFlag, current, idx, onComplete, redFlag, steps.length, typed]);

  const chooseOption = (option) => {
    setMicError("");
    submitAnswer(option);
  };

  const startMic = () => {
    setMicError("");

    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors
      }
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError(t.micUnsupported);
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = SPEECH_LANG_CODES[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setMicError("");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript) {
        setTyped(transcript);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicError(t.micDenied);
      } else if (event.error === "no-speech") {
        setMicError(t.micNoSpeech);
      } else {
        setMicError(t.micGenericError);
      }
    };
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      setMicError(t.micGenericError);
    }
  };

  const canSubmit = !!typed.trim();

  return (
    <KioskFrame step={idx + 1} totalSteps={steps.length} sectionLabel={current.sectionLabel[language]}>
      {redFlag && (
        <div className="flex items-start gap-2 mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: C.alertPale, border: `1.5px solid ${C.alert}`, color: C.alert }}>
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t.priorityTitle}</span> {t.priorityBody}
          </div>
        </div>
      )}

      <TiltCard className="p-6" maxTilt={4} radius={20}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`, transform: "translateZ(18px)" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div className="pt-1.5">
            <div className="text-xs font-semibold mb-1" style={{ color: C.primary }}>{current.sectionLabel[language] || current.section}</div>
            <p className="text-lg" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{current.q[language] || current.q.en}</p>
          </div>
        </div>

        {/* Answer options */}
        <div className="grid sm:grid-cols-2 gap-2.5 mt-6">
          {current.chips[language].map((option) => (
            <Chip key={option} onClick={() => chooseOption(option)}>
              {option}
            </Chip>
          ))}
        </div>

        {!micSupported && (
          <div className="mt-5 text-xs px-3 py-2 rounded-lg" style={{ background: C.accentPale, color: C.ink }}>
            {t.micUnsupported}
          </div>
        )}
        {micError && (
          <div className="mt-5 flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: C.alertPale, color: C.alert }}>
            <AlertTriangle size={14} className="shrink-0" /> {micError}
          </div>
        )}

        <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: `1px dashed ${C.line}` }}>
          <button
            type="button"
            onClick={startMic}
            className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: listening ? C.alert : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
              boxShadow: `0 8px 18px -6px ${listening ? "rgba(232,131,106,0.6)" : "rgba(63,224,197,0.5)"}`,
            }}
          >
            {listening && <PulseRing color={C.alert} />}
            {listening ? <MicOff size={18} color="#fff" style={{ position: "relative" }} /> : <Mic size={18} color="#06201C" style={{ position: "relative" }} />}
          </button>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitAnswer();
              }
            }}
            placeholder={listening ? t.micListening : t.micIdle}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)", color: C.ink }}
          />
          <PrimaryButton type="button" onClick={() => submitAnswer()} disabled={!canSubmit} icon={ChevronRight}>
            {t.nextBtn}
          </PrimaryButton>
        </div>
      </TiltCard>

      {answers.length > 0 && (
        <div className="mt-6 text-xs" style={{ color: C.inkSoft }}>{t.questionsAnswered(answers.length)}</div>
      )}
    </KioskFrame>
  );
}
