import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  ScanLine,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Languages,
  ShieldCheck,
  Stethoscope,
  Clock,
  User,
  Upload,
  Sparkles,
  ClipboardList,
  Activity,
  Lock,
  Send,
  MessageCircle,
  Check,
  X,
  ChevronLeft,
  MapPin,
  Phone,
  CalendarClock,
  Navigation,
  Pill,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  Package,
  Filter,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  LocateFixed,
  Loader2,
  Home,
  Briefcase,
} from "lucide-react";

/* ---------------------------------------------------------------
   DESIGN TOKENS — soft, light neumorphic UI with a mint-green
   primary accent, matching the "Product UI Styleguide" reference:
   near-white surfaces, soft dual-layer shadows for elevation,
   pill-shaped controls, dark ink text on light cards.
----------------------------------------------------------------*/
const C = {
  bg0: "#F6F7F4",
  bg1: "#EFF2EE",
  surface: "rgba(255,255,255,0.86)",
  ink: "#20241F",
  inkSoft: "#6C766F",
  primary: "#7FE0BE",
  primaryDeep: "#3FAE86",
  primaryLight: "#A9F0D6",
  primaryPale: "rgba(127,224,190,0.22)",
  accent: "#6C8CFF",
  accentPale: "rgba(108,140,255,0.14)",
  alert: "#E1725A",
  alertPale: "rgba(225,114,90,0.14)",
  warning: "#D9A62E",
  warningPale: "rgba(217,166,46,0.16)",
  success: "#3FAE86",
  successPale: "rgba(63,174,134,0.16)",
  line: "rgba(32,36,31,0.10)",
  glassBorder: "rgba(127,224,190,0.45)",
};

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

/* interaction safety: decorative layers must never block controls */
button, [role="button"], input, textarea, select { pointer-events: auto !important; }
button { touch-action: manipulation; }

html, body, #root { background: ${C.bg1}; }

