/* ---------------------------------------------------------------
   END-TO-END ENCRYPTION — Web Crypto ECDH + AES-GCM
   Keys are generated in the browser and never leave it. The server
   only ever sees public keys (not secret) and ciphertext (opaque to
   it) — see backend/realtime/messagingServer.js for the relay side.
----------------------------------------------------------------*/
export function bufToBase64(buf) {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToBuf(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function generateE2EKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  return { privateKey: keyPair.privateKey, publicKeyJwk };
}

export async function importPeerPublicKey(jwk) {
  return window.crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, []);
}

export async function deriveSharedAESKey(privateKey, peerPublicKey) {
  return window.crypto.subtle.deriveKey(
    { name: "ECDH", public: peerPublicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithKey(aesKey, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoded);
  return { ciphertext: bufToBase64(ciphertextBuf), iv: bufToBase64(iv.buffer) };
}

export async function decryptWithKey(aesKey, ciphertextB64, ivB64) {
  const ciphertextBuf = base64ToBuf(ciphertextB64);
  const iv = new Uint8Array(base64ToBuf(ivB64));
  const plainBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertextBuf);
  return new TextDecoder().decode(plainBuf);
}
