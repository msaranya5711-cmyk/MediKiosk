import { useState } from "react";
import { ShieldCheck, CheckCircle2, Volume2, ChevronRight } from "lucide-react";
import { STRINGS } from "../../constants/languages.js";
import { C } from "../../constants/theme.js";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { GoogleSignInButton, GoogleErrorNotice } from "../common/GoogleAuth.jsx";
import { exchangeGoogleCredential, startPatientSession } from "../../services/authService.js";

/* ---------------------------------------------------------------
   SCREEN: CONSENT
----------------------------------------------------------------*/
export function Consent({ onNext, language }) {
  const t = STRINGS[language];
  const [method, setMethod] = useState("manual"); // "manual" | "google"
  const [abha, setAbha] = useState("");
  const [googleIdentity, setGoogleIdentity] = useState(null); // { email, name, accessToken }
  const [googleError, setGoogleError] = useState("");
  const [checks, setChecks] = useState({ store: false, share: false, audio: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allChecked = checks.store && checks.share;
  // Patients are kept simple: once they're identified (manual ID typed, or
  // already signed in with Google) and they've consented, they're ready.
  const canContinue = allChecked && (method === "google" ? !!googleIdentity : abha.length >= 4);

  const handleGoogleCredential = async (credential) => {
    setGoogleError("");
    try {
      const data = await exchangeGoogleCredential(credential, "patient");
      setGoogleIdentity({ email: data.user.email, name: data.user.name, accessToken: data.accessToken });
    } catch (err) {
      setGoogleError(err.message);
    }
  };

  const handleContinue = async () => {
    if (!canContinue || submitting) return;

    // Google already gave us a verified session token — nothing more to do
    if (method === "google") {
      onNext(googleIdentity.accessToken);
      return;
    }

    // Manual ABHA entry: get a lightweight, rate-limited kiosk session token
    setSubmitting(true);
    setError("");
    try {
      const { ok, data } = await startPatientSession(abha);
      if (!ok) {
        setError(data.error || "Couldn't start your session. Please try again.");
        return;
      }
      onNext(data.accessToken);
    } catch {
      onNext(`local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KioskFrame hideProgress>
      <div className="max-w-lg mx-auto">
        <ShieldCheck size={28} color={C.primary} />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{t.consentTitle}</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>{t.consentSub}</p>

        {googleIdentity ? (
          <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: C.successPale, color: C.success }}>
            <CheckCircle2 size={16} /> Signed in as {googleIdentity.email}
          </div>
        ) : (
          <>
            <div className="flex gap-1 p-1 rounded-full mt-6" style={{ background: "rgba(0,0,0,0.28)" }}>
              {[
                { id: "manual", label: t.abhaLabel },
                { id: "google", label: "Continue with Google" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className="flex-1 px-3 py-2 rounded-full text-xs font-semibold"
                  style={{ background: method === opt.id ? "#fff" : "transparent", color: method === opt.id ? "#06201C" : C.inkSoft }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {method === "manual" ? (
              <>
                <input
                  value={abha}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9-]/g, "").slice(0, 19);
                    setAbha(cleaned);
                  }}
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="XX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none mt-3"
                  style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
                />
                <button className="text-xs font-semibold mt-2" style={{ color: C.primary }}>{t.newPatient}</button>
              </>
            ) : (
              <div className="mt-4">
                <GoogleSignInButton onCredential={handleGoogleCredential} label="continue_with" />
                <GoogleErrorNotice error={googleError} />
                <p className="text-xs mt-2" style={{ color: C.inkSoft }}>
                  You'll pick your Google account and sign in on Google's own screen — this kiosk never sees your password.
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 space-y-3">
          {[
            { key: "store", text: t.consentStore },
            { key: "share", text: t.consentShare },
            { key: "audio", text: t.consentAudio },
          ].map((c) => (
            <label key={c.key} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer" style={{ border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}>
              <input type="checkbox" checked={checks[c.key]} onChange={(e) => setChecks({ ...checks, [c.key]: e.target.checked })} className="mt-0.5" />
              <span className="text-sm" style={{ color: C.ink }}>{c.text}</span>
              {c.key === "audio" && <Volume2 size={16} color={C.inkSoft} className="ml-auto shrink-0" />}
            </label>
          ))}
        </div>

        {error && (
          <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-4" style={{ background: C.alertPale, color: C.alert }}>
            {error}
          </div>
        )}

        <div className="mt-8">
          <PrimaryButton onClick={handleContinue} icon={ChevronRight} full disabled={!canContinue || submitting}>
            {submitting ? "Starting…" : t.agreeBtn}
          </PrimaryButton>
        </div>
      </div>
    </KioskFrame>
  );
}
