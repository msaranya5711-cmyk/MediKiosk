import { useState } from "react";
import { ShieldCheck, ChevronLeft, Sparkles, Phone, MessageCircle, CalendarClock, CheckCircle2 } from "lucide-react";
import { ChatPanel } from "./ChatPanel.jsx";
import { TiltCard } from "../common/TiltCard.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { C, glassStyle } from "../../constants/theme.js";

/* ---------------------------------------------------------------
   SCREEN: DOCTORS (patient-facing)
----------------------------------------------------------------*/
export function DoctorsScreen({ messaging, suggestedSpecialty }) {
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ time: "", reason: "" });
  const [bookingSent, setBookingSent] = useState(false);

  const openBooking = (doc) => {
    setBookingFor(doc);
    setBookingForm({ time: "", reason: "" });
    setBookingSent(false);
  };

  const submitBooking = async () => {
    if (!bookingForm.time.trim() || !bookingFor) return;
    const text = `Appointment request — preferred time: ${bookingForm.time.trim()}${bookingForm.reason.trim() ? `; reason: ${bookingForm.reason.trim()}` : ""}`;
    try {
      await messaging.sendMessage(bookingFor.id, text, bookingFor.publicKeyJwk);
      setBookingSent(true);
    } catch {
      // sendMessage failures already surface via messaging.wsError in the chat panel
    }
  };

  if (activeDoctor) {
    return (
      <div className="mk-screen max-w-lg mx-auto px-6 py-10">
        <button onClick={() => setActiveDoctor(null)} className="flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: C.inkSoft }}>
          <ChevronLeft size={14} /> Back to doctors
        </button>
        <ChatPanel
          thread={messaging.threads[activeDoctor.id]}
          peerName={activeDoctor.name}
          wsError={messaging.wsError}
          onSend={(text) => messaging.sendMessage(activeDoctor.id, text, activeDoctor.publicKeyJwk)}
        />
      </div>
    );
  }

  return (
    <div className="mk-screen max-w-lg mx-auto px-6 py-10">
      <ShieldCheck size={26} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Available doctors</h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>Message, call, or request an appointment with a doctor while you wait — every conversation is end-to-end encrypted.</p>

      {suggestedSpecialty && (
        <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl text-xs font-semibold" style={{ background: C.primaryPale, color: C.primary }}>
          <Sparkles size={14} /> AI suggested department: {suggestedSpecialty} — pending physician review
        </div>
      )}

      <div className="mt-6 space-y-3">
        {messaging.doctors.length === 0 && (
          <div className="text-sm text-center py-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", color: C.inkSoft }}>
            No doctors are online right now. Please check with kiosk staff.
          </div>
        )}
        {messaging.doctors.map((doc) => (
          <TiltCard key={doc.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-semibold" style={{ background: C.primaryPale, color: C.primary }}>
                  {doc.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: C.success, border: `2px solid ${C.bg0}` }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{doc.name}</div>
                <div className="text-xs" style={{ color: C.success }}>{doc.department ? `${doc.department} · ` : ""}Online now</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {doc.phone && (
                <a href={`tel:${doc.phone.replace(/[^\d+]/g, "")}`}>
                  <GhostButton icon={Phone}>Call</GhostButton>
                </a>
              )}
              <GhostButton onClick={() => setActiveDoctor(doc)} icon={MessageCircle}>Message</GhostButton>
              <PrimaryButton onClick={() => openBooking(doc)} icon={CalendarClock}>Book appointment</PrimaryButton>
            </div>
          </TiltCard>
        ))}
      </div>

      {bookingFor && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4" style={{ background: "rgba(32,36,31,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={glassStyle({ background: "#FFFFFF" })}>
            {!bookingSent ? (
              <>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>Request an appointment</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>with {bookingFor.name}</div>
                <div className="space-y-3 mt-4">
                  <input
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="Preferred date & time"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="Reason for visit (optional)"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
                </div>
                {messaging.wsError && (
                  <div className="text-xs font-semibold mt-3" style={{ color: C.alert }}>{messaging.wsError}</div>
                )}
                <div className="flex gap-2 mt-5">
                  <GhostButton onClick={() => setBookingFor(null)}>Cancel</GhostButton>
                  <PrimaryButton full onClick={submitBooking} disabled={!bookingForm.time.trim()}>Send request</PrimaryButton>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={32} color={C.success} className="mx-auto" />
                <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>Request sent</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>
                  {bookingFor.name} will reply in your conversation to confirm.
                </div>
                <div className="mt-5">
                  <PrimaryButton full onClick={() => setBookingFor(null)}>Done</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