@keyframes screenIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes floatBlobA {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(20px,-16px); }
}
@keyframes floatBlobB {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(-16px,18px); }
}
@keyframes dashMove { to { stroke-dashoffset: 0; } }
@keyframes ping {
  0% { transform: scale(0.9); opacity: 0.7; }
  70% { transform: scale(1.9); opacity: 0; }
  100% { opacity: 0; }
}
.mk-screen { animation: screenIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
.mk-navscroll { scrollbar-width: none; -ms-overflow-style: none; }
.mk-navscroll::-webkit-scrollbar { display: none; }
`;

/* ---------------------------------------------------------------
   LANGUAGE + SPEECH RECOGNITION CODES
----------------------------------------------------------------*/
const LANGS = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "ta", label: "தமிழ்" },
  { id: "bn", label: "বাংলা" },
];
const SPEECH_LANG_CODES = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", bn: "bn-IN" };

/* ---------------------------------------------------------------
   UI STRINGS — every screen reads from this per selected language
----------------------------------------------------------------*/
const STRINGS = {
  en: {
    consentTitle: "Confirm your identity & consent",
    consentSub: "Your history is linked to your ABHA health account under the Ayushman Bharat Digital Mission.",
    abhaLabel: "ABHA ID or Aadhaar-linked number",
    newPatient: "New patient — register without ABHA →",
    consentStore: "I consent to my spoken history and scanned documents being processed to build my medical record.",
    consentShare: "I consent to this record being shared with my treating physician and linked to my ABHA account.",
    consentAudio: "Read this consent aloud to me in my language before I continue.",
    agreeBtn: "Agree & begin history",
    questionsAnswered: (n) => `${n} question${n > 1 ? "s" : ""} answered so far`,
    priorityTitle: "Priority flag raised.",
    priorityBody: "Triage staff have been alerted — this patient will be seen out of turn.",
    micListening: "Listening…",
    micIdle: "Or type / speak your own answer",
    nextBtn: "Next",
    micUnsupported: "Voice input isn't supported in this browser. Please type your answer, or try Chrome.",
    micDenied: "Microphone access is blocked. Allow the microphone permission for this site and try again.",
    micNoSpeech: "Didn't catch that. Please try again or type your answer.",
    micGenericError: "Voice input hit a snag. Please type your answer.",
    scanTitle: "Scan your prior medical documents",
    scanSub: "Upload a photo or PDF of a prescription, lab report, or discharge summary, if you have one.",
    uploadPrompt: "Tap to upload, or drag files here",
    uploadHint: "Prescriptions, lab reports, discharge summaries — JPG, PNG, or PDF, up to 15MB each",
    skipStep: "Skip this step",
    continueSummary: "Continue to summary",
    buildingSummary: "Building your history summary…",
    buildingSummarySub: "MediKiosk is combining your answers and documents into one clinical summary.",
    summaryReady: "Your history is ready",
    summaryReadyBody: "Please listen and confirm — your physician will review this at consultation.",
    confirmSend: "Confirm & send to physician",
    sentTitle: "Sent to your doctor",
    sentBody: "Your history has been linked to your ABHA record and pushed to the hospital system. Please take a seat — you'll be called by token number shortly.",
    seePhysician: "See what the physician sees →",
  },
  hi: {
    consentTitle: "अपनी पहचान और सहमति की पुष्टि करें",
    consentSub: "आयुष्मान भारत डिजिटल मिशन के तहत आपका इतिहास आपके ABHA हेल्थ खाते से जुड़ा है।",
    abhaLabel: "ABHA आईडी या आधार-लिंक्ड नंबर",
    newPatient: "नया मरीज़ — बिना ABHA के पंजीकरण करें →",
    consentStore: "मैं सहमति देता/देती हूं कि मेरा बोला गया इतिहास और स्कैन किए गए दस्तावेज़ मेरा मेडिकल रिकॉर्ड बनाने के लिए संसाधित किए जाएं।",
    consentShare: "मैं सहमति देता/देती हूं कि यह रिकॉर्ड मेरे डॉक्टर के साथ साझा किया जाए और मेरे ABHA खाते से जोड़ा जाए।",
    consentAudio: "आगे बढ़ने से पहले यह सहमति मुझे मेरी भाषा में सुनाएं।",
    agreeBtn: "सहमत हूं और इतिहास शुरू करें",
    questionsAnswered: (n) => `अब तक ${n} सवालों के जवाब दिए गए`,
    priorityTitle: "प्राथमिकता चेतावनी दी गई।",
    priorityBody: "ट्राइएज स्टाफ को सूचित कर दिया गया है — इस मरीज़ को बिना बारी के देखा जाएगा।",
    micListening: "सुन रहा है…",
    micIdle: "या अपना जवाब टाइप करें / बोलें",
    nextBtn: "आगे",
    micUnsupported: "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है। कृपया टाइप करें, या Chrome आज़माएं।",
    micDenied: "माइक्रोफ़ोन एक्सेस अवरुद्ध है। इस साइट के लिए माइक्रोफ़ोन अनुमति दें और फिर से कोशिश करें।",
    micNoSpeech: "आवाज़ स्पष्ट नहीं आई। कृपया फिर से कोशिश करें या टाइप करें।",
    micGenericError: "आवाज़ इनपुट में समस्या आई। कृपया टाइप करें।",
    scanTitle: "अपने पुराने मेडिकल दस्तावेज़ स्कैन करें",
    scanSub: "यदि आपके पास पर्ची, लैब रिपोर्ट या डिस्चार्ज सारांश है, तो उसकी फ़ोटो या PDF अपलोड करें।",
    uploadPrompt: "अपलोड करने के लिए टैप करें, या फ़ाइलें यहाँ खींचें",
    uploadHint: "पर्ची, लैब रिपोर्ट, डिस्चार्ज सारांश — JPG, PNG, या PDF, प्रत्येक 15MB तक",
    skipStep: "यह चरण छोड़ें",
    continueSummary: "सारांश पर जारी रखें",
    buildingSummary: "आपका इतिहास सारांश बनाया जा रहा है…",
    buildingSummarySub: "MediKiosk आपके जवाबों और दस्तावेज़ों को एक क्लिनिकल सारांश में जोड़ रहा है।",
    summaryReady: "आपका इतिहास तैयार है",
    summaryReadyBody: "कृपया सुनें और पुष्टि करें — आपका डॉक्टर परामर्श के समय इसकी समीक्षा करेगा।",
    confirmSend: "पुष्टि करें और डॉक्टर को भेजें",
    sentTitle: "आपके डॉक्टर को भेज दिया गया",
    sentBody: "आपका इतिहास आपके ABHA रिकॉर्ड से जोड़कर अस्पताल प्रणाली में भेज दिया गया है। कृपया बैठें — जल्द ही आपका टोकन नंबर पुकारा जाएगा।",
    seePhysician: "देखें डॉक्टर को क्या दिखता है →",
  },
  ta: {
    consentTitle: "உங்கள் அடையாளம் மற்றும் ஒப்புதலை உறுதிப்படுத்தவும்",
    consentSub: "ஆயுஷ்மான் பாரத் டிஜிட்டல் மிஷன் கீழ் உங்கள் வரலாறு உங்கள் ABHA சுகாதார கணக்குடன் இணைக்கப்பட்டுள்ளது.",
    abhaLabel: "ABHA ஐடி அல்லது ஆதார் இணைந்த எண்",
    newPatient: "புதிய நோயாளி — ABHA இல்லாமல் பதிவு செய்ய →",
    consentStore: "எனது பேசிய வரலாறு மற்றும் ஸ்கேன் செய்யப்பட்ட ஆவணங்கள் எனது மருத்துவ பதிவை உருவாக்க செயலாக்கப்படுவதற்கு நான் ஒப்புக்கொள்கிறேன்.",
    consentShare: "இந்த பதிவு எனது மருத்துவருடன் பகிரப்பட்டு எனது ABHA கணக்குடன் இணைக்கப்படுவதற்கு நான் ஒப்புக்கொள்கிறேன்.",
    consentAudio: "தொடர்வதற்கு முன் இந்த ஒப்புதலை எனது மொழியில் படித்துக் காட்டவும்.",
    agreeBtn: "ஒப்புக்கொண்டு வரலாற்றைத் தொடங்கு",
    questionsAnswered: (n) => `இதுவரை ${n} கேள்விகளுக்கு பதிலளிக்கப்பட்டது`,
    priorityTitle: "முன்னுரிமை எச்சரிக்கை எழுப்பப்பட்டது.",
    priorityBody: "டிரையேஜ் பணியாளர்களுக்கு தெரிவிக்கப்பட்டுள்ளது — இந்த நோயாளி வரிசை இல்லாமல் பார்க்கப்படுவார்.",
    micListening: "கேட்கிறது…",
    micIdle: "அல்லது உங்கள் பதிலை தட்டச்சு செய்யவும் / பேசவும்",
    nextBtn: "அடுத்து",
    micUnsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. தட்டச்சு செய்யவும், அல்லது Chrome ஐ பயன்படுத்தவும்.",
    micDenied: "மைக்ரோஃபோன் அணுகல் தடுக்கப்பட்டது. இந்த தளத்திற்கு மைக்ரோஃபோன் அனுமதி வழங்கி மீண்டும் முயற்சிக்கவும்.",
    micNoSpeech: "தெளிவாக கேட்கவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது தட்டச்சு செய்யவும்.",
    micGenericError: "குரல் உள்ளீட்டில் சிக்கல். தட்டச்சு செய்யவும்.",
    scanTitle: "உங்கள் முந்தைய மருத்துவ ஆவணங்களை ஸ்கேன் செய்யவும்",
    scanSub: "உங்களிடம் மருந்துச் சீட்டு, ஆய்வக அறிக்கை அல்லது டிஸ்சார்ஜ் சுருக்கம் இருந்தால், அதன் புகைப்படம் அல்லது PDF-ஐ பதிவேற்றவும்.",
    uploadPrompt: "பதிவேற்ற தட்டவும், அல்லது கோப்புகளை இங்கே இழுக்கவும்",
    uploadHint: "மருந்துச் சீட்டுகள், ஆய்வக அறிக்கைகள், டிஸ்சார்ஜ் சுருக்கங்கள் — JPG, PNG, அல்லது PDF, ஒவ்வொன்றும் 15MB வரை",
    skipStep: "இந்த படியைத் தவிர்",
    continueSummary: "சுருக்கத்திற்குச் செல்",
    buildingSummary: "உங்கள் வரலாற்று சுருக்கம் உருவாக்கப்படுகிறது…",
    buildingSummarySub: "MediKiosk உங்கள் பதில்களையும் ஆவணங்களையும் ஒரு மருத்துவ சுருக்கமாக இணைக்கிறது.",
    summaryReady: "உங்கள் வரலாறு தயார்",
    summaryReadyBody: "தயவுசெய்து கேட்டு உறுதிப்படுத்தவும் — உங்கள் மருத்துவர் ஆலோசனையின்போது இதை மதிப்பாய்வு செய்வார்.",
    confirmSend: "உறுதிப்படுத்தி மருத்துவருக்கு அனுப்பு",
    sentTitle: "உங்கள் மருத்துவருக்கு அனுப்பப்பட்டது",
    sentBody: "உங்கள் வரலாறு உங்கள் ABHA பதிவுடன் இணைக்கப்பட்டு மருத்துவமனை அமைப்பிற்கு அனுப்பப்பட்டுள்ளது. தயவுசெய்து அமரவும் — விரைவில் உங்கள் டோக்கன் எண் அழைக்கப்படும்.",
    seePhysician: "மருத்துவர் என்ன பார்க்கிறார் என்பதைப் பார் →",
  },
  bn: {
    consentTitle: "আপনার পরিচয় ও সম্মতি নিশ্চিত করুন",
    consentSub: "আয়ুষ্মান ভারত ডিজিটাল মিশনের অধীনে আপনার ইতিহাস আপনার ABHA স্বাস্থ্য অ্যাকাউন্টের সাথে যুক্ত।",
    abhaLabel: "ABHA আইডি বা আধার-সংযুক্ত নম্বর",
    newPatient: "নতুন রোগী — ABHA ছাড়া নিবন্ধন করুন →",
    consentStore: "আমি সম্মতি দিচ্ছি যে আমার বলা ইতিহাস এবং স্ক্যান করা নথি আমার মেডিকেল রেকর্ড তৈরি করতে ব্যবহৃত হবে।",
    consentShare: "আমি সম্মতি দিচ্ছি যে এই রেকর্ড আমার চিকিৎসকের সাথে শেয়ার করা হবে এবং আমার ABHA অ্যাকাউন্টের সাথে যুক্ত করা হবে।",
    consentAudio: "এগিয়ে যাওয়ার আগে এই সম্মতিটি আমার ভাষায় পড়ে শোনান।",
    agreeBtn: "সম্মত এবং ইতিহাস শুরু করুন",
    questionsAnswered: (n) => `এখন পর্যন্ত ${n}টি প্রশ্নের উত্তর দেওয়া হয়েছে`,
    priorityTitle: "অগ্রাধিকার সতর্কতা জারি করা হয়েছে।",
    priorityBody: "ট্রায়াজ কর্মীদের জানানো হয়েছে — এই রোগীকে সিরিয়াল ছাড়াই দেখা হবে।",
    micListening: "শুনছে…",
    micIdle: "অথবা আপনার উত্তর টাইপ করুন / বলুন",
    nextBtn: "পরবর্তী",
    micUnsupported: "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে টাইপ করুন, অথবা Chrome ব্যবহার করুন।",
    micDenied: "মাইক্রোফোন অ্যাক্সেস ব্লক করা আছে। এই সাইটের জন্য মাইক্রোফোন অনুমতি দিন এবং আবার চেষ্টা করুন।",
    micNoSpeech: "স্পষ্ট শোনা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন বা টাইপ করুন।",
    micGenericError: "ভয়েস ইনপুটে সমস্যা হয়েছে। অনুগ্রহ করে টাইপ করুন।",
    scanTitle: "আপনার পূর্ববর্তী মেডিকেল নথি স্ক্যান করুন",
    scanSub: "আপনার কাছে প্রেসক্রিপশন, ল্যাব রিপোর্ট বা ডিসচার্জ সামারি থাকলে তার ছবি বা PDF আপলোড করুন।",
    uploadPrompt: "আপলোড করতে ট্যাপ করুন, বা ফাইল এখানে টেনে আনুন",
    uploadHint: "প্রেসক্রিপশন, ল্যাব রিপোর্ট, ডিসচার্জ সামারি — JPG, PNG, বা PDF, প্রতিটি 15MB পর্যন্ত",
    skipStep: "এই ধাপ এড়িয়ে যান",
    continueSummary: "সারাংশে এগিয়ে যান",
    buildingSummary: "আপনার ইতিহাসের সারাংশ তৈরি হচ্ছে…",
    buildingSummarySub: "MediKiosk আপনার উত্তর ও নথিগুলিকে একটি ক্লিনিক্যাল সারাংশে একত্র করছে।",
    summaryReady: "আপনার ইতিহাস প্রস্তুত",
    summaryReadyBody: "অনুগ্রহ করে শুনুন এবং নিশ্চিত করুন — আপনার চিকিৎসক পরামর্শের সময় এটি পর্যালোচনা করবেন।",
    confirmSend: "নিশ্চিত করুন এবং চিকিৎসকের কাছে পাঠান",
    sentTitle: "আপনার ডাক্তারের কাছে পাঠানো হয়েছে",
    sentBody: "আপনার ইতিহাস আপনার ABHA রেকর্ডের সাথে যুক্ত করে হাসপাতাল সিস্টেমে পাঠানো হয়েছে। অনুগ্রহ করে বসুন — শীঘ্রই আপনার টোকেন নম্বর ডাকা হবে।",
    seePhysician: "চিকিৎসক কী দেখেন তা দেখুন →",
  },
};

/* ---------------------------------------------------------------
   RED FLAG KEYWORDS — checked in the patient's chosen language,
   plus English is always checked too since chips are internally
   canonical English and typed input may be in either.
----------------------------------------------------------------*/
const RED_FLAG_KEYWORDS = {
  en: ["chest pain", "can't breathe", "cant breathe", "difficulty breathing", "breathless", "unconscious", "severe bleeding", "blood in vomit", "stroke", "numbness", "fainted"],
  hi: ["सीने में दर्द", "सांस नहीं आ रही", "सांस लेने में तकलीफ", "बेहोश", "ज़्यादा खून बहना", "खून की उल्टी", "लकवा", "सुन्नपन"],
  ta: ["மார்பு வலி", "மூச்சு விட முடியவில்லை", "மூச்சுத் திணறல்", "மயக்கம்", "அதிக இரத்தப்போக்கு", "வாந்தியில் இரத்தம்", "பக்கவாதம்", "மரத்துப்போதல்"],
  bn: ["বুকে ব্যথা", "শ্বাস নিতে পারছি না", "শ্বাসকষ্ট", "অজ্ঞান", "অতিরিক্ত রক্তক্ষরণ", "বমিতে রক্ত", "স্ট্রোক", "অসাড়তা"],
};

/* ---------------------------------------------------------------
   INTERVIEW CONTENT — canonical `section` stays English (used to
   group answers for the clinical summary); question + chips are
   translated per language and picked at render time.
----------------------------------------------------------------*/
const BASE_STEPS = [
  {
    section: "Chief Complaint",
    sectionLabel: { en: "Chief Complaint", hi: "मुख्य समस्या", ta: "முதன்மை புகார்", bn: "প্রধান সমস্যা" },
    q: {
      en: "What brings you to the hospital today?",
      hi: "आज आप अस्पताल किस समस्या के लिए आए हैं?",
      ta: "இன்று மருத்துவமனைக்கு வர காரணம் என்ன?",
      bn: "আজ আপনি হাসপাতালে কেন এসেছেন?",
    },
    chips: {
      en: ["Fever", "Cough & cold", "Chest pain", "Stomach pain", "Headache", "Joint pain"],
      hi: ["बुखार", "खांसी-जुकाम", "सीने में दर्द", "पेट दर्द", "सिरदर्द", "जोड़ों का दर्द"],
      ta: ["காய்ச்சல்", "இருமல் & சளி", "மார்பு வலி", "வயிற்று வலி", "தலைவலி", "மூட்டு வலி"],
      bn: ["জ্বর", "কাশি ও সর্দি", "বুকে ব্যথা", "পেটে ব্যথা", "মাথাব্যথা", "গাঁটে ব্যথা"],
    },
  },
  {
    section: "History of Present Illness",
    sectionLabel: { en: "History of Present Illness", hi: "वर्तमान बीमारी का विवरण", ta: "தற்போதைய நோய் விவரம்", bn: "বর্তমান অসুস্থতার বিবরণ" },
    q: {
      en: "How long have you had this problem?",
      hi: "आपको यह समस्या कब से है?",
      ta: "இந்த பிரச்சனை எவ்வளவு காலமாக உள்ளது?",
      bn: "এই সমস্যা কতদিন ধরে আছে?",
    },
    chips: {
      en: ["Since today", "2–3 days", "About a week", "More than 2 weeks", "More than a month"],
      hi: ["आज से", "2–3 दिन से", "लगभग एक हफ्ते से", "2 हफ्तों से ज़्यादा", "एक महीने से ज़्यादा"],
      ta: ["இன்று முதல்", "2–3 நாட்களாக", "ஏறத்தாழ ஒரு வாரமாக", "2 வாரங்களுக்கு மேல்", "ஒரு மாதத்திற்கு மேல்"],
      bn: ["আজ থেকে", "2–3 দিন ধরে", "প্রায় এক সপ্তাহ ধরে", "2 সপ্তাহের বেশি", "এক মাসের বেশি"],
    },
  },
  {
    section: "History of Present Illness",
    sectionLabel: { en: "History of Present Illness", hi: "वर्तमान बीमारी का विवरण", ta: "தற்போதைய நோய் விவரம்", bn: "বর্তমান অসুস্থতার বিবরণ" },
    q: {
      en: "How would you describe it?",
      hi: "आप इसे कैसे बताएंगे?",
      ta: "இதை எப்படி விவரிப்பீர்கள்?",
      bn: "আপনি এটাকে কীভাবে বর্ণনা করবেন?",
    },
    chips: {
      en: ["Mild", "Moderate", "Severe", "Comes and goes"],
      hi: ["हल्का", "मध्यम", "गंभीर", "रुक-रुक कर होता है"],
      ta: ["லேசானது", "மிதமானது", "கடுமையானது", "அவ்வப்போது வரும்"],
      bn: ["হালকা", "মাঝারি", "তীব্র", "মাঝে মাঝে হয়"],
    },
  },
  {
    section: "History of Present Illness",
    sectionLabel: { en: "History of Present Illness", hi: "वर्तमान बीमारी का विवरण", ta: "தற்போதைய நோய் விவரம்", bn: "বর্তমান অসুস্থতার বিবরণ" },
    q: {
      en: "Does anything make it better or worse?",
      hi: "क्या किसी चीज़ से यह बेहतर या ज़्यादा होता है?",
      ta: "எதுவும் இதை மேம்படுத்துகிறதா அல்லது மோசமாக்குகிறதா?",
      bn: "কিছুতে কি এটা ভালো বা খারাপ হয়?",
    },
    chips: {
      en: ["Rest helps", "Medicine helps", "Worse with movement", "Worse at night", "Not sure"],
      hi: ["आराम से ठीक लगता है", "दवा से ठीक लगता है", "हिलने-डुलने से बढ़ता है", "रात में बढ़ता है", "पता नहीं"],
      ta: ["ஓய்வு உதவுகிறது", "மருந்து உதவுகிறது", "அசைவால் மோசமாகிறது", "இரவில் மோசமாகிறது", "தெரியவில்லை"],
      bn: ["বিশ্রামে ভালো লাগে", "ওষুধে ভালো লাগে", "নড়াচড়ায় বাড়ে", "রাতে বাড়ে", "জানি না"],
    },
  },
  {
    section: "Past Medical History",
    sectionLabel: { en: "Past Medical History", hi: "पुराना चिकित्सा इतिहास", ta: "முந்தைய மருத்துவ வரலாறு", bn: "পূর্ববর্তী চিকিৎসা ইতিহাস" },
    q: {
      en: "Do you have any long-term illnesses, like diabetes, blood pressure or asthma?",
      hi: "क्या आपको कोई पुरानी बीमारी है, जैसे मधुमेह, ब्लड प्रेशर या दमा?",
      ta: "உங்களுக்கு நீரிழிவு, இரத்த அழுத்தம் அல்லது ஆஸ்துமா போன்ற நீண்டகால நோய் ஏதும் உள்ளதா?",
      bn: "আপনার কি ডায়াবেটিস, উচ্চ রক্তচাপ বা হাঁপানির মতো দীর্ঘমেয়াদী রোগ আছে?",
    },
    chips: {
      en: ["Diabetes", "High blood pressure", "Asthma", "Heart disease", "None of these"],
      hi: ["मधुमेह", "उच्च रक्तचाप", "दमा", "हृदय रोग", "इनमें से कोई नहीं"],
      ta: ["நீரிழிவு", "உயர் இரத்த அழுத்தம்", "ஆஸ்துமா", "இதய நோய்", "இவை எதுவும் இல்லை"],
      bn: ["ডায়াবেটিস", "উচ্চ রক্তচাপ", "হাঁপানি", "হৃদরোগ", "এর কোনোটিই নয়"],
    },
  },
  {
    section: "Past Surgical History",
    sectionLabel: { en: "Past Surgical History", hi: "पुरानी शल्य चिकित्सा", ta: "முந்தைய அறுவை சிகிச்சை வரலாறு", bn: "পূর্ববর্তী অস্ত্রোপচার ইতিহাস" },
    q: {
      en: "Have you had any surgeries before?",
      hi: "क्या पहले कोई ऑपरेशन हुआ है?",
      ta: "முன்பு ஏதேனும் அறுவை சிகிச்சை செய்துள்ளீர்களா?",
      bn: "আগে কোনো অস্ত্রোপচার হয়েছে কি?",
    },
    chips: {
      en: ["Yes, recently", "Yes, years ago", "No surgeries"],
      hi: ["हाँ, हाल ही में", "हाँ, वर्षों पहले", "कोई ऑपरेशन नहीं"],
      ta: ["ஆம், சமீபத்தில்", "ஆம், பல ஆண்டுகளுக்கு முன்", "அறுவை சிகிச்சை இல்லை"],
      bn: ["হ্যাঁ, সম্প্রতি", "হ্যাঁ, বছর আগে", "কোনো অস্ত্রোপচার হয়নি"],
    },
  },
  {
    section: "Drug & Allergy History",
    sectionLabel: { en: "Drug & Allergy History", hi: "दवा और एलर्जी का इतिहास", ta: "மருந்து & ஒவ்வாமை வரலாறு", bn: "ওষুধ ও অ্যালার্জি ইতিহাস" },
    q: {
      en: "Are you currently taking any medicines regularly?",
      hi: "क्या आप नियमित रूप से कोई दवा ले रहे हैं?",
      ta: "தற்போது தொடர்ந்து ஏதேனும் மருந்து எடுக்கிறீர்களா?",
      bn: "আপনি কি নিয়মিত কোনো ওষুধ খাচ্ছেন?",
    },
    chips: {
      en: ["Yes, regularly", "Yes, occasionally", "No"],
      hi: ["हाँ, नियमित रूप से", "हाँ, कभी-कभी", "नहीं"],
      ta: ["ஆம், தொடர்ந்து", "ஆம், எப்போதாவது", "இல்லை"],
      bn: ["হ্যাঁ, নিয়মিত", "হ্যাঁ, মাঝেমধ্যে", "না"],
    },
  },
  {
    section: "Drug & Allergy History",
    sectionLabel: { en: "Drug & Allergy History", hi: "दवा और एलर्जी का इतिहास", ta: "மருந்து & ஒவ்வாமை வரலாறு", bn: "ওষুধ ও অ্যালার্জি ইতিহাস" },
    q: {
      en: "Do you have any allergies to medicines or food?",
      hi: "क्या आपको किसी दवा या खाने से एलर्जी है?",
      ta: "மருந்து அல்லது உணவால் உங்களுக்கு ஒவ்வாமை உள்ளதா?",
      bn: "ওষুধ বা খাবারে কোনো অ্যালার্জি আছে কি?",
    },
    chips: {
      en: ["No known allergies", "Yes — medicine allergy", "Yes — food allergy"],
      hi: ["कोई ज्ञात एलर्जी नहीं", "हाँ — दवा से एलर्जी", "हाँ — खाने से एलर्जी"],
      ta: ["தெரிந்த ஒவ்வாமை இல்லை", "ஆம் — மருந்து ஒவ்வாமை", "ஆம் — உணவு ஒவ்வாமை"],
      bn: ["জানা অ্যালার্জি নেই", "হ্যাঁ — ওষুধে অ্যালার্জি", "হ্যাঁ — খাবারে অ্যালার্জি"],
    },
  },
  {
    section: "Family History",
    sectionLabel: { en: "Family History", hi: "पारिवारिक इतिहास", ta: "குடும்ப வரலாறு", bn: "পারিবারিক ইতিহাস" },
    q: {
      en: "Does anyone in your immediate family have diabetes, heart disease, or cancer?",
      hi: "क्या आपके परिवार में किसी को मधुमेह, हृदय रोग या कैंसर है?",
      ta: "உங்கள் நெருங்கிய குடும்பத்தில் யாருக்காவது நீரிழிவு, இதய நோய் அல்லது புற்றுநோய் உள்ளதா?",
      bn: "আপনার পরিবারে কারো কি ডায়াবেটিস, হৃদরোগ বা ক্যান্সার আছে?",
    },
    chips: {
      en: ["Yes", "No", "Not sure"],
      hi: ["हाँ", "नहीं", "पता नहीं"],
      ta: ["ஆம்", "இல்லை", "தெரியவில்லை"],
      bn: ["হ্যাঁ", "না", "জানি না"],
    },
  },
  {
    section: "Personal History",
    sectionLabel: { en: "Personal History", hi: "व्यक्तिगत इतिहास", ta: "தனிப்பட்ட வரலாறு", bn: "ব্যক্তিগত ইতিহাস" },
    q: {
      en: "Do you smoke, drink alcohol, or use tobacco?",
      hi: "क्या आप धूम्रपान, शराब या तंबाकू का सेवन करते हैं?",
      ta: "நீங்கள் புகைபிடிக்கிறீர்களா, மது அருந்துகிறீர்களா அல்லது புகையிலை பயன்படுத்துகிறீர்களா?",
      bn: "আপনি কি ধূমপান, মদ্যপান বা তামাক ব্যবহার করেন?",
    },
    chips: {
      en: ["None of these", "Smoking", "Alcohol", "Tobacco / gutkha"],
      hi: ["इनमें से कोई नहीं", "धूम्रपान", "शराब", "तंबाकू / गुटखा"],
      ta: ["இவை எதுவும் இல்லை", "புகைபிடித்தல்", "மது", "புகையிலை / குட்கா"],
      bn: ["এর কোনোটিই নয়", "ধূমপান", "মদ্যপান", "তামাক / গুটখা"],
    },
  },
  {
    section: "Review of Systems",
    sectionLabel: { en: "Review of Systems", hi: "सामान्य लक्षण जांच", ta: "பொது அறிகுறி மதிப்பீடு", bn: "সাধারণ উপসর্গ পর্যালোচনা" },
    q: {
      en: "Any other symptoms — fever, weight loss, breathlessness, or sleep problems?",
      hi: "कोई और लक्षण — बुखार, वज़न घटना, सांस फूलना या नींद की समस्या?",
      ta: "வேறு ஏதேனும் அறிகுறிகள் — காய்ச்சல், எடை குறைவு, மூச்சுத் திணறல் அல்லது தூக்கப் பிரச்சனை?",
      bn: "আর কোনো লক্ষণ — জ্বর, ওজন কমা, শ্বাসকষ্ট বা ঘুমের সমস্যা?",
    },
    chips: {
      en: ["None", "Fever", "Weight loss", "Breathlessness", "Sleep problems"],
      hi: ["कोई नहीं", "बुखार", "वज़न घटना", "सांस फूलना", "नींद की समस्या"],
      ta: ["இல்லை", "காய்ச்சல்", "எடை குறைவு", "மூச்சுத் திணறல்", "தூக்கப் பிரச்சனை"],
      bn: ["কিছু নেই", "জ্বর", "ওজন কমা", "শ্বাসকষ্ট", "ঘুমের সমস্যা"],
    },
  },
];

const AYUSH_STEP = {
  section: "Prakriti Assessment (Ayurveda)",
  sectionLabel: { en: "Prakriti Assessment (Ayurveda)", hi: "प्रकृति मूल्यांकन (आयुर्वेद)", ta: "பிரகிருதி மதிப்பீடு (ஆயுர்வேதம்)", bn: "প্রকৃতি মূল্যায়ন (আয়ুর্বেদ)" },
  q: {
    en: "Which best describes your body and nature, generally?",
    hi: "आपका शरीर और स्वभाव सामान्यतः किससे मिलता है?",
    ta: "பொதுவாக உங்கள் உடல் மற்றும் இயல்பை எது சிறப்பாக விவரிக்கிறது?",
    bn: "সাধারণভাবে আপনার শরীর ও স্বভাব কোনটির সাথে সবচেয়ে মেলে?",
  },
  chips: {
    en: ["Thin build, quick, dry skin (Vata)", "Medium build, sharp appetite, warm (Pitta)", "Solid build, calm, steady (Kapha)", "Not sure"],
    hi: ["दुबला शरीर, फुर्तीला, सूखी त्वचा (वात)", "मध्यम शरीर, तेज़ भूख, गर्म स्वभाव (पित्त)", "मज़बूत शरीर, शांत, स्थिर स्वभाव (कफ)", "पता नहीं"],
    ta: ["மெலிந்த உடல், சுறுசுறுப்பு, வறண்ட தோல் (வாதம்)", "நடுத்தர உடல், கூர்மையான பசி, வெப்பம் (பித்தம்)", "திடமான உடல், அமைதி, உறுதி (கபம்)", "தெரியவில்லை"],
    bn: ["পাতলা গঠন, চটপটে, শুষ্ক ত্বক (বাত)", "মাঝারি গঠন, তীক্ষ্ণ ক্ষুধা, উষ্ণ (পিত্ত)", "মজবুত গঠন, শান্ত, স্থির (কফ)", "জানি না"],
  },
};

/* ---------------------------------------------------------------
   BACKEND CONFIG
   The frontend NEVER calls api.anthropic.com directly and never
   holds an API key — all of that lives server-side. Point this at
   your deployed backend (see the accompanying /backend folder).
----------------------------------------------------------------*/
const API_BASE_URL = "https://medikiosk-backend-b592.onrender.com/api";

/* ---------------------------------------------------------------
   PHARMACY API
   The Pharmacy UI uses the backend as the source of truth when it
   is available. Local catalog/order storage remains only as a
   graceful fallback so the kiosk does not hard-stop if the API
   temporarily goes offline.
----------------------------------------------------------------*/
async function pharmacyApi(path, { token, method = "GET", body, signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
  });

  let data = null;
  try { data = await response.json(); } catch {}

  if (!response.ok) {
    throw new Error(data?.error || `Pharmacy API responded ${response.status}`);
  }
  return data;
}

function extractMedicineList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.medicines)) return data.medicines;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.inventory)) return data.inventory;
  return [];
}

function extractOrderList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function extractOrder(data) {
  return data?.order || data?.data || data;
}
 // use wss:// in production
const WS_BASE_URL = "wss://medikiosk-backend-b592.onrender.com/ws/messaging";
// Get this from Google Cloud Console → APIs & Services → Credentials
// (OAuth Client ID, type "Web application"). Must match GOOGLE_CLIENT_ID
// in the backend's .env.
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com";

/* ---------------------------------------------------------------
   GOOGLE SIGN-IN
   Renders Google's own sign-in button. Google handles the account
   picker and password entry entirely on its own domain — this app
   never sees, asks for, or touches a Gmail password. We only ever
   receive a signed ID token, which we hand to our backend to verify.
----------------------------------------------------------------*/
function useGoogleScriptLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setLoaded(true);
      return;
    }
    const existing = document.getElementById("google-identity-script");
    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
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

function GoogleSignInButton({ onCredential, label = "continue_with" }) {
  const loaded = useGoogleScriptLoaded();
  const btnRef = useRef(null);

  useEffect(() => {
    if (!loaded || !btnRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      // response.credential is a signed JWT identity token — not a password.
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: label,
    });
  }, [loaded, label]);

  return <div ref={btnRef} />;
}

/**
 * Exchanges a verified Google credential for our own backend session token.
 * role is "patient" or "staff" — the backend independently decides whether
 * that role is actually allowed for this email (see routes/googleAuth.js);
 * asking for "staff" here does not automatically grant it.
 */
async function exchangeGoogleCredential(credential, role) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
  return data;
}

/* ---------------------------------------------------------------
   END-TO-END ENCRYPTION — Web Crypto ECDH + AES-GCM
   Keys are generated in the browser and never leave it. The server
   only ever sees public keys (not secret) and ciphertext (opaque to
   it) — see backend/realtime/messagingServer.js for the relay side.
----------------------------------------------------------------*/
function bufToBase64(buf) {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function base64ToBuf(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function generateE2EKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  return { privateKey: keyPair.privateKey, publicKeyJwk };
}

async function importPeerPublicKey(jwk) {
  return window.crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, []);
}

async function deriveSharedAESKey(privateKey, peerPublicKey) {
  return window.crypto.subtle.deriveKey(
    { name: "ECDH", public: peerPublicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptWithKey(aesKey, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoded);
  return { ciphertext: bufToBase64(ciphertextBuf), iv: bufToBase64(iv.buffer) };
}

async function decryptWithKey(aesKey, ciphertextB64, ivB64) {
  const ciphertextBuf = base64ToBuf(ciphertextB64);
  const iv = new Uint8Array(base64ToBuf(ivB64));
  const plainBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertextBuf);
  return new TextDecoder().decode(plainBuf);
}

/**
 * Manages one authenticated WebSocket connection for E2E-encrypted
 * messaging. Generates a fresh ECDH keypair per session (deliberately —
 * this is a shared kiosk terminal for patients, so nothing about a
 * session should be recoverable once it ends) and keeps the private key
 * only in memory, never sent anywhere.
 */
function useSecureMessaging({ token, role, enabled }) {
  const [connected, setConnected] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [threads, setThreads] = useState({}); // peerId -> [{ from, text, at, mine, error }]
  const [available, setAvailable] = useState(false);
  const [wsError, setWsError] = useState("");
  const wsRef = useRef(null);
  const keyPairRef = useRef(null);
  const sharedKeysRef = useRef({});

  const appendMessage = (peerId, message) => {
    setThreads((prev) => ({ ...prev, [peerId]: [...(prev[peerId] || []), message] }));
  };

  const getOrDeriveSharedKey = async (peerId, peerPublicKeyJwk) => {
    if (sharedKeysRef.current[peerId]) return sharedKeysRef.current[peerId];
    if (!peerPublicKeyJwk) throw new Error("No public key available for this contact yet.");
    const peerKey = await importPeerPublicKey(peerPublicKeyJwk);
    const shared = await deriveSharedAESKey(keyPairRef.current.privateKey, peerKey);
    sharedKeysRef.current[peerId] = shared;
    return shared;
  };

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
          setDoctors(msg.doctors);
        } else if (msg.type === "message") {
          try {
            const sharedKey = await getOrDeriveSharedKey(msg.from, msg.senderPublicKeyJwk);
            const text = await decryptWithKey(sharedKey, msg.ciphertext, msg.iv);
            appendMessage(msg.from, { from: msg.from, fromName: msg.senderName, text, at: Date.now(), mine: false });
          } catch (e) {
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
  }, [enabled, token, role]);

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

/* ---------------------------------------------------------------
   SECURE SUMMARY CALL — Module C: structured summary generation
   Calls our own backend proxy (routes/claude.js) instead of the
   Anthropic API directly. The backend attaches the real system
   prompt, holds the API key, rate-limits, and enforces a session.
----------------------------------------------------------------*/
async function generateClinicalSummary({ answers, mode, docs, redFlag, patientToken }) {
  const transcript = answers.map((a) => `${a.section}: Q: ${a.q} A: ${a.answer}`).join("\n");
  const docText = docs.map((d) => `${d.label} (${d.date}): ${d.fields.map((f) => `${f.k} — ${f.v}`).join("; ")}`).join("\n");

  const prompt = `PATIENT CONVERSATION TRANSCRIPT:\n${transcript}\n\nDIGITIZED PRIOR DOCUMENTS:\n${docText || "None uploaded."}\n\nRED FLAG DETECTED: ${redFlag ? "YES — mentioned symptoms consistent with a possible emergency." : "No"}\n\nMODE: ${mode}`;

  // Cap what we send — mirrors the backend's own limit so we fail fast
  // locally instead of round-tripping a request we know will be rejected.
  if (prompt.length > 8000) {
    return fallbackSummary({ answers, mode, docs, redFlag });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/claude/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(patientToken ? { Authorization: `Bearer ${patientToken}` } : {}),
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`backend responded ${response.status}`);
    const data = await response.json();
    if (!data.summary) throw new Error("empty response");
    return data.summary;
  } catch (e) {
    // Any failure (network, timeout, backend down, rate-limited) falls
    // back to a locally-built summary so the kiosk flow never hard-stops.
    return fallbackSummary({ answers, mode, docs, redFlag });
  } finally {
    clearTimeout(timeout);
  }
}

function fallbackSummary({ answers, mode, docs, redFlag }) {
  const get = (section) => answers.filter((a) => a.section === section).map((a) => a.answer).join(", ");
  const lines = [
    `CHIEF COMPLAINT\n${get("Chief Complaint") || "Nil contributory."}`,
    `HISTORY OF PRESENT ILLNESS\n${get("History of Present Illness") || "Nil contributory."}`,
    `PAST MEDICAL & SURGICAL HISTORY\n${get("Past Medical History")}, ${get("Past Surgical History")}`,
    `DRUG & ALLERGY HISTORY\n${get("Drug & Allergy History") || "Nil contributory."}`,
    `FAMILY HISTORY\n${get("Family History") || "Nil contributory."}`,
    `PERSONAL HISTORY\n${get("Personal History") || "Nil contributory."}`,
    `REVIEW OF SYSTEMS\n${get("Review of Systems") || "Nil contributory."}`,
    `PRIOR INVESTIGATIONS SUMMARY\n${docs.map((d) => `${d.label} (${d.date})`).join("; ") || "No prior documents uploaded."}`,
  ];
  if (mode === "ayush") lines.push(`AYURVEDIC ASSESSMENT\n${get("Prakriti Assessment (Ayurveda)") || "Nil contributory."}`);
  return lines.join("\n\n");
}

/* ---------------------------------------------------------------
   3D TILT — a small reusable hook. Any element that spreads
   {ref, style, onMouseMove, onMouseLeave} onto itself gets a
   cursor-tracked 3D tilt. This is what makes buttons, chips,
   language tiles and document rows all feel physically pressable.
----------------------------------------------------------------*/
function useTilt(maxTilt = 10) {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setRot({ x: (0.5 - py) * maxTilt, y: (px - 0.5) * maxTilt });
  };
  const onMouseLeave = () => {
    setRot({ x: 0, y: 0 });
    setPressed(false);
  };
  const onMouseDown = () => setPressed(true);
  const onMouseUp = () => setPressed(false);

  const magnitude = Math.abs(rot.x) + Math.abs(rot.y);
  const scale = pressed ? 0.96 : magnitude > 0 ? 1 + Math.min(magnitude, 20) / 260 : 1;

  const style = {
    transform: `perspective(700px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${scale})`,
    transition: "transform 0.15s ease-out",
  };
  return { ref, style, onMouseMove, onMouseLeave, onMouseDown, onMouseUp };
}

// Larger surfaces (hero panels, question card) — tilt + a soft moving
// highlight, so the panel reads as a raised, softly-lit card.
function glassStyle(extra = {}) {
  return {
    background: C.surface,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${C.line}`,
    boxShadow: "0 20px 45px -28px rgba(32,36,31,0.18), 0 2px 10px rgba(32,36,31,0.06)",
    ...extra,
  };
}

