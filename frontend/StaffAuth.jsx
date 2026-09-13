import { useState, useEffect } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { PrimaryButton } from "../common/Buttons.jsx";
import { GoogleSignInButton, GoogleErrorNotice } from "../common/GoogleAuth.jsx";
import { C } from "../../constants/theme.js";
import { exchangeGoogleCredential, loginStaff, signupStaff } from "../../services/authService.js";

/* ---------------------------------------------------------------
   SCREEN: STAFF AUTH GATE
   Staff need an account before they can log in, so this toggles
   between sign-up and sign-in. Both support Google as a shortcut.
----------------------------------------------------------------*/
export function StaffAuthGate({ onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  return mode === "login" ? (
    <StaffLogin onSuccess={onSuccess} onSwitchToSignup={() => setMode("signup")} />
  ) : (
    <StaffSignup onSuccess={onSuccess} onSwitchToLogin={() => setMode("login")} />
  );
}

export function StaffSignup({ onSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const passwordsMatch = !confirmPassword || password === confirmPassword;
  const canSubmit = name && staffId && password.length >= 8 && password === confirmPassword && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    try {
      const { ok, data } = await signupStaff({ name, staffId, password, confirmPassword });
      if (!ok) {
        setError(data.error || "Sign-up failed. Please try again.");
        return;
      }
      onSuccess(data.accessToken);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleError("");
    try {
      const data = await exchangeGoogleCredential(credential, "staff");
      onSuccess(data.accessToken);
    } catch (err) {
      setGoogleError(err.message);
    }
  };

  return (
    <div className="mk-screen max-w-sm mx-auto px-6 py-16">
      <ShieldCheck size={28} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Create a staff account</h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>Sign up once, then sign in whenever you need the kiosk or physician view.</p>

      <div className="mt-6">
        <GoogleSignInButton onCredential={handleGoogleCredential} label="signup_with" />
        <GoogleErrorNotice error={googleError} />
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: C.line }} />
        <span className="text-xs" style={{ color: C.inkSoft }}>or sign up with a staff ID</span>
        <div className="flex-1 h-px" style={{ background: C.line }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 100))}
          placeholder="Full name"
          autoComplete="name"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
        />
        <input
          value={staffId}
          onChange={(e) => setStaffId(e.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 64))}
          placeholder="Choose a staff ID"
          autoComplete="username"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value.slice(0, 128))}
          placeholder="Password (min. 8 characters)"
          autoComplete="new-password"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value.slice(0, 128))}
          placeholder="Confirm password"
          autoComplete="new-password"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${passwordsMatch ? C.line : C.alert}`, background: "rgba(255,255,255,0.08)" }}
        />
        {!passwordsMatch && (
          <div className="text-xs font-semibold" style={{ color: C.alert }}>Passwords don't match.</div>
        )}

        {error && (
          <div className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: C.alertPale, color: C.alert }}>
            {error}
          </div>
        )}

        <PrimaryButton type="submit" icon={ChevronRight} full disabled={!canSubmit}>
          {submitting ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </form>

      <button onClick={onSwitchToLogin} className="text-xs font-semibold mt-5" style={{ color: C.primary }}>
        Already have an account? Sign in →
      </button>
    </div>
  );
}

export function StaffLogin({ onSuccess, onSwitchToSignup }) {
  const [abhaId, setAbhaId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  // Tick every second only while a cooldown is active, to show a live countdown.
  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const isBlocked = submitting || cooldownRemaining > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    setError("");
    setSubmitting(true);
    try {
      const { ok, status, data } = await loginStaff({ abhaId, password });

      if (status === 429) {
        const match = /(\d+)\s*minute/.exec(data.error || "");
        const minutes = match ? parseInt(match[1], 10) : 1;
        setCooldownUntil(Date.now() + minutes * 60 * 1000);
        setError(data.error || "Too many attempts. Please wait.");
        return;
      }

      if (!ok) {
        setError(data.error || "Login failed. Please try again.");
        setCooldownUntil(Date.now() + 2000);
        return;
      }

      onSuccess(data.accessToken);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setCooldownUntil(Date.now() + 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const [googleError, setGoogleError] = useState("");
  const handleGoogleCredential = async (credential) => {
    setGoogleError("");
    try {
      const data = await exchangeGoogleCredential(credential, "staff");
      onSuccess(data.accessToken);
    } catch (err) {
      setGoogleError(err.message);
    }
  };

  return (
    <div className="mk-screen max-w-sm mx-auto px-6 py-16">
      <ShieldCheck size={28} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Staff sign-in</h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>Sign in to open the MediKiosk intake flow.</p>

      <div className="mt-6">
        <GoogleSignInButton onCredential={handleGoogleCredential} label="signin_with" />
        <GoogleErrorNotice error={googleError} />
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: C.line }} />
        <span className="text-xs" style={{ color: C.inkSoft }}>or sign in with your staff ID</span>
        <div className="flex-1 h-px" style={{ background: C.line }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 64))}
          placeholder="ABHA / Staff ID"
          autoComplete="username"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value.slice(0, 128))}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)" }}
        />

        {error && (
          <div className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: C.alertPale, color: C.alert }}>
            {error}
          </div>
        )}

        <PrimaryButton
          type="submit"
          icon={ChevronRight}
          full
          disabled={isBlocked || !abhaId || !password}
        >
          {cooldownRemaining > 0 ? `Please wait ${cooldownRemaining}s` : submitting ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </form>

      <button onClick={onSwitchToSignup} className="text-xs font-semibold mt-5" style={{ color: C.primary }}>
        New staff member? Create an account →
      </button>
    </div>
  );
}
