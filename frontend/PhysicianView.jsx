import { useState } from "react";
import { Clock, User, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TiltCard } from "../common/TiltCard.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { ChatPanel } from "./ChatPanel.jsx";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: PHYSICIAN DASHBOARD
----------------------------------------------------------------*/
export function PhysicianView({ answers, docs, summary, mode, redFlag, messaging }) {
  const hasData = answers.length > 0;
  const [activePatientId, setActivePatientId] = useState(null);
  const sections = (summary || "")
    .split(/\n{2,}/)
    .map((block) => {
      const [head, ...rest] = block.split("\n");
      return { head: head?.trim(), body: rest.join(" ").trim() };
    })
    .filter((s) => s.head);

  const threadPeerIds = messaging ? Object.keys(messaging.threads) : [];

  return (
    <div className="mk-screen max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs font-semibold" style={{ color: C.accent }}>OPD · General Medicine · Token 214</div>
          <h2 className="text-2xl mt-1" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Patient history — ready for consultation</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: C.successPale, color: C.success }}>
          <Clock size={14} /> ~8 min saved this visit
        </div>
      </div>

      {!hasData ? (
        <div className="rounded-xl p-10 text-center" style={{ background: "rgba(255,255,255,0.08)", border: `1px dashed ${C.line}` }}>
          <User size={26} color={C.inkSoft} className="mx-auto" />
          <p className="text-sm mt-3" style={{ color: C.inkSoft }}>No patient has completed the kiosk intake yet. Run through the "Patient Kiosk" flow to populate this view.</p>
        </div>
      ) : (
        <>
          {redFlag && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ background: C.alertPale, border: `1.5px solid ${C.alert}` }}>
              <AlertTriangle size={18} color={C.alert} />
              <span className="text-sm font-semibold" style={{ color: C.alert }}>Priority flag — patient reported possible emergency symptoms during intake.</span>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            <TiltCard className="md:col-span-2 p-6" maxTilt={3} radius={20}>
              <div className="text-xs font-semibold mb-4" style={{ color: C.inkSoft }}>Structured clinical history {mode === "ayush" && "· AYUSH mode"}</div>
              <div className="space-y-4">
                {sections.map((s) => (
                  <div key={s.head}>
                    <div className="text-xs font-semibold" style={{ color: C.accent }}>{s.head.replace(/^\*+|\*+$/g, "")}</div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: C.ink }}>{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: `1px solid ${C.line}` }}>
                <PrimaryButton icon={CheckCircle2}>Accept & save to HIS</PrimaryButton>
                <GhostButton>Edit before saving</GhostButton>
              </div>
            </TiltCard>

            <div className="rounded-xl p-5" style={glassStyle()}>
              <div className="text-xs font-semibold mb-3" style={{ color: C.inkSoft }}>Document timeline</div>
              <div className="space-y-3">
                {docs.length === 0 && <p className="text-xs" style={{ color: C.inkSoft }}>No documents uploaded.</p>}
                {docs.map((d, i) => (
                  <div key={d.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: C.primary }} />
                      {i < docs.length - 1 && <div className="w-px flex-1" style={{ background: C.line }} />}
                    </div>
                    <div className="pb-3">
                      <div className="text-xs font-semibold" style={{ color: C.ink }}>{d.label}</div>
                      <div className="text-[11px]" style={{ color: C.inkSoft }}>{d.date}</div>
                      {d.abnormal && <div className="text-[11px] font-semibold mt-1" style={{ color: C.alert }}>⚠ {d.abnormal}</div>}
                      {d.pendingReview && (
                        <div className="text-[11px] font-semibold mt-1" style={{ color: C.accent }}>
                          Patient-uploaded — not yet reviewed
                          {d.previewUrl && (
                            <> · <a href={d.previewUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Open</a></>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {messaging && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold" style={{ color: C.inkSoft }}>Patient messages (end-to-end encrypted)</div>
            <button
              onClick={() => messaging.setDoctorAvailability(!messaging.available)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: messaging.available ? C.successPale : "rgba(255,255,255,0.08)", color: messaging.available ? C.success : C.inkSoft }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: messaging.available ? C.success : C.inkSoft }} />
              {messaging.available ? "Available to patients" : "Offline — tap to go available"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl p-4" style={glassStyle()}>
              <div className="text-xs font-semibold mb-2" style={{ color: C.inkSoft }}>Conversations</div>
              {threadPeerIds.length === 0 && <p className="text-xs" style={{ color: C.inkSoft }}>No patient messages yet.</p>}
              <div className="space-y-1.5">
                {threadPeerIds.map((peerId) => {
                  const thread = messaging.threads[peerId];
                  const last = thread[thread.length - 1];
                  const peerName = thread.find((m) => !m.mine)?.fromName || peerId;
                  return (
                    <button
                      key={peerId}
                      onClick={() => setActivePatientId(peerId)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs"
                      style={{ background: activePatientId === peerId ? C.primaryPale : "rgba(255,255,255,0.05)", color: C.ink }}
                    >
                      <div className="font-semibold">{peerName}</div>
                      <div className="truncate" style={{ color: C.inkSoft }}>{last?.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              {activePatientId ? (
                <ChatPanel
                  thread={messaging.threads[activePatientId]}
                  peerName={messaging.threads[activePatientId]?.find((m) => !m.mine)?.fromName || activePatientId}
                  wsError={messaging.wsError}
                  onSend={(text) => messaging.sendMessage(activePatientId, text)}
                />
              ) : (
                <div className="rounded-xl p-10 text-center h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px dashed ${C.line}` }}>
                  <p className="text-xs" style={{ color: C.inkSoft }}>Select a conversation to reply.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