function TiltCard({ children, className = "", style = {}, maxTilt = 7, radius = 20 }) {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 30, o: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setRot({ x: (0.5 - py) * maxTilt * 2, y: (px - 0.5) * maxTilt * 2 });
    setGlare({ x: px * 100, y: py * 100, o: 0.35 });
  };
  const onLeave = () => {
    setRot({ x: 0, y: 0 });
    setGlare((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        transform: `perspective(1400px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition: "transform 0.25s ease-out",
        transformStyle: "preserve-3d",
        ...glassStyle(),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: glare.o,
          transition: "opacity 0.35s ease",
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.35), transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />
      <div style={{ position: "relative", transform: "translateZ(16px)", transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
}

// Ambient backdrop: a dark, warm, out-of-focus scene — like a room lit
// by string lights shot at a wide aperture — behind the frosted glass UI.
// Built from layered soft-edged glows instead of a photo so it stays
// dependency-free; the blobs drift slowly and nudge toward the cursor.
function GradientBackdrop() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: `radial-gradient(140% 100% at 50% 0%, #FFFFFF, ${C.bg0} 55%, ${C.bg1} 100%)` }}>
      {/* soft mint bloom, upper-left */}
      <div style={{ position: "absolute", top: "-14%", left: "-10%", width: 620, height: 620, animation: "floatBlobA 26s ease-in-out infinite" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(127,224,190,0.35), transparent 68%)",
            filter: "blur(50px)",
            transform: `translate(${mouse.x * 22}px, ${mouse.y * 22}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>
      {/* soft periwinkle bloom, lower-right */}
      <div style={{ position: "absolute", bottom: "-18%", right: "-12%", width: 680, height: 680, animation: "floatBlobB 30s ease-in-out infinite" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,140,255,0.16), transparent 70%)",
            filter: "blur(56px)",
            transform: `translate(${mouse.x * -18}px, ${mouse.y * -18}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>
      {/* small mint highlight, center-right */}
      <div style={{ position: "absolute", top: "38%", right: "18%", width: 260, height: 260, animation: "floatBlobA 20s ease-in-out infinite reverse" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(169,240,214,0.4), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      {/* faint grain/texture so flat light areas don't band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(32,36,31,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(32,36,31,0.02) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(circle at 50% 0%, black, transparent 75%)",
        }}
      />
    </div>
  );
}

function HeartbeatLine({ color = C.primary, height = 56 }) {
  const d = "M0,30 L40,30 L54,10 L68,50 L82,4 L96,30 L150,30 L164,14 L178,48 L192,30 L300,30";
  return (
    <svg viewBox="0 0 300 60" style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 420, strokeDashoffset: 420, animation: "dashMove 2.2s cubic-bezier(0.4,0,0.2,1) 0.2s forwards" }}
      />
    </svg>
  );
}

function PulseRing({ color }) {
  return (
    <span style={{ position: "absolute", inset: 0, borderRadius: "9999px" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "9999px", background: color, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
    </span>
  );
}

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES — each carries its own 3D tilt via useTilt
----------------------------------------------------------------*/
function Chip({ children, onClick, active }) {
  // Keep answer chips as plain, reliable controls. The old 3D tilt handler
  // could interfere with pointer interaction on kiosk screens.
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-1.5 text-left px-4 py-3 rounded-full text-sm font-medium"
      style={{
        position: "relative",
        zIndex: 30,
        width: "100%",
        minHeight: 48,
        pointerEvents: "auto",
        touchAction: "manipulation",
        cursor: "pointer",
        border: `1.5px solid ${active ? "transparent" : C.line}`,
        background: active ? C.primary : "#FFFFFF",
        color: active ? "#0B2A20" : C.ink,
        boxShadow: active ? "0 8px 18px -10px rgba(63,174,134,0.55)" : "0 2px 6px -2px rgba(32,36,31,0.08)",
      }}
    >
      {active && <Check size={14} strokeWidth={3} />}
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, full, disabled, type = "button" }) {
  const tilt = useTilt(disabled ? 0 : 10);
  return (
    <button
      ref={tilt.ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseDown={tilt.onMouseDown}
      onMouseUp={tilt.onMouseUp}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm ${full ? "w-full" : ""}`}
      style={{
        ...tilt.style,
        position: "relative",
        zIndex: 5,
        pointerEvents: "auto",
        touchAction: "manipulation",
        background: disabled ? "#E7EAE5" : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
        color: disabled ? "#A2ABA3" : "#0B2A20",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 12px 28px -10px rgba(63,174,134,0.5)",
      }}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon }) {
  const tilt = useTilt(10);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseDown={tilt.onMouseDown}
      onMouseUp={tilt.onMouseUp}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm"
      style={{ ...tilt.style, background: "#FFFFFF", color: C.ink, border: `1.5px solid ${C.line}`, boxShadow: "0 2px 6px -2px rgba(32,36,31,0.08)" }}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="text-xs font-semibold tracking-wide" style={{ color: C.primary }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
   TOP NAV — a floating glass capsule, not a full-width bar, echoing
   the pill-shaped chrome throughout the reference UI.
----------------------------------------------------------------*/
function TopNav({ screen, onNavigate, resetAll }) {
  const navItems = [
    { id: "landing", label: "Overview", icon: Activity },
    { id: "language", label: "Patient kiosk", icon: ClipboardList, group: ["language", "consent", "interview", "documents", "summary", "submitted"] },
    { id: "aiChat", label: "AI assistant", icon: Sparkles },
    { id: "hospitals", label: "Find care", icon: MapPin },
    { id: "pharmacy", label: "Pharmacy", icon: Pill },
    { id: "medication", label: "Medication", icon: Clock },
    { id: "doctors", label: "Doctors", icon: MessageCircle },
    { id: "physician", label: "Physician view", icon: ShieldCheck },
  ];
  const isItemActive = (t) => (t.group ? t.group.includes(screen) : screen === t.id);

  return (
    <div className="sticky top-4 z-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full" style={glassStyle()}>
          <button onClick={() => { resetAll(); onNavigate("landing"); }} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`, boxShadow: "0 6px 16px -6px rgba(63,174,134,0.5)" }}>
              <Stethoscope size={16} color="#06201C" />
            </div>
            <span className="text-base font-semibold hidden sm:inline" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>MediKiosk</span>
          </button>

          {/* One linear row on every screen size — items sit directly in
              the bar and the strip itself scrolls horizontally rather
              than wrapping, or collapsing behind a menu button. */}
          <div className="flex items-center gap-1 overflow-x-auto mk-navscroll flex-1 min-w-0">
            {navItems.map((t) => {
              const active = isItemActive(t);
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onNavigate(t.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0"
                  style={{
                    background: active ? C.primary : "transparent",
                    color: active ? "#0B2A20" : C.inkSoft,
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: LANDING
----------------------------------------------------------------*/
function Landing({ onStart, onNavigate }) {
  return (
    <div className="mk-screen max-w-5xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
          <SectionLabel>AI clinical intake, at the point of arrival</SectionLabel>
          <h1 className="mt-3 text-5xl leading-[1.08]" style={{ fontFamily: "Fraunces, serif", color: C.ink, fontWeight: 500 }}>
            A two-minute consult starts with the history already written.
          </h1>
          <p className="mt-5 text-base leading-relaxed" style={{ color: C.inkSoft, maxWidth: "46ch" }}>
            India's public OPDs give doctors 2–5 minutes per patient. MediKiosk lets patients speak or
            tap their history and scan their old prescriptions before they ever sit down — so the
            consultation can be spent examining, reasoning, and treating.
          </p>
          <div className="flex gap-3 mt-8">
            <PrimaryButton onClick={onStart} icon={ChevronRight}>Try the patient kiosk</PrimaryButton>
            <GhostButton onClick={() => onNavigate("physician")} icon={Stethoscope}>See physician view</GhostButton>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>2–5 min</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>current OPD consult time, India</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>70–80%</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>diagnoses reachable from history alone</div>
            </div>
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, serif", color: C.primary }}>10,000+</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>daily OPD patients at apex hospitals</div>
            </div>
          </div>
        </div>

        <TiltCard className="p-6" radius={22} maxTilt={7}>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} color={C.primary} />
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>Vitals captured before the doctor sees the patient</span>
          </div>
          <HeartbeatLine />
          <div className="flex items-center gap-2 mb-4 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ background: C.success }} />
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>What the platform does, in order</span>
          </div>
          {[
            ["Identify", "Patient logs in with ABHA ID, picks a language, gives audio-guided consent."],
            ["Converse", "AI conducts a voice + touch history interview; red flags trigger priority triage."],
            ["Scan", "Prior prescriptions and lab reports are digitized and placed on a timeline."],
            ["Summarize & Route", "A structured history is generated and pushed to HIS and the patient's ABHA record."],
            ["Consult", "The physician opens a complete history in seconds and spends the visit on care."],
          ].map(([title, body], i) => (
            <div key={title} className="flex gap-4 py-3" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5" style={{ background: C.primaryPale, color: C.primary, transform: "translateZ(14px)" }}>
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>{title}</div>
                <div className="text-sm mt-0.5" style={{ color: C.inkSoft }}>{body}</div>
              </div>
            </div>
          ))}
        </TiltCard>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: LANGUAGE + MODE SELECT
----------------------------------------------------------------*/
function LanguageTile({ label, active, onClick }) {
  const tilt = useTilt(14);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseDown={tilt.onMouseDown}
      onMouseUp={tilt.onMouseUp}
      className="py-5 rounded-xl text-lg font-semibold"
      style={{ ...tilt.style, border: `1.5px solid ${active ? C.primary : C.line}`, background: active ? C.primaryPale : "rgba(255,255,255,0.08)", color: C.ink }}
    >
      {label}
    </button>
  );
}

function ModeTile({ label, active, onClick }) {
  const tilt = useTilt(10);
  return (
    <button
      ref={tilt.ref}
      onClick={onClick}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseDown={tilt.onMouseDown}
      onMouseUp={tilt.onMouseUp}
      className="py-4 rounded-xl text-sm font-semibold"
      style={{ ...tilt.style, border: `1.5px solid ${active ? C.primary : C.line}`, background: active ? C.primaryPale : "rgba(255,255,255,0.08)", color: C.ink }}
    >
      {label}
    </button>
  );
}

function LanguageSelect({ onNext, mode, setMode, language, setLanguage, notice }) {
  return (
    <KioskFrame step={0} totalSteps={0} hideProgress>
      <div className="text-center max-w-lg mx-auto">
        {notice && (
          <div className="mb-5 px-4 py-2.5 rounded-xl text-xs font-medium text-left" style={{ background: C.accentPale, color: C.accent }}>
            {notice}
          </div>
        )}
        <Languages size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Choose your language</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>भाषा चुनें · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</p>
        <div className="grid grid-cols-2 gap-3 mt-8">
          {LANGS.map((l) => (
            <LanguageTile key={l.id} label={l.label} active={language === l.id} onClick={() => setLanguage(l.id)} />
          ))}
        </div>

        <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Which OPD is this for?</div>
          <div className="grid grid-cols-2 gap-3">
            <ModeTile label="General / Allopathic" active={mode === "general"} onClick={() => setMode("general")} />
            <ModeTile label="AYUSH / Ayurveda" active={mode === "ayush"} onClick={() => setMode("ayush")} />
          </div>
        </div>

        <div className="mt-10">
          <PrimaryButton onClick={onNext} icon={ChevronRight} full>Continue</PrimaryButton>
        </div>
      </div>
    </KioskFrame>
  );
}

/* ---------------------------------------------------------------
   SCREEN: CONSENT
----------------------------------------------------------------*/
function Consent({ onNext, language }) {
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

    // Google already gave us a verified session token — nothing more to do,
    // this is the "don't complicate it" fast path.
    if (method === "google") {
      onNext(googleIdentity.accessToken);
      return;
    }

    // Manual ABHA entry: get a lightweight, rate-limited kiosk session token
    // in the background so the AI summary step later has something to
    // authenticate with — the patient never sees this happen or types a
    // password for it.
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/patient-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abhaId: abha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't start your session. Please try again.");
        return;
      }
      onNext(data.accessToken);
    } catch (err) {
      // No backend reachable (e.g. running this build without the /backend
      // service up). Rather than dead-ending the whole kiosk flow on a
      // network hiccup, fall back to a local session token so the patient
      // can still complete intake — same pattern generateClinicalSummary()
      // already uses for the AI summary step. A locally-issued token simply
      // won't sync to ABHA or a real HIS until a backend is connected.
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
                    // Only allow digits and hyphens, capped at a sane length —
                    // matches the backend's own validation.
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

/* ---------------------------------------------------------------
   SCREEN: STAFF AUTH GATE
   Staff need an account before they can log in, so this toggles
   between sign-up and sign-in. Both support Google as a shortcut —
   but Google only grants the staff role for pre-approved emails
   (checked server-side; see routes/googleAuth.js).
----------------------------------------------------------------*/
function StaffAuthGate({ onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  return mode === "login" ? (
    <StaffLogin onSuccess={onSuccess} onSwitchToSignup={() => setMode("signup")} />
  ) : (
    <StaffSignup onSuccess={onSuccess} onSwitchToLogin={() => setMode("login")} />
  );
}

function GoogleErrorNotice({ error }) {
  if (!error) return null;
  return (
    <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-3" style={{ background: C.alertPale, color: C.alert }}>
      {error}
    </div>
  );
}

function StaffSignup({ onSuccess, onSwitchToLogin }) {
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
      const res = await fetch(`${API_BASE_URL}/auth/staff/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, staffId, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign-up failed. Please try again.");
        return;
      }
      onSuccess(data.accessToken || data.token);
    } catch (err) {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleError("");
    try {
      const data = await exchangeGoogleCredential(credential, "staff");
      onSuccess(data.accessToken || data.token);
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

/* ---------------------------------------------------------------
   SCREEN: STAFF LOGIN
   Gates access to the kiosk/physician views. Talks to the secure
   backend's /api/auth/staff/login — all brute-force and lockout logic
   lives server-side; this screen just surfaces it clearly and
   stops itself from spamming the endpoint.
----------------------------------------------------------------*/
function StaffLogin({ onSuccess, onSwitchToSignup }) {
  const [abhaId, setAbhaId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

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
    if (isBlocked) return; // hard stop against double-submits and spam-clicking

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abhaId, password }),
      });
      const data = await res.json();

      if (res.status === 429) {
        // Backend told us to back off — respect it with a visible client-side
        // cooldown so the user can't just mash the button anyway.
        const match = /(\d+)\s*minute/.exec(data.error || "");
        const minutes = match ? parseInt(match[1], 10) : 1;
        setCooldownUntil(Date.now() + minutes * 60 * 1000);
        setError(data.error || "Too many attempts. Please wait.");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        // Small client-side cooldown between attempts even on ordinary
        // failures, so a human (or a bot ignoring the rate limiter) can't
        // fire requests back-to-back with zero delay.
        setCooldownUntil(Date.now() + 2000);
        return;
      }

      onSuccess(data.accessToken || data.token);
    } catch (err) {
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
      onSuccess(data.accessToken || data.token);
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

/* ---------------------------------------------------------------
   KIOSK FRAME
----------------------------------------------------------------*/
function KioskFrame({ children, step, totalSteps, hideProgress, sectionLabel }) {
  return (
    <div className="mk-screen max-w-2xl mx-auto px-6 py-12">
      {!hideProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: C.accent }}>{sectionLabel}</span>
            <span className="text-xs" style={{ color: C.inkSoft }}>{step} of {totalSteps}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.32)" }}>
            <div className="h-full rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${C.primaryLight}, ${C.accent})`, transition: "width 0.35s ease" }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
   SHARED: CHAT PANEL (E2EE)
   Renders one conversation thread. Used both by the patient-facing
   Doctors screen and the staff inbox in PhysicianView — same crypto,
   same wire format, just a different peer.
----------------------------------------------------------------*/
function ChatPanel({ thread, peerName, onSend, wsError }) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.length]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    try {
      await onSend(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden" style={{ ...glassStyle(), height: 480 }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: C.primaryPale, color: C.primary }}>
          {(peerName || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ color: C.ink }}>{peerName || "Conversation"}</div>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: C.success }}>
            <Lock size={10} /> End-to-end encrypted
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {(!thread || thread.length === 0) && (
          <div className="text-xs text-center mt-10" style={{ color: C.inkSoft }}>No messages yet — say hello.</div>
        )}
        {(thread || []).map((m, i) => (
          <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[75%] px-3.5 py-2 rounded-2xl text-sm"
              style={{
                background: m.mine ? `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})` : "rgba(255,255,255,0.08)",
                color: m.mine ? "#06201C" : m.error ? C.alert : C.ink,
                borderBottomRightRadius: m.mine ? 4 : 16,
                borderBottomLeftRadius: m.mine ? 16 : 4,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {wsError && (
        <div className="px-5 py-1.5 text-[11px]" style={{ color: C.alert }}>{wsError}</div>
      )}

      <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.line}` }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${C.line}`, color: C.ink }}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`, opacity: !draft.trim() || sending ? 0.5 : 1 }}
        >
          <Send size={16} color="#06201C" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: NEARBY HOSPITALS
   Uses the browser's own geolocation (no API key needed) plus the
   free OpenStreetMap Overpass API to find real hospitals & clinics
   around the patient, sorted by distance. Patients can call a
   facility directly (tel: link) or send a lightweight appointment
   request. There's no live scheduling backend for arbitrary outside
   facilities yet — the request is captured here and shown as sent;
   wire submitBooking() up to a real appointments endpoint (or a
   facility's own booking API) when one exists.
----------------------------------------------------------------*/
/* ---------------------------------------------------------------
   SPECIALTIES — used to let a patient filter nearby facilities by
   "who can treat this," and to match the AI assistant's suggested
   department. Keywords are matched against a facility's OSM name/
   tags client-side, since most OSM hospital entries don't carry a
   structured healthcare:speciality tag we can query reliably.
----------------------------------------------------------------*/
const SPECIALTIES = [
  { id: "general", label: "General / Any", keywords: [] },
  { id: "emergency", label: "Emergency / Trauma", keywords: ["emergency", "trauma", "casualty"] },
  { id: "cardiology", label: "Heart (Cardiology)", keywords: ["heart", "cardiac", "cardio"] },
  { id: "orthopedics", label: "Bones (Orthopedics)", keywords: ["ortho", "bone", "joint"] },
  { id: "pediatrics", label: "Child (Pediatrics)", keywords: ["child", "paediatric", "pediatric", "kids"] },
  { id: "gynecology", label: "Women's health", keywords: ["women", "gynaec", "gynec", "maternity", "obstetric"] },
  { id: "ent", label: "Ear, Nose & Throat", keywords: ["ent", "ear", "nose", "throat"] },
  { id: "dental", label: "Dental", keywords: ["dental", "dentist", "tooth"] },
  { id: "eye", label: "Eye (Ophthalmology)", keywords: ["eye", "ophthalm", "vision"] },
  { id: "dermatology", label: "Skin (Dermatology)", keywords: ["skin", "derma"] },
  { id: "neurology", label: "Brain & Nerves", keywords: ["neuro", "brain"] },
  { id: "psychiatry", label: "Mental health", keywords: ["mental", "psychiatr", "psychology"] },
];

// Maps the AI assistant's free-text suggested department onto one of the
// filter chips above, so "Cardiology" from a chat suggestion pre-selects
// the right filter when the patient moves to Find Care.
function matchSpecialtyId(freeText) {
  if (!freeText) return "general";
  const lower = freeText.toLowerCase();
  const hit = SPECIALTIES.find((s) => s.id !== "general" && s.keywords.some((k) => lower.includes(k)));
  return hit ? hit.id : "general";
}

function facilityMatchesSpecialty(hospital, specialtyId) {
  if (specialtyId === "general") return true;
  const spec = SPECIALTIES.find((s) => s.id === specialtyId);
  if (!spec) return true;
  const haystack = `${hospital.name} ${hospital.rawSpecialty || ""}`.toLowerCase();
  return spec.keywords.some((k) => haystack.includes(k));
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function HospitalCard({ hospital, onBook }) {
  return (
    <TiltCard className="p-4" maxTilt={2} radius={18}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{hospital.name}</div>
          {hospital.address && <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{hospital.address}</div>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: C.primaryDeep }}>{hospital.distanceKm.toFixed(1)} km away</span>
            {hospital.emergency && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.alertPale, color: C.alert }}>24/7 Emergency</span>
            )}
            {hospital.type === "clinic" && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.accentPale, color: C.accent }}>Clinic</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
          <Stethoscope size={18} color={C.primaryDeep} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {hospital.phone ? (
          <a href={`tel:${hospital.phone.replace(/[^\d+]/g, "")}`}>
            <GhostButton icon={Phone}>Call</GhostButton>
          </a>
        ) : (
          <a href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`} target="_blank" rel="noreferrer">
            <GhostButton icon={Navigation}>Directions</GhostButton>
          </a>
        )}
        <PrimaryButton icon={CalendarClock} onClick={() => onBook(hospital)}>Book appointment</PrimaryButton>
      </div>
    </TiltCard>
  );
}

function NearbyHospitals({ language, suggestedSpecialty }) {
  const [status, setStatus] = useState("idle"); // idle | locating | loading | ready | error
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [radiusKm] = useState(8);
  // Pre-select whatever department the AI assistant suggested, if any —
  // the patient can still change it before or after results load.
  const [specialty, setSpecialty] = useState(() => matchSpecialtyId(suggestedSpecialty));
  const [bookingFor, setBookingFor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: "", time: "", reason: "" });
  const [bookingSent, setBookingSent] = useState(false);

  const findNearby = () => {
    setError("");
    setStatus("locating");

    if (!navigator.geolocation) {
      setError("Location isn't supported in this browser. Please ask kiosk staff for the nearest hospital.");
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus("loading");
        try {
          const radiusM = radiusKm * 1000;
          const query = `[out:json][timeout:25];(
            node["amenity"="hospital"](around:${radiusM},${latitude},${longitude});
            way["amenity"="hospital"](around:${radiusM},${latitude},${longitude});
            node["amenity"="clinic"](around:${radiusM},${latitude},${longitude});
            way["amenity"="clinic"](around:${radiusM},${latitude},${longitude});
          );out center 40;`;

          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });
          if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
          const data = await res.json();

          const results = (data.elements || [])
            .map((el) => {
              const lat = el.lat ?? el.center?.lat;
              const lon = el.lon ?? el.center?.lon;
              if (lat == null || lon == null) return null;
              const tags = el.tags || {};
              const addressParts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean);
              return {
                id: `${el.type}-${el.id}`,
                name: tags.name || (tags.amenity === "clinic" ? "Unnamed clinic" : "Unnamed hospital"),
                type: tags.amenity,
                phone: tags.phone || tags["contact:phone"] || null,
                address: addressParts.length ? addressParts.join(", ") : null,
                emergency: tags.emergency === "yes",
                // Free-text hints only — OSM rarely tags structured specialties,
                // so this is name/department text used for a soft client-side
                // filter, never a guarantee of what a facility treats.
                rawSpecialty: [tags["healthcare:speciality"], tags.healthcare, tags.department].filter(Boolean).join(" "),
                distanceKm: haversineKm(latitude, longitude, lat, lon),
                lat,
                lon,
              };
            })
            .filter(Boolean)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 20);

          setHospitals(results);
          setStatus("ready");
        } catch (err) {
          console.error("Nearby hospital lookup failed:", err);
          setError("Couldn't reach the hospital directory right now. Please check your connection and try again.");
          setStatus("error");
        }
      },
      (geoErr) => {
        setStatus("error");
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location access is blocked. Allow location permission for this site and try again.");
        } else {
          setError("Couldn't get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const openBooking = (hospital) => {
    setBookingFor(hospital);
    setBookingForm({ name: "", time: "", reason: "" });
    setBookingSent(false);
  };

  const submitBooking = () => {
    if (!bookingForm.name.trim() || !bookingForm.time.trim()) return;
    setBookingSent(true);
  };

  // Client-side only — never re-fetches on filter change. Falls back to
  // showing every nearby result (with a note) when the chosen specialty
  // has no name/tag matches, since most facilities aren't tagged with a
  // structured specialty and an empty list would be a dead end.
  const specialtyMatches = specialty === "general" ? hospitals : hospitals.filter((h) => facilityMatchesSpecialty(h, specialty));
  const usedFallback = specialty !== "general" && hospitals.length > 0 && specialtyMatches.length === 0;
  const visibleHospitals = usedFallback ? hospitals : specialtyMatches;

  return (
    <div className="mk-screen max-w-2xl mx-auto px-6 py-10">
      <div className="text-center mb-6">
        <MapPin size={26} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-3" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Find nearby care</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          We'll use your device's location to find hospitals and clinics near you.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2.5 justify-center">
          <Filter size={13} color={C.inkSoft} />
          <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>Who do you need to see?</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SPECIALTIES.map((s) => (
            <Chip key={s.id} active={specialty === s.id} onClick={() => setSpecialty(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      {status === "idle" && (
        <div className="flex justify-center">
          <PrimaryButton onClick={findNearby} icon={MapPin}>Use my location</PrimaryButton>
        </div>
      )}
      {status === "locating" && (
        <div className="text-center text-sm" style={{ color: C.inkSoft }}>Getting your location…</div>
      )}
      {status === "loading" && (
        <div className="text-center text-sm" style={{ color: C.inkSoft }}>Searching nearby hospitals & clinics…</div>
      )}

      {error && (
        <div className="text-sm font-semibold px-4 py-3 rounded-xl mt-4 text-center" style={{ background: C.alertPale, color: C.alert }}>
          {error}
        </div>
      )}
      {status === "error" && (
        <div className="flex justify-center mt-4">
          <GhostButton onClick={findNearby} icon={MapPin}>Try again</GhostButton>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs" style={{ color: C.inkSoft }}>
              {visibleHospitals.length} found within {radiusKm}km
              {specialty !== "general" && !usedFallback && ` · matching "${SPECIALTIES.find((s) => s.id === specialty)?.label}"`}
            </div>
            <GhostButton onClick={findNearby} icon={MapPin}>Refresh</GhostButton>
          </div>
          {usedFallback && (
            <div className="text-xs px-3 py-2 rounded-lg mb-3" style={{ background: C.accentPale, color: C.ink }}>
              No nearby listing was clearly tagged for that department — showing all nearby facilities instead. Call ahead to confirm they can treat you.
            </div>
          )}
          {visibleHospitals.length === 0 ? (
            <div className="text-sm text-center py-10" style={{ color: C.inkSoft }}>
              No hospitals or clinics found nearby. Please ask kiosk staff for help.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleHospitals.map((h) => (
                <HospitalCard key={h.id} hospital={h} onBook={openBooking} />
              ))}
            </div>
          )}
        </>
      )}

      {bookingFor && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4" style={{ background: "rgba(32,36,31,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={glassStyle({ background: "#FFFFFF" })}>
            {!bookingSent ? (
              <>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>Request an appointment</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>{bookingFor.name}</div>
                <div className="space-y-3 mt-4">
                  <input
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.line}`, background: "#FFFFFF", color: C.ink }}
                  />
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
                <div className="flex gap-2 mt-5">
                  <GhostButton onClick={() => setBookingFor(null)}>Cancel</GhostButton>
                  <PrimaryButton full onClick={submitBooking} disabled={!bookingForm.name.trim() || !bookingForm.time.trim()}>Send request</PrimaryButton>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={32} color={C.success} className="mx-auto" />
                <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>Request sent</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>
                  {bookingFor.name} will be notified of your appointment request and may call you to confirm.
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

/* ---------------------------------------------------------------
   SCREEN: DOCTORS (patient-facing)
   Lists doctors currently online (real-time, from the WS presence
   layer) and opens an E2EE chat with whichever one the patient picks.
----------------------------------------------------------------*/
function DoctorsScreen({ messaging, suggestedSpecialty }) {
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ time: "", reason: "" });
  const [bookingSent, setBookingSent] = useState(false);

  const openBooking = (doc) => {
    setBookingFor(doc);
    setBookingForm({ time: "", reason: "" });
    setBookingSent(false);
  };

  // Sent as a normal end-to-end-encrypted chat message to the doctor —
  // there's no separate scheduling backend, so the request rides the same
  // channel a message would, just pre-formatted and easy to spot.
  const submitBooking = async () => {
    if (!bookingForm.time.trim() || !bookingFor) return;
    const text = `Appointment request — preferred time: ${bookingForm.time.trim()}${bookingForm.reason.trim() ? `; reason: ${bookingForm.reason.trim()}` : ""}`;
    try {
      await messaging.sendMessage(bookingFor.id, text, bookingFor.publicKeyJwk);
      setBookingSent(true);
    } catch {
      // sendMessage failures already surface via messaging.wsError in the
      // chat panel; the modal just stays open so the patient can retry.
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

/* ---------------------------------------------------------------
   SCREEN: MEDICATION TRACKER
   A weekly adherence grid, styled after a daily-habit tracker —
   patients mark today's dose taken/missed; the week's history and
   an adherence ring come from the backend so it survives refreshes.
----------------------------------------------------------------*/
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

// Offline fallback storage for the medication log, keyed per patient
// session so one shared kiosk browser doesn't mix up two patients' logs.
// Used only when /medication/log can't be reached — see MedicationTracker
// below — so a "Taken" tap always saves something rather than failing.
function medicationLogKey(patientToken) {
  return `medikiosk.medlog.${patientToken || "anon"}`;
}
function loadLocalMedicationLog(patientToken) {
  try {
    const raw = window.localStorage.getItem(medicationLogKey(patientToken));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveLocalMedicationEntry(patientToken, date, taken) {
  const entries = loadLocalMedicationLog(patientToken).filter((e) => e.date !== date);
  entries.push({ date, taken });
  try {
    window.localStorage.setItem(medicationLogKey(patientToken), JSON.stringify(entries));
  } catch {
    // Storage may be unavailable (private browsing, quota) — the UI still
    // reflects the change for this session even if it won't persist.
  }
  return entries;
}

function MedicationTracker({ patientToken, onOrderMedicine }) {
  const [entries, setEntries] = useState([]);
const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const todayISO = toISODate(today);

  useEffect(() => {
    if (!patientToken) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/medication/log`, {
          headers: { Authorization: `Bearer ${patientToken}` },
        });
        const data = await res.json();
        if (res.ok) { setEntries(data.entries || []); setOffline(false); }
        else setError(data.error || "Couldn't load your medication log.");
      } catch {
        // Backend unreachable — read whatever this patient session has
        // saved locally instead of showing a permanently empty tracker.
        setEntries(loadLocalMedicationLog(patientToken));
        setOffline(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientToken]);

  const entryFor = (iso) => entries.find((e) => e.date === iso);

  const toggleToday = async (taken) => {
    setSaving(true);
    setError("");
    if (offline) {
      // Already known to be offline this session — save locally straight
      // away instead of waiting out another failed request.
      setEntries(saveLocalMedicationEntry(patientToken, todayISO, taken));
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/medication/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(patientToken ? { Authorization: `Bearer ${patientToken}` } : {}),
        },
        body: JSON.stringify({ date: todayISO, taken }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Couldn't save."); return; }
      setEntries(data.entries || []);
    } catch {
      setOffline(true);
      setEntries(saveLocalMedicationEntry(patientToken, todayISO, taken));
    } finally {
      setSaving(false);
    }
  };

  const weekTaken = weekDates.filter((d) => entryFor(toISODate(d))?.taken).length;
  const weekPossible = weekDates.filter((d) => toISODate(d) <= todayISO).length;
  const adherencePct = weekPossible > 0 ? Math.round((weekTaken / weekPossible) * 100) : 0;
  const ringCirc = 2 * Math.PI * 42;

  const todayEntry = entryFor(todayISO);

  return (
    <div className="mk-screen max-w-lg mx-auto px-6 py-10">
      <ShieldCheck size={26} color={C.primary} />
      <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Medication tracker</h2>
      <p className="text-sm mt-2" style={{ color: C.inkSoft }}>Log whether you took today's dose — this helps your doctor see your adherence at a glance.</p>
      {offline && !loading && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: C.warning }}>
          <AlertTriangle size={12} /> Saving on this device only until the connection is back.
        </div>
      )}

      {loading ? (
        <div className="mt-10 text-center text-sm" style={{ color: C.inkSoft }}>Loading…</div>
      ) : (
        <>
          <div className="mt-6 rounded-3xl p-6 flex items-center gap-6" style={glassStyle()}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke={C.primary} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringCirc - (ringCirc * adherencePct) / 100}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill={C.ink}>{adherencePct}%</text>
            </svg>
            <div>
              <div className="text-xs font-semibold" style={{ color: C.inkSoft }}>This week's adherence</div>
              <div className="text-sm mt-1" style={{ color: C.ink }}>{weekTaken} of {weekPossible} days logged as taken</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-5" style={glassStyle()}>
            <div className="text-xs font-semibold mb-3" style={{ color: C.inkSoft }}>This week</div>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((d) => {
                const iso = toISODate(d);
                const e = entryFor(iso);
                const isToday = iso === todayISO;
                const isFuture = iso > todayISO;
                let bg = "rgba(255,255,255,0.06)";
                if (e?.taken) bg = C.primary;
                else if (e && !e.taken) bg = C.alertPale;
                return (
                  <div key={iso} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: C.inkSoft }}>{d.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: bg, border: isToday ? `2px solid ${C.primary}` : "none", opacity: isFuture ? 0.35 : 1 }}
                    >
                      {e?.taken && <Check size={14} color="#06201C" />}
                      {e && !e.taken && <X size={12} color={C.alert} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-5" style={glassStyle()}>
            <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Today's dose</div>
            <div className="flex gap-3">
              <PrimaryButton onClick={() => toggleToday(true)} icon={Check} disabled={saving}>
                {todayEntry?.taken ? "Marked as taken ✓" : "Taken"}
              </PrimaryButton>
              <GhostButton onClick={() => toggleToday(false)} icon={X}>
                {todayEntry && !todayEntry.taken ? "Marked as missed" : "Missed"}
              </GhostButton>
            </div>
          </div>

          {onOrderMedicine && (
            <button
              onClick={onOrderMedicine}
              className="w-full mt-6 flex items-center gap-3 p-4 rounded-2xl text-left"
              style={glassStyle()}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
                <Pill size={18} color={C.primaryDeep} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: C.ink }}>Running low? Order a refill</div>
                <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>Order your medicines online for home delivery</div>
              </div>
              <ChevronRight size={16} color={C.inkSoft} />
            </button>
          )}

          {error && (
            <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-4" style={{ background: C.alertPale, color: C.alert }}>{error}</div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: PHARMACY / ORDER MEDICINES ONLINE
   A lightweight storefront — search/browse, cart, and a delivery
   checkout. There's no payments or fulfillment backend wired up
   yet (see placeOrder() below for where a real pharmacy partner or
   payment gateway would plug in); this is a working, self-contained
   demo of the flow rather than a live order.
----------------------------------------------------------------*/
const MEDICINE_CATEGORIES = ["All", "Pain & Fever", "Cold & Cough", "Stomach care", "Diabetes care", "Heart care", "First aid", "Vitamins & supplements", "Baby & mother care", "Devices"];

// Demo payment options — no real payment gateway is wired up (there's no
// backend to take card/UPI numbers securely), so this only records which
// method the patient intends to use; staff settle the actual transaction
// at pickup/delivery the same way they would today.
const PAYMENT_METHODS = [
  { id: "upi", label: "UPI at pharmacy", sub: "GPay, PhonePe, Paytm & other UPI apps", icon: Smartphone },
  { id: "card", label: "Card at pharmacy", sub: "Debit or credit card at the counter", icon: CreditCard },
  { id: "netbanking", label: "Net banking", sub: "Choose this if staff will guide the payment", icon: Landmark },
  { id: "cod", label: "Cash on delivery / pickup", sub: "Pay the pharmacy staff when fulfilled", icon: Banknote },
];

const ADDRESS_LABELS = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "other", label: "Other", icon: MapPin },
];

const MEDICINE_CATALOG_SEED = [
  { id: "med-paracetamol", name: "Paracetamol 500mg", category: "Pain & Fever", packSize: "Strip of 10 tablets", price: 25, rx: false },
  { id: "med-ibuprofen", name: "Ibuprofen 400mg", category: "Pain & Fever", packSize: "Strip of 10 tablets", price: 35, rx: false },
  { id: "med-ors", name: "ORS Rehydration Sachets", category: "Stomach care", packSize: "Box of 10 sachets", price: 60, rx: false },
  { id: "med-antacid", name: "Antacid Syrup", category: "Stomach care", packSize: "170ml bottle", price: 95, rx: false },
  { id: "med-coughsyrup", name: "Cough Syrup (dry cough)", category: "Cold & Cough", packSize: "100ml bottle", price: 110, rx: false },
  { id: "med-cetirizine", name: "Cetirizine 10mg", category: "Cold & Cough", packSize: "Strip of 10 tablets", price: 30, rx: false },
  { id: "med-metformin", name: "Metformin 500mg", category: "Diabetes care", packSize: "Strip of 15 tablets", price: 45, rx: true },
  { id: "med-glucostrips", name: "Glucometer test strips", category: "Diabetes care", packSize: "Box of 25 strips", price: 450, rx: false },
  { id: "med-amlodipine", name: "Amlodipine 5mg", category: "Heart care", packSize: "Strip of 10 tablets", price: 40, rx: true },
  { id: "med-bpmonitor", name: "Digital BP monitor", category: "Devices", packSize: "1 unit", price: 1499, rx: false },
  { id: "med-thermometer", name: "Digital thermometer", category: "Devices", packSize: "1 unit", price: 199, rx: false },
  { id: "med-bandage", name: "Adhesive bandages", category: "First aid", packSize: "Box of 20", price: 55, rx: false },
  { id: "med-antiseptic", name: "Antiseptic liquid", category: "First aid", packSize: "100ml bottle", price: 75, rx: false },
  { id: "med-multivitamin", name: "Daily multivitamin", category: "Vitamins & supplements", packSize: "Bottle of 30 tablets", price: 220, rx: false },
  { id: "med-calcium", name: "Calcium + Vitamin D3", category: "Vitamins & supplements", packSize: "Strip of 15 tablets", price: 140, rx: false },
  { id: "med-babyors", name: "Infant ORS", category: "Baby & mother care", packSize: "Box of 6 sachets", price: 70, rx: false },
];

// Turns a medicine name into a stable-ish unique id, deduped against
// whatever's already in the catalog (handles re-adding similar names).
function slugifyMedicineId(name, existingIds) {
  const base = "med-" + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let id = base || `med-${Date.now()}`;
  let n = 2;
  while (existingIds.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

const EMPTY_MEDICINE_FORM = { name: "", category: "Pain & Fever", packSize: "", price: "", rx: false };

function loadPharmacyOrders() {
  try {
    const raw = window.localStorage.getItem("medikiosk.pharmacy.orders");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePharmacyOrders(orders) {
  try {
    window.localStorage.setItem("medikiosk.pharmacy.orders", JSON.stringify(orders));
  } catch {
    // The order remains visible in React state even if browser storage is unavailable.
  }
}

function PharmacyScreen({
  isStaff = false,
  patientToken = null,
  staffToken = null,
  catalog,
  onCatalogLoaded,
  onAddMedicine,
  onRequestStaffAccess,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [view, setView] = useState("browse");
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", addressLabel: "home" });
  const [rxFile, setRxFile] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [newMedicine, setNewMedicine] = useState(EMPTY_MEDICINE_FORM);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressCoords, setAddressCoords] = useState(null);
  const [orders, setOrders] = useState(() => loadPharmacyOrders());
  const [orderNotice, setOrderNotice] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const rxInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setCatalogLoading(true);
      setCatalogError("");

      try {
        const data = await pharmacyApi("/pharmacy/medicines", {
          token: isStaff ? staffToken : patientToken,
          signal: controller.signal,
        });
        const medicines = extractMedicineList(data);

        if (!cancelled && medicines.length) {
          onCatalogLoaded?.(medicines);
        } else if (!cancelled && !medicines.length) {
          setCatalogError("The pharmacy API returned no medicines. Showing the saved catalog.");
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          console.warn("Pharmacy catalog API unavailable:", err);
          setCatalogError("Couldn't reach the pharmacy inventory. Showing the saved catalog.");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }

      if (isStaff && staffToken) {
        try {
          const data = await pharmacyApi("/pharmacy/orders", {
            token: staffToken,
            signal: controller.signal,
          });
          const backendOrders = extractOrderList(data);
          if (!cancelled && backendOrders.length) setOrders(backendOrders);
        } catch (err) {
          if (!cancelled && err.name !== "AbortError") {
            console.warn("Pharmacy orders API unavailable:", err);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isStaff, staffToken, patientToken, onCatalogLoaded]);

  useEffect(() => {
    const refresh = () => setOrders(loadPharmacyOrders());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const persistOrders = (next) => {
    setOrders(next);
    savePharmacyOrders(next);
  };

  const useCurrentLocation = () => {
    setLocationError("");
    if (!("geolocation" in navigator)) {
      setLocationError("Location isn't available on this device/browser. Please type your address.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddressCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );
          if (!res.ok) throw new Error("Reverse geocoding failed");
          const data = await res.json();
          const readable = data?.display_name;
          setOrderForm((f) => ({
            ...f,
            address: readable || `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
          }));
        } catch {
          setOrderForm((f) => ({
            ...f,
            address: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
          }));
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied — please type your address instead."
            : "Couldn't get your location — please type your address instead."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const filtered = catalog.filter((m) => {
    const haystack = `${m.name} ${m.category} ${m.packSize}`.toLowerCase();
    const matchesCategory = category === "All" || m.category === category;
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const medicine = catalog.find((m) => m.id === id);
      return medicine ? { ...medicine, qty } : null;
    })
    .filter(Boolean);

  const canAddMedicine = !!(
    newMedicine.name.trim() &&
    newMedicine.packSize.trim() &&
    Number(newMedicine.price) > 0 &&
    MEDICINE_CATEGORIES.includes(newMedicine.category)
  );

  const submitNewMedicine = async () => {
    if (!canAddMedicine || !isStaff || placing) return;

    const id = slugifyMedicineId(newMedicine.name, new Set(catalog.map((m) => m.id)));
    const medicine = {
      id,
      name: newMedicine.name.trim(),
      category: newMedicine.category,
      packSize: newMedicine.packSize.trim(),
      price: Math.round(Number(newMedicine.price)),
      rx: !!newMedicine.rx,
    };

    setPlacing(true);
    setOrderNotice("");

    try {
      const data = await pharmacyApi("/pharmacy/medicines", {
        token: staffToken,
        method: "POST",
        body: medicine,
      });
      const savedMedicine = data?.medicine || data?.data || data || medicine;
      onAddMedicine?.(savedMedicine);
      setOrderNotice("Medicine added to the pharmacy inventory.");
    } catch (err) {
      console.warn("Could not save medicine through pharmacy API:", err);
      onAddMedicine?.(medicine);
      setOrderNotice("Medicine saved to the local catalog; backend inventory could not be updated.");
    } finally {
      setPlacing(false);
    }

    setNewMedicine(EMPTY_MEDICINE_FORM);
    setView("browse");
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const needsRx = cartItems.some((i) => i.rx);

  const setQty = (id, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 20);
      return next;
    });
  };

  const addToCart = (id) => setQty(id, (cart[id] || 0) + 1);

  const phoneValid = /^[+]?[\d\s-]{8,15}$/.test(orderForm.phone.trim());
  const canContinueToPayment = !!(
    cartItems.length > 0 &&
    orderForm.name.trim().length >= 2 &&
    phoneValid &&
    orderForm.address.trim().length >= 8 &&
    (!needsRx || rxFile)
  );
  const canPlaceOrder = canContinueToPayment && !!paymentMethod;

  const placeOrder = async () => {
    if (!canPlaceOrder || placing) return;

    const fallbackId = `MK-${Date.now().toString().slice(-8)}`;
    const localOrder = {
      id: fallbackId,
      createdAt: new Date().toISOString(),
      status: "pending",
      items: cartItems.map(({ id: medicineId, name, qty, price, rx }) => ({
        id: medicineId, name, qty, price, rx
      })),
      total: cartTotal,
      customer: {
        name: orderForm.name.trim(),
        phone: orderForm.phone.trim(),
        address: orderForm.address.trim(),
        addressLabel: orderForm.addressLabel,
        coordinates: addressCoords,
      },
      paymentMethod,
      prescriptionName: rxFile?.name || null,
    };

    setPlacing(true);
    setOrderNotice("");

    try {
      const data = await pharmacyApi("/pharmacy/orders", {
        token: patientToken,
        method: "POST",
        body: {
          items: localOrder.items,
          customer: localOrder.customer,
          paymentMethod: localOrder.paymentMethod,
          prescriptionName: localOrder.prescriptionName,
        },
      });

      const backendOrder = extractOrder(data);
      const order = {
        ...localOrder,
        ...(backendOrder && typeof backendOrder === "object" ? backendOrder : {}),
        id: backendOrder?.id || backendOrder?.orderId || fallbackId,
        status: backendOrder?.status || "pending",
        items: backendOrder?.items || localOrder.items,
        total: backendOrder?.total ?? localOrder.total,
        customer: backendOrder?.customer || localOrder.customer,
        paymentMethod: backendOrder?.paymentMethod || localOrder.paymentMethod,
        prescriptionName: backendOrder?.prescriptionName ?? localOrder.prescriptionName,
      };

      const nextOrders = [order, ...loadPharmacyOrders().filter((o) => o.id !== order.id)];
      persistOrders(nextOrders);
      setOrderId(order.id);
      setView("placed");
    } catch (err) {
      console.warn("Pharmacy order API unavailable:", err);
      const nextOrders = [localOrder, ...loadPharmacyOrders().filter((o) => o.id !== localOrder.id)];
      persistOrders(nextOrders);
      setOrderId(localOrder.id);
      setOrderNotice("Order saved locally because the pharmacy server could not be reached.");
      setView("placed");
    } finally {
      setPlacing(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    if (!isStaff) return;

    try {
      const data = await pharmacyApi(`/pharmacy/orders/${encodeURIComponent(id)}/status`, {
        token: staffToken,
        method: "PATCH",
        body: { status },
      });
      const updated = extractOrder(data);
      const next = loadPharmacyOrders().map((order) =>
        order.id === id
          ? { ...order, ...(updated && typeof updated === "object" ? updated : {}), status, updatedAt: new Date().toISOString() }
          : order
      );
      persistOrders(next);
      setOrderNotice(`Order ${id} is now ${status}.`);
    } catch (err) {
      console.warn("Could not update pharmacy order through API:", err);
      const next = loadPharmacyOrders().map((order) =>
        order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
      );
      persistOrders(next);
      setOrderNotice(`Order ${id} is now ${status} (saved locally).`);
    }
  };

  const resetOrder = () => {
    setCart({});
    setOrderForm({ name: "", phone: "", address: "", addressLabel: "home" });
    setRxFile(null);
    setPaymentMethod(null);
    setAddressCoords(null);
    setLocationError("");
    setOrderId("");
    setOrderNotice("");
    setView("browse");
  };

  const statusLabel = {
    pending: "Waiting for staff confirmation",
    confirmed: "Confirmed by pharmacy staff",
    ready: "Ready for pickup / dispatch",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  if (isStaff && view === "staffOrders") {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
      <div className="mk-screen max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionLabel>Pharmacy staff</SectionLabel>
            <h2 className="text-2xl mt-2" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Order desk</h2>
            <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
              Confirm availability and prescription status before accepting payment or handing over medicines.
            </p>
          </div>
          <GhostButton icon={ChevronLeft} onClick={() => setView("browse")}>Catalog</GhostButton>
        </div>

        <div className="mt-6 space-y-3">
          {sortedOrders.length === 0 && (
            <div className="rounded-2xl p-8 text-center" style={glassStyle()}>
              <ShoppingBag size={28} color={C.inkSoft} className="mx-auto" />
              <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>No orders yet</div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>New patient orders will appear here.</div>
            </div>
          )}

          {sortedOrders.map((order) => (
            <TiltCard key={order.id} className="p-5" maxTilt={2} radius={18}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" style={{ color: C.ink }}>{order.id}</div>
                  <div className="text-xs mt-1" style={{ color: C.inkSoft }}>
                    {order.customer.name} · {order.customer.phone}
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: C.primaryPale, color: C.primaryDeep }}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex justify-between text-xs">
                    <span style={{ color: C.ink }}>{item.name} × {item.qty}</span>
                    <span className="font-semibold" style={{ color: C.ink }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl text-xs space-y-1.5" style={{ background: C.bg1 }}>
                <div><b>Deliver / collect:</b> {order.customer.address}</div>
                <div><b>Payment:</b> {PAYMENT_METHODS.find((p) => p.id === order.paymentMethod)?.label || order.paymentMethod}</div>
                <div><b>Total:</b> ₹{order.total}</div>
                {order.prescriptionName && <div><b>Prescription:</b> {order.prescriptionName} — verify before dispensing.</div>}
              </div>

              {order.customer.coordinates && (
                <a
                  className="inline-flex items-center gap-2 mt-3 text-xs font-semibold"
                  style={{ color: C.primaryDeep }}
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${order.customer.coordinates.lat},${order.customer.coordinates.lng}`}
                >
                  <Navigation size={13} /> Open delivery location
                </a>
              )}

              {order.status !== "completed" && order.status !== "cancelled" && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: `1px dashed ${C.line}` }}>
                  {order.status === "pending" && (
                    <>
                      <PrimaryButton onClick={() => updateOrderStatus(order.id, "confirmed")} icon={Check}>
                        Confirm order
                      </PrimaryButton>
                      <GhostButton onClick={() => updateOrderStatus(order.id, "cancelled")} icon={X}>
                        Cancel
                      </GhostButton>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <PrimaryButton onClick={() => updateOrderStatus(order.id, "ready")} icon={Package}>
                      Mark ready
                    </PrimaryButton>
                  )}
                  {order.status === "ready" && (
                    <PrimaryButton onClick={() => updateOrderStatus(order.id, "completed")} icon={CheckCircle2}>
                      Complete order
                    </PrimaryButton>
                  )}
                </div>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    );
  }

  if (view === "placed") {
    const placedOrder = loadPharmacyOrders().find((o) => o.id === orderId);
    const currentStatus = placedOrder?.status || "pending";
    return (
      <div className="mk-screen max-w-md mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: C.successPale }}>
          <CheckCircle2 size={28} color={C.success} />
        </div>
        <h2 className="text-2xl mt-5" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Order request sent</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
          Order <b>{orderId}</b> has been sent to the pharmacy staff. Wait for staff confirmation before paying or collecting the medicine.
        </p>

        <div className="mt-6 p-4 rounded-2xl text-left text-sm space-y-2" style={glassStyle({ background: "#FFFFFF" })}>
          <div className="flex justify-between gap-4"><span style={{ color: C.inkSoft }}>Status</span><span className="font-semibold text-right" style={{ color: C.primaryDeep }}>{statusLabel[currentStatus]}</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C.inkSoft }}>Deliver to</span><span className="font-semibold text-right" style={{ color: C.ink }}>{orderForm.address}</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C.inkSoft }}>Payment</span><span className="font-semibold" style={{ color: C.ink }}>{PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: C.inkSoft }}>Total</span><span className="font-semibold" style={{ color: C.ink }}>₹{cartTotal}</span></div>
        </div>

        <div className="mt-5 p-4 rounded-2xl text-left" style={{ background: C.primaryPale }}>
          <div className="text-sm font-semibold" style={{ color: C.ink }}>What to do next</div>
          <ol className="mt-2 text-xs space-y-1.5 list-decimal list-inside" style={{ color: C.ink }}>
            <li>Show <b>{orderId}</b> to the pharmacy staff.</li>
            <li>Staff verifies medicine availability and any prescription requirement.</li>
            <li>Staff confirms the order and tells you the final payable amount.</li>
            <li>Pay using the selected method only after staff confirmation.</li>
            <li>Collect the medicine and receipt, or wait for dispatch if delivery was selected.</li>
          </ol>
        </div>

        <div className="mt-8">
          <PrimaryButton full onClick={resetOrder}>Continue shopping</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-screen max-w-3xl mx-auto px-6 py-10 pb-28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <ShoppingBag size={26} color={C.primary} />
          <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Pharmacy</h2>
          <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
            Add medicines to your cart, enter delivery details, choose a payment method, then show the order ID to pharmacy staff for confirmation.
          </p>
        </div>
        {isStaff ? (
          <div className="flex flex-col gap-2 shrink-0">
            <GhostButton icon={ClipboardList} onClick={() => { setOrders(loadPharmacyOrders()); setView("staffOrders"); }}>Orders</GhostButton>
            <GhostButton icon={Plus} onClick={() => { setNewMedicine(EMPTY_MEDICINE_FORM); setView("addMedicine"); }}>Add medicine</GhostButton>
          </div>
        ) : (
          <GhostButton icon={ShieldCheck} onClick={() => onRequestStaffAccess?.()}>Staff inventory</GhostButton>
        )}
      </div>

      {orderNotice && (
        <div className="mt-4 px-4 py-3 rounded-xl text-xs font-semibold" style={{ background: C.successPale, color: C.success }}>
          <CheckCircle2 size={14} className="inline mr-1" /> {orderNotice}
        </div>
      )}

      {(catalogLoading || catalogError) && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-xs"
          style={{
            background: catalogLoading ? C.primaryPale : C.warningPale,
            color: C.ink,
          }}
        >
          {catalogLoading ? "Loading live pharmacy inventory…" : catalogError}
        </div>
      )}

      <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-xl" style={glassStyle()}>
        <Search size={16} color={C.inkSoft} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by medicine name, category or pack size…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: C.ink }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {MEDICINE_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {filtered.map((m) => {
          const qty = cart[m.id] || 0;
          return (
            <TiltCard key={m.id} className="p-4" maxTilt={2.5} radius={18}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold" style={{ color: C.ink }}>{m.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{m.packSize}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: C.primaryDeep }}>₹{m.price}</span>
                    {m.rx && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.warningPale, color: C.warning }}>Rx required</span>}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
                  <Pill size={16} color={C.primaryDeep} />
                </div>
              </div>

              <div className="mt-3">
                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(m.id);
                    }}
                    style={{
                      position: "relative",
                      zIndex: 20,
                      pointerEvents: "auto",
                      touchAction: "manipulation",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 20px",
                      borderRadius: 9999,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
                      color: "#0B2A20",
                      boxShadow: "0 12px 28px -10px rgba(63,174,134,0.5)",
                    }}
                  >
                    <ShoppingCart size={17} />
                    Add to cart
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-full px-1 py-1 w-fit" style={{ background: C.primaryPale }}>
                    <button type="button" onClick={() => setQty(m.id, qty - 1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFFFFF" }}>
                      <Minus size={13} color={C.primaryDeep} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center" style={{ color: C.primaryDeep }}>{qty}</span>
                    <button type="button" onClick={() => setQty(m.id, qty + 1)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFFFFF" }}>
                      <Plus size={13} color={C.primaryDeep} />
                    </button>
                  </div>
                )}
              </div>
            </TiltCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 text-sm text-center py-10" style={{ color: C.inkSoft }}>No medicines match your search.</div>
        )}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <button
            type="button"
            onClick={() => setView("cart")}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full max-w-md w-full sm:w-auto"
            style={{ ...glassStyle({ background: C.ink }), color: "#fff" }}
          >
            <ShoppingCart size={18} />
            <span className="text-sm font-semibold flex-1 text-left">{cartCount} item{cartCount > 1 ? "s" : ""} · ₹{cartTotal}</span>
            <span className="text-sm font-semibold" style={{ color: C.primaryLight }}>View cart →</span>
          </button>
        </div>
      )}

      {(view === "cart" || view === "checkout" || view === "payment" || view === "review") && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-0 sm:px-4" style={{ background: "rgba(32,36,31,0.45)" }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[88vh] overflow-y-auto" style={glassStyle({ background: "#FFFFFF" })}>
            {view === "cart" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold" style={{ color: C.ink }}>Your cart</div>
                  <button type="button" onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                {cartItems.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{i.name}</div>
                      <div className="text-xs" style={{ color: C.inkSoft }}>₹{i.price} × {i.qty}</div>
                    </div>
                    <button type="button" onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${C.line}` }}><Minus size={12} color={C.ink} /></button>
                    <span className="text-sm font-semibold w-4 text-center" style={{ color: C.ink }}>{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${C.line}` }}><Plus size={12} color={C.ink} /></button>
                    <button type="button" onClick={() => setQty(i.id, 0)}><Trash2 size={15} color={C.alert} /></button>
                  </div>
                ))}
                <div className="flex justify-between pt-4 mt-2" style={{ borderTop: `1px dashed ${C.line}` }}>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>Total</span>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>₹{cartTotal}</span>
                </div>
                <PrimaryButton full icon={ChevronRight} onClick={() => setView("checkout")} disabled={cartItems.length === 0}>Enter delivery details</PrimaryButton>
              </>
            )}

            {view === "checkout" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setView("cart")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.inkSoft }}><ChevronLeft size={14} /> Back to cart</button>
                  <button type="button" onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                <div className="text-sm font-semibold mb-4" style={{ color: C.ink }}>Delivery details</div>
                <div className="space-y-3">
                  <input
                    value={orderForm.name}
                    onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value.slice(0, 100) }))}
                    placeholder="Full name"
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${C.line}` }}
                  />
                  <input
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+ -]/g, "").slice(0, 15) }))}
                    placeholder="Phone number"
                    inputMode="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: `1.5px solid ${phoneValid || !orderForm.phone ? C.line : C.alert}` }}
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    {ADDRESS_LABELS.map((l) => {
                      const LIcon = l.icon;
                      const active = orderForm.addressLabel === l.id;
                      return (
                        <button
                          type="button"
                          key={l.id}
                          onClick={() => setOrderForm((f) => ({ ...f, addressLabel: l.id }))}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ background: active ? C.primaryPale : "transparent", border: `1.5px solid ${active ? C.glassBorder : C.line}`, color: active ? C.primaryDeep : C.inkSoft }}
                        >
                          <LIcon size={12} /> {l.label}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={orderForm.address}
                    onChange={(e) => setOrderForm((f) => ({ ...f, address: e.target.value.slice(0, 500) }))}
                    placeholder="House / flat, street, area, city, PIN code"
                    rows={3}
                    autoComplete="street-address"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ border: `1.5px solid ${C.line}` }}
                  />

                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ border: `1.5px solid ${C.glassBorder}`, color: C.primaryDeep, background: C.primaryPale, opacity: locating ? 0.7 : 1 }}
                  >
                    {locating ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
                    {locating ? "Finding your location…" : "Use my current location"}
                  </button>

                  {locationError && <div className="text-xs" style={{ color: C.alert }}>{locationError}</div>}
                  {addressCoords && !locationError && (
                    <div className="text-xs" style={{ color: C.inkSoft }}>
                      Location pinned. Please verify the address before submitting.
                    </div>
                  )}
                </div>

                {needsRx && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold mb-2" style={{ color: C.ink }}>Prescription required — upload it for staff verification</div>
                    <input ref={rxInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setRxFile(e.target.files?.[0] || null)} />
                    <button type="button" onClick={() => rxInputRef.current?.click()} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ border: `1.5px dashed ${C.line}`, color: rxFile ? C.ink : C.inkSoft }}>
                      <Upload size={15} />
                      {rxFile ? rxFile.name : "Upload prescription photo or PDF"}
                    </button>
                  </div>
                )}

                <div className="mt-5">
                  <PrimaryButton full icon={ChevronRight} onClick={() => setView("payment")} disabled={!canContinueToPayment}>
                    Continue to payment
                  </PrimaryButton>
                </div>
              </>
            )}

            {view === "payment" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setView("checkout")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.inkSoft }}><ChevronLeft size={14} /> Back to delivery details</button>
                  <button type="button" onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: C.ink }}>Choose how you will pay</div>
                <div className="text-xs mb-4" style={{ color: C.inkSoft }}>No card/UPI credentials are collected here. Payment is completed with pharmacy staff.</div>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((p) => {
                    const PIcon = p.icon;
                    const active = paymentMethod === p.id;
                    return (
                      <button type="button" key={p.id} onClick={() => setPaymentMethod(p.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left" style={{ border: `1.5px solid ${active ? C.glassBorder : C.line}`, background: active ? C.primaryPale : "#FFFFFF" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: active ? "#FFFFFF" : C.bg1 }}><PIcon size={16} color={C.primaryDeep} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold" style={{ color: C.ink }}>{p.label}</div>
                          <div className="text-xs" style={{ color: C.inkSoft }}>{p.sub}</div>
                        </div>
                        {active && <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: C.primary }}><Check size={12} strokeWidth={3} color="#0B2A20" /></div>}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <PrimaryButton full icon={ChevronRight} onClick={() => setView("review")} disabled={!paymentMethod}>Review order</PrimaryButton>
                </div>
              </>
            )}

            {view === "review" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setView("payment")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.inkSoft }}><ChevronLeft size={14} /> Back to payment</button>
                  <button type="button" onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
                </div>
                <div className="text-sm font-semibold mb-4" style={{ color: C.ink }}>Final confirmation</div>

                <div className="space-y-2 mb-4">
                  {cartItems.map((i) => (
                    <div key={i.id} className="flex items-center justify-between text-sm">
                      <span style={{ color: C.ink }}>{i.name} × {i.qty}</span>
                      <span className="font-semibold" style={{ color: C.ink }}>₹{i.price * i.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl space-y-2 text-sm" style={{ background: C.bg1 }}>
                  <div className="flex items-start gap-2"><MapPin size={14} color={C.inkSoft} className="mt-0.5 shrink-0" /><div><div className="font-semibold" style={{ color: C.ink }}>{orderForm.name} · {orderForm.phone}</div><div style={{ color: C.inkSoft }}>{orderForm.address}</div></div></div>
                  <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px dashed ${C.line}` }}>
                    {(() => { const P = PAYMENT_METHODS.find((p) => p.id === paymentMethod); const PIcon = P?.icon || CreditCard; return (<><PIcon size={14} color={C.inkSoft} /><span style={{ color: C.ink }}>{P?.label}</span></>); })()}
                  </div>
                </div>

                {rxFile && <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: C.inkSoft }}><FileText size={13} /> Prescription attached: {rxFile.name}</div>}

                <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: C.warningPale, color: C.ink }}>
                  <b>Before you pay:</b> pharmacy staff must confirm medicine availability and verify any prescription. The displayed amount is a demo estimate and the final payable amount is confirmed by staff.
                </div>

                <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: `1px dashed ${C.line}` }}>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>Estimated total</span>
                  <span className="text-sm font-semibold" style={{ color: C.ink }}>₹{cartTotal}</span>
                </div>

                <div className="mt-4">
                  <PrimaryButton full icon={CheckCircle2} onClick={placeOrder} disabled={!canPlaceOrder || placing}>
                    {placing ? "Sending to pharmacy…" : "Confirm & send to pharmacy"}
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isStaff && view === "addMedicine" && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-0 sm:px-4" style={{ background: "rgba(32,36,31,0.45)" }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[88vh] overflow-y-auto" style={glassStyle({ background: "#FFFFFF" })}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: C.ink }}>Add medicine</div>
                <div className="text-xs mt-1" style={{ color: C.inkSoft }}>This adds the item to the current pharmacy catalog.</div>
              </div>
              <button type="button" onClick={() => setView("browse")}><X size={18} color={C.inkSoft} /></button>
            </div>

            <div className="space-y-3">
              <input value={newMedicine.name} onChange={(e) => setNewMedicine((f) => ({ ...f, name: e.target.value }))} placeholder="Medicine name" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
              <select value={newMedicine.category} onChange={(e) => setNewMedicine((f) => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-white" style={{ border: `1.5px solid ${C.line}`, color: C.ink }}>
                {MEDICINE_CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={newMedicine.packSize} onChange={(e) => setNewMedicine((f) => ({ ...f, packSize: e.target.value }))} placeholder="Pack size (e.g. Strip of 10 tablets)" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
              <input value={newMedicine.price} onChange={(e) => setNewMedicine((f) => ({ ...f, price: e.target.value.replace(/[^\d]/g, "").slice(0, 7) }))} placeholder="Price (₹)" inputMode="numeric" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${C.line}` }} />
              <label className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                <input type="checkbox" checked={newMedicine.rx} onChange={(e) => setNewMedicine((f) => ({ ...f, rx: e.target.checked }))} />
                Requires prescription (Rx)
              </label>
            </div>

            <div className="mt-5">
              <PrimaryButton full icon={Plus} onClick={submitNewMedicine} disabled={!canAddMedicine}>Add to catalog</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: AI VOICE ASSISTANT
   A large, single-tap mic — patients speak in their own language,
   the assistant replies in kind. It never diagnoses or prescribes;
   it may suggest a department to route to, always flagged as an
   AI suggestion pending physician review. Every patient turn also
   feeds the same clinical-history record the doctor sees.

   Reliability notes: speech-to-text is never perfect, especially for
   Indian-language accents, so a recognized phrase is shown back to the
   patient as an EDITABLE draft before anything is sent — this catches
   mishearings before they reach the AI rather than after. Typing is
   always available as a fallback, and the backend prompt itself is
   told to detect the actual language used (not just trust a UI hint)
   and to ask for a repeat if a transcript looks like noise.

   Backend-down fallback: if /claude/chat can't be reached, the chat
   still has to respond — a dead "Send" button here is worse than a
   simple scripted reply, since this may be the patient's only way to
   flag a red-flag symptom before triage. localAssistantReply() below
   mirrors fallbackSummary()'s job for the summary step: same red-flag
   keyword list, same specialty keyword list, kept deliberately simple
   and never presented as anything other than a basic acknowledgement —
   it does not diagnose, and the on-screen disclaimer above it never
   changes based on which path answered.
----------------------------------------------------------------*/
const FALLBACK_ASSISTANT_LINES = {
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

function localAssistantReply(trimmedText, language, turnCount) {
  const raw = trimmedText.trim();
  const lower = raw.toLowerCase();

  const flagged = [...(RED_FLAG_KEYWORDS[language] || []), ...RED_FLAG_KEYWORDS.en]
    .some((k) => lower.includes(k.toLowerCase()));

  if (flagged) {
    const lines = FALLBACK_ASSISTANT_LINES[language] || FALLBACK_ASSISTANT_LINES.en;
    return {
      reply: `${lines.ack[turnCount % lines.ack.length]} ${lines.urgent}`,
      redFlag: true,
      suggestedSpecialty: null,
    };
  }

  // Offline intent recognition: do NOT invent a medical answer when the
  // question is unclear. First identify what the patient is asking.
  const intents = [
    {
      id: "greeting",
      patterns: ["hello", "hi", "hey", "good morning", "good evening"],
      reply: "Hi! I can help you explain your symptoms and prepare information for the doctor. What would you like to tell me?",
    },
    {
      id: "appointment",
      patterns: ["appointment", "book doctor", "see a doctor", "doctor appointment"],
      reply: "You are asking about an appointment. I can help collect the reason for your visit, but the appointment itself should be confirmed through the hospital's booking process. What kind of care do you need?",
    },
    {
      id: "medicine",
      patterns: ["medicine", "medication", "tablet", "capsule", "drug", "pharmacy"],
      reply: "You are asking about a medicine. I can help record the medicine name or your question for the doctor/pharmacy, but I won't prescribe or change a medicine. What is the medicine or concern?",
    },
    {
      id: "fever",
      patterns: ["fever", "temperature", "hot body"],
      reply: "I understand that you are asking about fever. Please tell me when it started and what other symptoms you have, such as cough, sore throat, vomiting, or pain.",
      specialty: "General Medicine",
    },
    {
      id: "cough",
      patterns: ["cough", "cold", "sore throat", "runny nose"],
      reply: "I understand that you are asking about cough or cold symptoms. Please tell me how long you have had them and whether you also have fever, breathing difficulty, or chest pain.",
      specialty: "General Medicine",
    },
    {
      id: "pain",
      patterns: ["pain", "ache", "hurts", "headache", "stomach pain", "back pain", "joint pain"],
      reply: "I understand that you are describing pain. Please tell me where the pain is, when it started, and whether anything makes it better or worse.",
      specialty: "General Medicine",
    },
    {
      id: "skin",
      patterns: ["rash", "itching", "skin", "acne"],
      reply: "I understand that your question is about a skin concern. Please describe where it is, when it started, and whether it is changing or spreading.",
      specialty: "Dermatology",
    },
  ];

  const hit = intents.find((intent) =>
    intent.patterns.some((p) => lower.includes(p))
  );

  if (hit) {
    return {
      reply: hit.reply,
      redFlag: false,
      suggestedSpecialty: hit.specialty || null,
    };
  }

  // Unknown = clarify instead of pretending we understood.
  return {
    reply: `I heard: “${raw}”. I don't want to guess what you mean. Could you rephrase the question in a short sentence, or tell me what symptom/problem you want help describing to the doctor?`,
    redFlag: false,
    suggestedSpecialty: null,
  };
}

function AIVoiceChat({ language, patientToken, onRecordEntry, onSuggestedSpecialty }) {
  const t = STRINGS[language];
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [draft, setDraft] = useState(""); // editable, populated by speech or typing, confirmed before sending
  const [thinking, setThinking] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(false);
  const recognitionRef = useRef(null);
  const endRef = useRef(null);
  const turnCountRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // don't let replies queue up and overlap
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = SPEECH_LANG_CODES[language] || "en-IN";
    window.speechSynthesis.speak(utter);
  };

  const sendToAssistant = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { text: trimmed, mine: true, at: Date.now() }]);
    setDraft("");
    setInterimText("");
    setThinking(true);
    setError("");
    const history = messages.slice(-12).map((m) => ({ role: m.mine ? "user" : "assistant", text: m.text }));
    onRecordEntry?.({ section: "AI Voice Consult", q: "Patient", answer: trimmed });
    try {
      const res = await fetch(`${API_BASE_URL}/claude/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(patientToken ? { Authorization: `Bearer ${patientToken}` } : {}),
        },
        body: JSON.stringify({ message: trimmed, history, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The assistant is unavailable right now.");

      setMessages((prev) => [...prev, { text: data.reply, mine: false, at: Date.now() }]);
      speak(data.reply);
      setOffline(false);
      if (data.redFlag) setRedFlag(true);
      if (data.suggestedSpecialty) onSuggestedSpecialty?.(data.suggestedSpecialty);
    } catch (err) {
      // Logged so a CORS block, DNS failure, or backend-down error shows
      // up in the browser console instead of just a generic message.
      console.error("AI assistant request failed:", err);
      // No backend reachable — fall back to a scripted local reply rather
      // than leaving the patient stuck talking to nothing. See
      // localAssistantReply() above for what this can and can't do.
      setOffline(true);
      const { reply, redFlag: flaggedNow, suggestedSpecialty } = localAssistantReply(trimmed, language, turnCountRef.current);
      turnCountRef.current += 1;
      setMessages((prev) => [...prev, { text: reply, mine: false, at: Date.now() }]);
      speak(reply);
      if (flaggedNow) setRedFlag(true);
      if (suggestedSpecialty) onSuggestedSpecialty?.(suggestedSpecialty);
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.micUnsupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_CODES[language] || "en-IN";
    // Interim results let the patient see what's being heard in real time —
    // if it's drifting wrong, they can stop and just type instead.
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setListening(true); setError(""); };
    recognition.onresult = (e) => {
      let finalText = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (finalText) {
        // Land it in the editable draft rather than auto-sending — the
        // patient confirms (or fixes) it before it goes to the AI.
        setDraft((prev) => (prev ? `${prev} ${finalText}`.trim() : finalText.trim()));
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };
    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError(t.micDenied);
      else if (e.error === "no-speech") setError(t.micNoSpeech);
      else setError(t.micGenericError);
    };
    recognition.onend = () => { setListening(false); setInterimText(""); };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError(t.micGenericError);
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="mk-screen max-w-lg mx-auto px-6 py-10 flex flex-col items-center">
      <ShieldCheck size={26} color={C.primary} />
      <h2 className="text-2xl mt-4 text-center" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>Talk to the AI assistant</h2>
      <p className="text-sm mt-2 text-center" style={{ color: C.inkSoft }}>
        Speak in your own language. This helps build your history for the doctor — it can't diagnose or prescribe anything.
      </p>
      {offline && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: C.warning }}>
          <AlertTriangle size={12} /> Running in offline mode — replies are basic until the connection is back.
        </div>
      )}

      {redFlag && (
        <div className="flex items-start gap-2 mt-5 px-4 py-3 rounded-xl text-sm font-semibold w-full" style={{ background: C.alertPale, color: C.alert }}>
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          This may need urgent attention. Please alert kiosk staff or go to the emergency desk now.
        </div>
      )}

      <div className="w-full mt-6 rounded-3xl flex flex-col" style={{ ...glassStyle(), height: 340 }}>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-xs text-center mt-16" style={{ color: C.inkSoft }}>Tap the mic below and start speaking.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] px-3.5 py-2 rounded-2xl text-sm"
                style={{
                  background: m.mine ? `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})` : "rgba(255,255,255,0.08)",
                  color: m.mine ? "#06201C" : C.ink,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && <div className="text-xs" style={{ color: C.inkSoft }}>Thinking…</div>}
          <div ref={endRef} />
        </div>
      </div>

      {error && (
        <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-4 w-full text-center" style={{ background: C.alertPale, color: C.alert }}>{error}</div>
      )}

      {/* Single persistent input row — speech and typing both land here.
          (Previously this was two different <input> elements that swapped
          based on whether draft had text, which unmounted the box you were
          typing into after the very first keystroke and kicked your cursor
          out. One stable input fixes that.) */}
      <div className="w-full mt-4 rounded-2xl p-2 pl-4 flex items-center gap-2" style={glassStyle()}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendToAssistant(draft);
            }
          }}
          placeholder={interimText || "Type your message…"}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: C.ink }}
        />
        <button
          type="button"
          onClick={() => sendToAssistant(draft)}
          disabled={!draft.trim() || thinking}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
            opacity: draft.trim() && !thinking ? 1 : 0.45,
            cursor: draft.trim() && !thinking ? "pointer" : "not-allowed",
          }}
        >
          <Send size={15} color="#06201C" />
        </button>
      </div>

      {/* the huge mic button */}
      <button
        onClick={listening ? stopListening : startListening}
        className="mt-8 rounded-full flex items-center justify-center relative"
        style={{
          width: 132,
          height: 132,
          background: listening ? C.alert : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
          boxShadow: `0 20px 50px -14px ${listening ? "rgba(232,131,106,0.7)" : "rgba(63,224,197,0.6)"}`,
        }}
      >
        {listening && <PulseRing color={C.alert} />}
        {listening ? <MicOff size={48} color="#fff" /> : <Mic size={48} color="#06201C" />}
      </button>
      <div className="text-xs mt-3" style={{ color: C.inkSoft }}>{listening ? "Listening… tap to stop" : "Tap to speak"}</div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREEN: INTERVIEW
----------------------------------------------------------------*/
function Interview({ mode, language, onComplete }) {
  const t = STRINGS[language];
  const steps = mode === "ayush" ? [...BASE_STEPS, AYUSH_STEP] : BASE_STEPS;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [typed, setTyped] = useState(""); // free-text / speech-to-text draft — chips submit immediately on tap, so this is only for typed/spoken answers
  const [listening, setListening] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [micError, setMicError] = useState("");
  const [micSupported, setMicSupported] = useState(true);

  const recognitionRef = useRef(null);
  // Guards against a fast double-tap on a chip (or Next) submitting two
  // answers for one question before the screen has advanced — chips now
  // submit immediately on tap, so this matters more than it used to.
  const advancingRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicSupported(!!SR);

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition may already be stopped
      }
    };
  }, []);

  // Reset the per-question draft whenever we move to a new question, so
  // text typed on question 1 never bleeds into question 2.
  useEffect(() => {
    setTyped("");
    setMicError("");
    advancingRef.current = false;
  }, [idx]);

  const current = steps[idx];

  const checkRedFlag = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    const keywords = [...(RED_FLAG_KEYWORDS[language] || []), ...RED_FLAG_KEYWORDS.en];
    return keywords.some((k) => lower.includes(k.toLowerCase()));
  };

  const chooseOption = (option) => {
    // Tapping a chip is a complete answer on its own — submit right away
    // instead of making the patient tap the chip and then tap Next.
    setMicError("");
    submitAnswer(option);
  };

  const handleTypedChange = (value) => {
    setTyped(value);
  };

  const submitAnswer = (overrideText) => {
    try {
    if (advancingRef.current) return; // already mid-transition to the next question
    const answerText = (typeof overrideText === "string" ? overrideText : typed).trim();
    if (!answerText) return;
    advancingRef.current = true;

    const flaggedNow = checkRedFlag(answerText);
    const nextAnswers = [
      ...answers,
      { section: current.section, q: current.q.en, answer: answerText },
    ];
    const finalRedFlag = redFlag || flaggedNow;

    setAnswers(nextAnswers);
    setRedFlag(finalRedFlag);
    setListening(false);
    recognitionRef.current?.stop?.();

    if (idx + 1 < steps.length) {
      setIdx(idx + 1);
    } else {
      onComplete(nextAnswers, finalRedFlag);
    }
    } catch (err) {
      console.error("[MediKiosk] Could not submit interview answer:", err);
    }
  };

  const startMic = () => {
    setMicError("");

    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors
      }
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError(t.micUnsupported);
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    // Speaks and listens in whichever language the patient picked on the
    // language screen — this is the multi-lingual part of voice input.
    recognition.lang = SPEECH_LANG_CODES[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setMicError("");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript) {
        setTyped(transcript);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicError(t.micDenied);
      } else if (event.error === "no-speech") {
        setMicError(t.micNoSpeech);
      } else {
        setMicError(t.micGenericError);
      }
    };
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      setMicError(t.micGenericError);
    }
  };

  const canSubmit = !!typed.trim();

  return (
    <KioskFrame step={idx + 1} totalSteps={steps.length} sectionLabel={current.sectionLabel[language]}>
      {redFlag && (
        <div className="flex items-start gap-2 mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: C.alertPale, border: `1.5px solid ${C.alert}`, color: C.alert }}>
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t.priorityTitle}</span> {t.priorityBody}
          </div>
        </div>
      )}

      <TiltCard className="p-6" maxTilt={4} radius={20}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`, transform: "translateZ(18px)" }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div className="pt-1.5">
            <div className="text-xs font-semibold mb-1" style={{ color: C.primary }}>{current.sectionLabel[language] || current.section}</div>
            <p className="text-lg" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{current.q[language] || current.q.en}</p>
          </div>
        </div>

        {/* Answer options — tap a chip, or type/speak below instead */}
        <div
          className="grid sm:grid-cols-2 gap-2.5 mt-6"
          style={{ position: "relative", zIndex: 25, pointerEvents: "auto" }}
        >
          {current.chips[language].map((option) => (
            <Chip key={option} onClick={() => chooseOption(option)}>
              {option}
            </Chip>
          ))}
        </div>

        {!micSupported && (
          <div className="mt-5 text-xs px-3 py-2 rounded-lg" style={{ background: C.accentPale, color: C.ink }}>
            {t.micUnsupported}
          </div>
        )}
        {micError && (
          <div className="mt-5 flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: C.alertPale, color: C.alert }}>
            <AlertTriangle size={14} className="shrink-0" /> {micError}
          </div>
        )}

        <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: `1px dashed ${C.line}` }}>
          <button
            type="button"
            onClick={startMic}
            className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: listening ? C.alert : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryDeep})`,
              boxShadow: `0 8px 18px -6px ${listening ? "rgba(232,131,106,0.6)" : "rgba(63,224,197,0.5)"}`,
            }}
          >
            {listening && <PulseRing color={C.alert} />}
            {listening ? <MicOff size={18} color="#fff" style={{ position: "relative" }} /> : <Mic size={18} color="#06201C" style={{ position: "relative" }} />}
          </button>
          <input
            type="text"
            value={typed}
            onChange={(e) => handleTypedChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitAnswer();
              }
            }}
            placeholder={listening ? t.micListening : t.micIdle}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: `1.5px solid ${C.line}`, background: "rgba(255,255,255,0.08)", color: C.ink }}
          />
          <PrimaryButton type="button" onClick={submitAnswer} disabled={!canSubmit} icon={ChevronRight}>
            {t.nextBtn}
          </PrimaryButton>
        </div>
      </TiltCard>

      {answers.length > 0 && (
        <div className="mt-6 text-xs" style={{ color: C.inkSoft }}>{t.questionsAnswered(answers.length)}</div>
      )}
    </KioskFrame>
  );
}

/* ---------------------------------------------------------------
   SCREEN: DOCUMENT SCANNING
----------------------------------------------------------------*/
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB per file
const MAX_UPLOADS = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadedFileRow({ item, onRemove }) {
  const isImage = item.file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={glassStyle({ boxShadow: "0 10px 26px -18px rgba(0,0,0,0.4)" })}>
      {isImage && item.previewUrl ? (
        <img src={item.previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
          <FileText size={18} color={C.primary} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{item.file.name}</div>
        <div className="text-xs" style={{ color: C.inkSoft }}>{formatBytes(item.file.size)} · will be reviewed by your doctor</div>
      </div>
      <button onClick={() => onRemove(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
        <X size={14} color={C.inkSoft} />
      </button>
    </div>
  );
}

function DocumentScan({ onNext, language }) {
  const t = STRINGS[language];
  const [uploads, setUploads] = useState([]); // [{ id, file, previewUrl }]
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Revoke object URLs when files are removed or the screen unmounts, so
  // we don't leak memory holding onto blob references for every preview.
  useEffect(() => {
    return () => uploads.forEach((u) => u.previewUrl && URL.revokeObjectURL(u.previewUrl));
  }, []);

  const addFiles = (fileList) => {
    setUploadError("");
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const file of incoming) {
      if (uploads.length + accepted.length >= MAX_UPLOADS) {
        setUploadError(`You can upload up to ${MAX_UPLOADS} files.`);
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only images (JPG, PNG, WEBP, HEIC) and PDFs are supported.");
        continue;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setUploadError(`"${file.name}" is over the 15MB limit.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file), // works for the "Open" link either way; only shown as a thumbnail for images
      });
    }
    if (accepted.length) setUploads((prev) => [...prev, ...accepted]);
  };

  const removeUpload = (id) => {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleContinue = () => {
    // Real uploads have no OCR pipeline in this build, so they're passed
    // through as-is for the physician to open directly — we don't fabricate
    // extracted fields for a document nothing has actually read.
    const uploadedDocs = uploads.map((u) => ({
      id: u.id,
      label: u.file.name,
      date: new Date().toLocaleDateString(),
      fields: [],
      abnormal: null,
      pendingReview: true,
      previewUrl: u.previewUrl,
    }));
    onNext(uploadedDocs);
  };

  return (
    <KioskFrame hideProgress>
      <div className="text-center mb-8">
        <ScanLine size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{t.scanTitle}</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>{t.scanSub}</p>
      </div>

      {/* Real upload — the primary path */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className="rounded-2xl p-8 text-center cursor-pointer"
        style={{
          border: `1.5px dashed ${dragOver ? C.primary : C.line}`,
          background: dragOver ? C.primaryPale : "rgba(255,255,255,0.05)",
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = ""; // allow re-selecting the same file later
          }}
        />
        <Upload size={24} color={C.primary} className="mx-auto" />
        <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>{t.uploadPrompt}</div>
        <div className="text-xs mt-1" style={{ color: C.inkSoft }}>{t.uploadHint}</div>
      </div>

      {uploadError && (
        <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-3" style={{ background: C.alertPale, color: C.alert }}>{uploadError}</div>
      )}

      {uploads.length > 0 && (
        <div className="space-y-2 mt-4">
          {uploads.map((u) => (
            <UploadedFileRow key={u.id} item={u} onRemove={removeUpload} />
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <GhostButton onClick={() => onNext([])}>{t.skipStep}</GhostButton>
        <PrimaryButton onClick={handleContinue} icon={ChevronRight} full>{t.continueSummary}</PrimaryButton>
      </div>
    </KioskFrame>
  );
}


/* ---------------------------------------------------------------
   SCREEN: SUMMARY GENERATION
----------------------------------------------------------------*/
function Summary({ answers, docs, mode, redFlag, language, onDone, patientToken }) {
  const t = STRINGS[language];
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [lang, setLang] = useState("en");
  const [submitting, setSubmitting] = useState(false); // guards against double/spam clicks

  useEffect(() => {
    let active = true;
    generateClinicalSummary({ answers, mode, docs, redFlag, patientToken }).then((s) => {
      if (active) {
        setSummary(s);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  // Prevents a spammed/double-tapped confirm button from firing onDone
  // (and whatever downstream submission logic it triggers) more than once.
  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    onDone(summary);
  };

  const sections = summary
    .split(/\n{2,}/)
    .map((block) => {
      const [head, ...rest] = block.split("\n");
      return { head: head?.trim(), body: rest.join(" ").trim() };
    })
    .filter((s) => s.head);

  return (
    <KioskFrame hideProgress>
      <div className="text-center mb-8">
        <ClipboardList size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{loading ? t.buildingSummary : t.summaryReady}</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>{loading ? t.buildingSummarySub : t.summaryReadyBody}</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-12 h-12 rounded-full animate-spin" style={{ border: `3px solid ${C.line}`, borderTopColor: C.primary, borderRightColor: C.accent }} />
        </div>
      ) : (
        <TiltCard className="p-6" maxTilt={3.5} radius={20}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>Physician-ready summary</span>
            <div className="flex gap-1 p-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.28)" }}>
              {["en", "hi"].map((l) => (
                <button key={l} onClick={() => setLang(l)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: lang === l ? "#fff" : "transparent", color: lang === l ? "#06201C" : C.inkSoft }}>
                  {l === "en" ? "English" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>

          {lang === "hi" ? (
            <div className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm" style={{ background: C.accentPale, color: C.ink }}>
              <Volume2 size={16} />
              आपका सारांश ऑडियो में सुनाया जाएगा — डॉक्टर की स्क्रीन पर अंग्रेज़ी में दिखेगा।
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((s) => (
                <div key={s.head}>
                  <div className="text-xs font-semibold" style={{ color: C.accent }}>{s.head.replace(/^\*+|\*+$/g, "")}</div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: C.ink }}>{s.body}</p>
                </div>
              ))}
            </div>
          )}
        </TiltCard>
      )}

      {!loading && (
        <div className="mt-8">
          <PrimaryButton onClick={handleConfirm} icon={CheckCircle2} full disabled={submitting}>
            {submitting ? "Sending…" : t.confirmSend}
          </PrimaryButton>
        </div>
      )}
    </KioskFrame>
  );
}

/* ---------------------------------------------------------------
   SCREEN: SUBMITTED CONFIRMATION
----------------------------------------------------------------*/
function Submitted({ onSeePhysicianView, onOrderMedicine, onFindCare, language }) {
  const t = STRINGS[language];
  return (
    <KioskFrame hideProgress>
      <div className="text-center max-w-md mx-auto py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: C.successPale }}>
          <CheckCircle2 size={30} color={C.success} />
        </div>
        <h2 className="text-2xl mt-5" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{t.sentTitle}</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>{t.sentBody}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          {onOrderMedicine && (
            <GhostButton icon={Pill} onClick={onOrderMedicine}>Order medicines online</GhostButton>
          )}
          {onFindCare && (
            <GhostButton icon={MapPin} onClick={onFindCare}>Find nearby care</GhostButton>
          )}
        </div>

        <button onClick={onSeePhysicianView} className="text-sm font-semibold mt-6" style={{ color: C.primary }}>{t.seePhysician}</button>
      </div>
    </KioskFrame>
  );
}

/* ---------------------------------------------------------------
   SCREEN: PHYSICIAN DASHBOARD
----------------------------------------------------------------*/
function PhysicianView({ answers, docs, summary, mode, redFlag, messaging }) {
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

/* ---------------------------------------------------------------
   APP ROOT
----------------------------------------------------------------*/
export default function App() {
  // Access token lives only in React state (memory) — deliberately never
  // written to localStorage/sessionStorage, which would let any XSS on the
  // page exfiltrate it. It disappears on refresh, which is the right
  // trade-off for a shared hospital kiosk terminal.
  //
  // Two separate tokens, deliberately never merged into one: staffToken
  // gates the Physician View (real accounts, password or approved Google
  // email); patientToken is the low-privilege kiosk session a patient picks
  // up during Consent (manual ID or their own Google account). A patient
  // being "signed in" never implies staff access, and vice versa.
  const [staffToken, setStaffToken] = useState(null);
  const [patientToken, setPatientToken] = useState(null);
  const [screen, setScreen] = useState("landing");
  // Where to send the patient once they finish registering, when they were
  // redirected here from a gated tab (AI assistant / Medication / Doctors)
  // rather than arriving fresh from Landing. Keeps that redirect from
  // feeling like the tap "did nothing" — they land back where they meant
  // to go instead of stranded on the Patient kiosk intake.
  const [pendingScreen, setPendingScreen] = useState(null);
  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState("general");
  const [answers, setAnswers] = useState([]);
  const [docs, setDocs] = useState([]);
  const [summary, setSummary] = useState("");
  const [redFlag, setRedFlag] = useState(false);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState(null);
  // Pharmacy catalog lives here (not as a hardcoded constant) so staff can
  // add medicines at runtime via PharmacyScreen's "Add medicine" flow.
  const [medicineCatalog, setMedicineCatalog] = useState(() => {
    try {
      const saved = window.localStorage.getItem("medikiosk.pharmacy.catalog");
      return saved ? JSON.parse(saved) : MEDICINE_CATALOG_SEED;
    } catch {
      return MEDICINE_CATALOG_SEED;
    }
  });
  const addMedicine = (med) => {
    setMedicineCatalog((prev) => {
      const next = [med, ...prev.filter((item) => item.id !== med.id)];
      try { window.localStorage.setItem("medikiosk.pharmacy.catalog", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // One WebSocket connection per role, established once a token exists.
  // Never mixed: a patient's messaging session can't see or act on staff
  // presence data, and vice versa.
  const patientMessaging = useSecureMessaging({ token: patientToken, role: "patient", enabled: !!patientToken });
  const staffMessaging = useSecureMessaging({ token: staffToken, role: "staff", enabled: !!staffToken });

  const recordAnswer = (entry) => setAnswers((prev) => [...prev, entry]);

  const resetAll = () => {
    setAnswers([]);
    setDocs([]);
    setSummary("");
    setRedFlag(false);
    setMode("general");
    setPatientToken(null);
    setSuggestedSpecialty(null);
    setPendingScreen(null);
  };

  const GATED_LABELS = { medication: "your medication tracker", doctors: "doctor messaging" };

  // Navigation is intentionally direct for the AI assistant: tapping the
  // tab must visibly open it instead of silently redirecting to registration.
  // The assistant has a local fallback when the backend is unavailable.
  const handleNavigate = (id) => {
    if (id === "physician" && !staffToken) {
      setPendingScreen("physician");
      setScreen("staffAuth");
      return;
    }
    if (["medication", "doctors"].includes(id) && !patientToken) {
      setPendingScreen(id);
      setScreen("language");
      return;
    }
    setPendingScreen(null);
    setScreen(id);
  };

  return (
    <div style={{ position: "relative", minHeight: "100%", fontFamily: "Inter, sans-serif", color: C.ink }}>
      <style>{GLOBAL_STYLE}</style>
      <GradientBackdrop />
      <div style={{ position: "relative", zIndex: 100, pointerEvents: "auto" }}>
        <TopNav screen={screen} onNavigate={handleNavigate} resetAll={resetAll} />

        {screen === "landing" && <Landing key="landing" onStart={() => setScreen("language")} onNavigate={handleNavigate} />}

        {screen === "language" && (
          <LanguageSelect
            key="language"
            language={language}
            setLanguage={setLanguage}
            mode={mode}
            setMode={setMode}
            onNext={() => setScreen("consent")}
            notice={pendingScreen ? `Quick patient registration first — this links your session to ${GATED_LABELS[pendingScreen] || "that feature"}.` : null}
          />
        )}

        {screen === "consent" && (
          <Consent
            key="consent"
            language={language}
            onNext={(token) => {
              setPatientToken(token);
              if (pendingScreen) {
                setScreen(pendingScreen);
                setPendingScreen(null);
              } else {
                setScreen("interview");
              }
            }}
          />
        )}

        {screen === "interview" && (
          <Interview
            key="interview"
            mode={mode}
            language={language}
            onComplete={(finalAnswers, flagged) => {
  setAnswers(finalAnswers);
  setDocs([]);
  setRedFlag(flagged);
  setScreen("summary");
}}
          />
        )}

        {screen === "documents" && (
          <DocumentScan
            key="documents"
            language={language}
            onNext={(scannedDocs) => {
              setDocs(scannedDocs);
              setScreen("summary");
            }}
          />
        )}

        {screen === "summary" && (
          <Summary
            key="summary"
            answers={answers}
            docs={docs}
            mode={mode}
            redFlag={redFlag}
            language={language}
            patientToken={patientToken}
            onDone={(finalSummary) => {
              setSummary(finalSummary);
              setScreen("submitted");
            }}
          />
        )}

        {screen === "submitted" && (
          <Submitted
            key="submitted"
            language={language}
            onSeePhysicianView={() => handleNavigate("physician")}
            onOrderMedicine={() => handleNavigate("pharmacy")}
            onFindCare={() => handleNavigate("hospitals")}
          />
        )}

        {screen === "aiChat" && (
          <AIVoiceChat
            key="aiChat"
            language={language}
            patientToken={patientToken}
            onRecordEntry={recordAnswer}
            onSuggestedSpecialty={setSuggestedSpecialty}
          />
        )}

       {screen === "medication" && (
          <MedicationTracker key="medication" patientToken={patientToken} onOrderMedicine={() => handleNavigate("pharmacy")} />
        )}

        {screen === "doctors" && (
          <DoctorsScreen key="doctors" messaging={patientMessaging} suggestedSpecialty={suggestedSpecialty} />
        )}

        {screen === "hospitals" && (
          <NearbyHospitals key="hospitals" language={language} suggestedSpecialty={suggestedSpecialty} />
        )}

        {screen === "pharmacy" && (
          <PharmacyScreen
            key="pharmacy"
            catalog={medicineCatalog}
            isStaff={!!staffToken}
            patientToken={patientToken}
            staffToken={staffToken}
            onCatalogLoaded={setMedicineCatalog}
            onAddMedicine={addMedicine}
            onRequestStaffAccess={() => {
              setPendingScreen("pharmacy");
              setScreen("staffAuth");
            }}
          />
        )}

        {screen === "staffAuth" && (
          <StaffAuthGate
            key="staffAuth"
            onSuccess={(token) => {
              setStaffToken(token);
              const destination = pendingScreen || "physician";
              setPendingScreen(null);
              setScreen(destination);
            }}
          />
        )}

        {screen === "physician" && staffToken && (
          <PhysicianView key="physician" answers={answers} docs={docs} summary={summary} mode={mode} redFlag={redFlag} messaging={staffMessaging} />
        )}

        <div className="text-center text-xs py-8" style={{ color: C.inkSoft }}>
          MediKiosk — AI clinical history platform · demo prototype
        </div>
      </div>
    </div>
  );
}
