import { useState, useEffect } from "react";

/* ---------------------------------------------------------------
   GOOGLE IDENTITY SERVICES SCRIPT LOADER
----------------------------------------------------------------*/
export function useGoogleScriptLoaded() {
  const [loaded, setLoaded] = useState(() => !!(typeof window !== "undefined" && window.google?.accounts?.id));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.accounts?.id) {
      return;
    }
    const existing = document.getElementById("google-identity-script");
    if (existing) {
      const handleLoad = () => setLoaded(true);
      existing.addEventListener("load", handleLoad);
      return () => existing.removeEventListener("load", handleLoad);
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-identity-script";
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  return loaded;
}
