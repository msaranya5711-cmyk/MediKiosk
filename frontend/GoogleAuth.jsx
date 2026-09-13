import { useRef, useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "../../constants/config.js";
import { useGoogleScriptLoaded } from "../../hooks/useGoogleScript.js";
import { C } from "../../constants/theme.js";

export function GoogleSignInButton({ onCredential, label = "continue_with" }) {
  const loaded = useGoogleScriptLoaded();
  const btnRef = useRef(null);

  useEffect(() => {
    if (!loaded || !btnRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: label,
    });
  }, [loaded, label, onCredential]);

  return <div ref={btnRef} />;
}

export function GoogleErrorNotice({ error }) {
  if (!error) return null;
  return (
    <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-3" style={{ background: C.alertPale, color: C.alert }}>
      {error}
    </div>
  );
}
