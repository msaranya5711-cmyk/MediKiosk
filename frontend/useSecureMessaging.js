import { useState, useRef, useEffect, useCallback } from "react";
import { WS_BASE_URL } from "../constants/config.js";
import {
  generateE2EKeyPair,
  importPeerPublicKey,
  deriveSharedAESKey,
  encryptWithKey,
  decryptWithKey,
} from "../utils/crypto.js";

/**
 * Manages one authenticated WebSocket connection for E2E-encrypted
 * messaging. Generates a fresh ECDH keypair per session (deliberately —
 * this is a shared kiosk terminal for patients, so nothing about a
 * session should be recoverable once it ends) and keeps the private key
 * only in memory, never sent anywhere.
 */
export function useSecureMessaging({ token, role, enabled }) {
  const [connected, setConnected] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [threads, setThreads] = useState({}); // peerId -> [{ from, text, at, mine, error }]
  const [available, setAvailable] = useState(false);
  const [wsError, setWsError] = useState("");
  const wsRef = useRef(null);
  const keyPairRef = useRef(null);
  const sharedKeysRef = useRef({});

  const appendMessage = useCallback((peerId, message) => {
    setThreads((prev) => ({ ...prev, [peerId]: [...(prev[peerId] || []), message] }));
  }, []);

  const getOrDeriveSharedKey = useCallback(async (peerId, peerPublicKeyJwk) => {
    if (sharedKeysRef.current[peerId]) return sharedKeysRef.current[peerId];
    if (!peerPublicKeyJwk) throw new Error("No public key available for this contact yet.");
    const peerKey = await importPeerPublicKey(peerPublicKeyJwk);
    const shared = await deriveSharedAESKey(keyPairRef.current.privateKey, peerKey);
    sharedKeysRef.current[peerId] = shared;
    return shared;
  }, []);

  useEffect(() => {
    if (!enabled || !token) return;
    let closed = false;

    (async () => {
      keyPairRef.current = await generateE2EKeyPair();
      const ws = new WebSocket(`${WS_BASE_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (closed) return;
        setConnected(true);
        ws.send(JSON.stringify({ type: "register_key", publicKeyJwk: keyPairRef.current.publicKeyJwk }));
        if (role === "patient") ws.send(JSON.stringify({ type: "request_doctor_list" }));
      };

      ws.onmessage = async (event) => {
        let msg;
        try { msg = JSON.parse(event.data); } catch { return; }

        if (msg.type === "doctor_list") {
          setDoctors(msg.doctors || []);
        } else if (msg.type === "message") {
          try {
            const sharedKey = await getOrDeriveSharedKey(msg.from, msg.senderPublicKeyJwk);
            const text = await decryptWithKey(sharedKey, msg.ciphertext, msg.iv);
            appendMessage(msg.from, { from: msg.from, fromName: msg.senderName, text, at: Date.now(), mine: false });
          } catch {
            appendMessage(msg.from, { from: msg.from, fromName: msg.senderName, text: "[Could not decrypt this message]", at: Date.now(), mine: false, error: true });
          }
        } else if (msg.type === "error") {
          setWsError(msg.error);
        }
      };

      ws.onclose = () => setConnected(false);
      ws.onerror = () => setWsError("Connection issue — messages may not send until this reconnects.");
    })();

    return () => {
      closed = true;
      wsRef.current?.close();
    };
  }, [enabled, token, role, appendMessage, getOrDeriveSharedKey]);

  const sendMessage = async (peerId, text, peerPublicKeyJwk = null) => {
    const sharedKey = await getOrDeriveSharedKey(peerId, peerPublicKeyJwk);
    const { ciphertext, iv } = await encryptWithKey(sharedKey, text);
    wsRef.current?.send(JSON.stringify({ type: "send_message", to: peerId, ciphertext, iv }));
    appendMessage(peerId, { from: "me", text, at: Date.now(), mine: true });
  };

  const setDoctorAvailability = (isAvailable) => {
    setAvailable(isAvailable);
    wsRef.current?.send(JSON.stringify({ type: "set_availability", available: isAvailable }));
  };

  return { connected, doctors, threads, sendMessage, available, setDoctorAvailability, wsError };
}
