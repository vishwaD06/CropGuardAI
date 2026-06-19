import { createContext, useContext } from "react";

export type Lang = "en" | "mr";

export const translations = {
  en: {
    appName: "CropGuard AI",
    tagline: "AI-Powered Crop Disease Detection",
    home: "Home",
    about: "About",
    contact: "Contact",
    uploadTitle: "Upload Leaf Image",
    uploadHint: "Drag & drop or click to select a crop leaf image",
    chooseFile: "Choose File",
    useCamera: "Use Camera",
    analyze: "Analyze Image",
    analyzing: "Analyzing...",
    result: "Detection Result",
    confidence: "Confidence",
    severity: "Severity",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    healthy: "Healthy",
    advisory: "Advisory & Recommendations",
    pesticides: "Suggested Treatment",
    prevention: "Preventive Measures",
    tips: "Farming Tips",
    history: "Recent Scans",
    noHistory: "No scans yet. Upload an image to get started.",
    aboutTitle: "About CropGuard AI",
    aboutDesc: "CropGuard AI helps farmers identify crop diseases instantly using artificial intelligence. Upload a leaf photo and receive accurate diagnosis with actionable treatment advice — empowering farmers to protect their harvest and increase yields.",
    contactTitle: "Get in Touch",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    sent: "Message sent successfully!",
    heroBadge: "For Farmers, By AI",
    heroTitle: "Detect Crop Diseases in Seconds",
    heroDesc: "Snap a photo of your crop leaf and get instant AI diagnosis with treatment recommendations.",
    startScan: "Start Scanning",
  },
  mr: {
    appName: "क्रॉपगार्ड एआय",
    tagline: "एआय-आधारित पीक रोग शोध",
    home: "मुख्यपृष्ठ",
    about: "आमच्याबद्दल",
    contact: "संपर्क",
    uploadTitle: "पानाचा फोटो अपलोड करा",
    uploadHint: "पीक पानाचा फोटो निवडण्यासाठी ड्रॅग करा किंवा क्लिक करा",
    chooseFile: "फाइल निवडा",
    useCamera: "कॅमेरा वापरा",
    analyze: "विश्लेषण करा",
    analyzing: "विश्लेषण सुरू...",
    result: "निदान परिणाम",
    confidence: "विश्वास पातळी",
    severity: "तीव्रता",
    mild: "सौम्य",
    moderate: "मध्यम",
    severe: "गंभीर",
    healthy: "निरोगी",
    advisory: "सल्ला आणि शिफारसी",
    pesticides: "सुचविलेले उपचार",
    prevention: "प्रतिबंधात्मक उपाय",
    tips: "शेती टिप्स",
    history: "अलीकडील स्कॅन",
    noHistory: "अद्याप कोणतेही स्कॅन नाहीत. सुरू करण्यासाठी फोटो अपलोड करा.",
    aboutTitle: "क्रॉपगार्ड एआय बद्दल",
    aboutDesc: "क्रॉपगार्ड एआय शेतकऱ्यांना कृत्रिम बुद्धिमत्तेचा वापर करून पिकांचे रोग त्वरित ओळखण्यास मदत करते. पानाचा फोटो अपलोड करा आणि अचूक निदान आणि उपचार सल्ला मिळवा.",
    contactTitle: "संपर्क साधा",
    name: "नाव",
    email: "ईमेल",
    message: "संदेश",
    send: "संदेश पाठवा",
    sent: "संदेश यशस्वीरित्या पाठवला!",
    heroBadge: "शेतकऱ्यांसाठी, एआयद्वारे",
    heroTitle: "काही सेकंदात पीक रोग शोधा",
    heroDesc: "तुमच्या पिकाच्या पानाचा फोटो काढा आणि उपचार शिफारसींसह त्वरित एआय निदान मिळवा.",
    startScan: "स्कॅनिंग सुरू करा",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export const useLang = () => useContext(LangContext);
