import { RED_FLAG_KEYWORDS } from "./clinicalQuestions.js";
import { SPECIALTIES } from "./specialties.js";

/* ---------------------------------------------------------------
   FALLBACK ASSISTANT LINES
   Used when /claude/chat cannot be reached so the chat remains
   responsive and can still detect red-flag symptoms.
----------------------------------------------------------------*/
export const FALLBACK_ASSISTANT_LINES = {
  en: {
    ack: ["Thanks for sharing that.", "Got it — noting that down.", "I understand, thank you.", "That's helpful, thank you."],
    ask: ["How long has this been going on?", "How would you describe it — mild, moderate, or severe?", "Is there anything that makes it better or worse?", "Has this happened before?", "Anything else you'd like to add before you see the doctor?"],
    urgent: "This sounds like it could be urgent — please alert kiosk staff or go to the emergency desk right away.",
  },
  hi: {
    ack: ["इसे साझा करने के लिए धन्यवाद।", "समझ गया, नोट कर लिया है।"],
    ask: ["आपको यह समस्या कब से है?", "क्या किसी चीज़ से यह बेहतर या ज़्यादा होता है?", "क्या पहले भी ऐसा हुआ है?", "डॉक्टर से मिलने से पहले कुछ और बताना चाहेंगे?"],
    urgent: "यह गंभीर हो सकता है — कृपया तुरंत कियोस्क स्टाफ को सूचित करें या इमरजेंसी डेस्क पर जाएँ।",
  },
  ta: {
    ack: ["இதைப் பகிர்ந்ததற்கு நன்றி.", "புரிந்தது, குறிப்பிட்டுக் கொண்டேன்."],
    ask: ["இந்த பிரச்சனை எவ்வளவு காலமாக உள்ளது?", "எதுவும் இதை மேம்படுத்துகிறதா அல்லது மோசமாக்குகிறதா?", "இது முன்பு ஏற்பட்டிருக்கிறதா?", "மருத்துவரை பார்ப்பதற்கு முன் வேறு ஏதாவது சொல்ல விரும்புகிறீர்களா?"],
    urgent: "இது அவசரமாக இருக்கலாம் — தயவுசெய்து உடனடியாக கியோஸ்க் ஊழியரிடம் தெரிவிக்கவும் அல்லது அவசரப் பிரிவிற்குச் செல்லவும்.",
  },
  bn: {
    ack: ["এটা জানানোর জন্য ধন্যবাদ।", "বুঝেছি, নোট করে রাখলাম।"],
    ask: ["এই সমস্যা কতদিন ধরে আছে?", "কিছুতে কি এটা ভালো বা খারাপ হয়?", "আগে কখনো এমন হয়েছে?", "ডাক্তারের কাছে যাওয়ার আগে আর কিছু বলতে চান?"],
    urgent: "এটি জরুরি হতে পারে — অনুগ্রহ করে অবিলম্বে কিয়স্ক কর্মীদের জানান বা জরুরি বিভাগে যান।",
  },
};

export function localAssistantReply(trimmedText, language, turnCount) {
  const lower = trimmedText.toLowerCase();
  const flagged = [...(RED_FLAG_KEYWORDS[language] || []), ...RED_FLAG_KEYWORDS.en].some((k) => lower.includes(k.toLowerCase()));
  const specialtyHit = SPECIALTIES.find((s) => s.id !== "general" && s.keywords.some((k) => lower.includes(k)));
  const lines = FALLBACK_ASSISTANT_LINES[language] || FALLBACK_ASSISTANT_LINES.en;
  const ack = lines.ack[turnCount % lines.ack.length];

  if (flagged) {
    return { reply: `${ack} ${lines.urgent}`, redFlag: true, suggestedSpecialty: null };
  }

  const ask = lines.ask[turnCount % lines.ask.length];
  const specialtyNote = specialtyHit && language === "en" ? ` This may be worth flagging for ${specialtyHit.label.replace(/\s*\(.*\)/, "")} — I've noted it for the doctor.` : "";
  return {
    reply: `${ack}${specialtyNote} ${ask}`,
    redFlag: false,
    suggestedSpecialty: specialtyHit ? specialtyHit.label.replace(/\s*\(.*\)/, "") : null,
  };
}
