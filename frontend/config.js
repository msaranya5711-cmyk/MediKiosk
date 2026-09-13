/* ---------------------------------------------------------------
   BACKEND CONFIG
   The frontend NEVER calls api.anthropic.com directly and never
   holds an API key — all of that lives server-side. Point this at
   your deployed backend.
----------------------------------------------------------------*/
export const API_BASE_URL = "https://medikiosk-backend-b592.onrender.com/api";
export const WS_BASE_URL = "wss://medikiosk-backend-b592.onrender.com/ws/messaging"; // use wss:// in production

// Get this from Google Cloud Console → APIs & Services → Credentials
// (OAuth Client ID, type "Web application"). Must match GOOGLE_CLIENT_ID
// in the backend's .env.
export const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";
