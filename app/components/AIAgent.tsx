"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { db } from "../../lib/db";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  time: string;
}

interface AIAgentProps {
  role?: "patient" | "doctor" | "admin";
}

// ── Theme maps per role ─────────────────────────────────────
const THEMES = {
  patient: {
    bubble: "rgba(207,107,62,0.45)",
    border: "rgba(255,200,160,0.28)",
    nav: "rgba(10,4,0,0.6)",
    navBorder: "rgba(255,180,120,0.2)",
    accent: "#ffcfa0",
    accentDark: "#CF6B3E",
    btnGrad: "linear-gradient(135deg,rgba(207,107,62,0.92),rgba(122,44,0,0.88))",
    btnShadow: "0 4px 18px rgba(207,107,62,0.45)",
    btnBorder: "rgba(245,168,120,0.45)",
    cardBg: "rgba(255,255,255,0.10)",
    inputBg: "rgba(255,245,235,0.92)",
    inputBorder: "rgba(255,180,130,0.5)",
    inputColor: "#1a0800",
    tagBg: "rgba(207,107,62,0.28)",
    tagColor: "#ffcfa0",
    gradBg: "linear-gradient(145deg,#1a0800 0%,#5c2200 60%,#CF6B3E 100%)",
  },
  doctor: {
    bubble: "rgba(26,122,85,0.45)",
    border: "rgba(100,220,160,0.28)",
    nav: "rgba(0,8,4,0.6)",
    navBorder: "rgba(100,220,160,0.2)",
    accent: "#a5f3d0",
    accentDark: "#1a7a55",
    btnGrad: "linear-gradient(135deg,rgba(26,122,85,0.92),rgba(0,42,26,0.88))",
    btnShadow: "0 4px 18px rgba(26,122,85,0.45)",
    btnBorder: "rgba(100,220,160,0.35)",
    cardBg: "rgba(255,255,255,0.09)",
    inputBg: "rgba(235,255,245,0.92)",
    inputBorder: "rgba(100,200,150,0.5)",
    inputColor: "#001208",
    tagBg: "rgba(26,122,85,0.28)",
    tagColor: "#a5f3d0",
    gradBg: "linear-gradient(145deg,#001208 0%,#004a2a 60%,#1a7a55 100%)",
  },
  admin: {
    bubble: "rgba(92,58,138,0.45)",
    border: "rgba(160,120,220,0.28)",
    nav: "rgba(5,2,14,0.65)",
    navBorder: "rgba(160,120,220,0.2)",
    accent: "#ddd6fe",
    accentDark: "#5c3a8a",
    btnGrad: "linear-gradient(135deg,rgba(92,58,138,0.92),rgba(36,21,64,0.88))",
    btnShadow: "0 4px 18px rgba(92,58,138,0.45)",
    btnBorder: "rgba(180,140,240,0.35)",
    cardBg: "rgba(255,255,255,0.08)",
    inputBg: "rgba(240,235,255,0.92)",
    inputBorder: "rgba(160,120,220,0.5)",
    inputColor: "#07030f",
    tagBg: "rgba(92,58,138,0.28)",
    tagColor: "#ddd6fe",
    gradBg: "linear-gradient(145deg,#07030f 0%,#241540 60%,#5c3a8a 100%)",
  },
};

// ── Knowledge base ──────────────────────────────────────────
const QUICK_CHIPS = [
  "Working hours",
  "Our doctors",
  "Consultation fee",
  "How to book",
  "Emergency",
  "Departments",
  "Cancel appointment",
  "Insurance",
];

function buildKnowledge() {
  const docs = db.getDoctors();
  return {
    hours: `🕐 **MediFlow Clinic Hours**\n\n• **Mon – Fri:** 8:00 AM – 8:00 PM\n• **Saturday:** 9:00 AM – 5:00 PM\n• **Sunday:** Emergency only (24 hrs)\n\n📞 For after-hours emergencies call: **+1 800-MEDIFLOW**`,

    doctors: docs.length === 0
      ? "No doctors are currently registered in the system."
      : `👨‍⚕️ **Our Specialist Doctors**\n\n${docs.map(d =>
          `• **${d.full_name}** — ${d.specialization} (${d.department} Dept.)\n  Available: ${Object.keys(d.availability).join(", ")}`
        ).join("\n\n")}`,

    fee: `💳 **Consultation Fees**\n\n• **General Consultation:** $120 per visit\n• **Specialist (Cardiology/Neurology):** $150\n• **Pediatrics:** $100\n• **Emergency Consult:** $200\n• **Lab Report Review:** $60\n\n✅ All major insurance accepted. Co-pay applies per plan.`,

    booking: `📅 **How to Book an Appointment**\n\n1. Click **"Schedule"** in the top nav\n2. Choose your **Department** (e.g. Cardiology)\n3. Select your preferred **Specialist**\n4. Pick an available **Date & Time**\n5. Add optional notes & confirm\n\n🕐 Slots open 7 days in advance. Confirmation is sent to your email.`,

    emergency: `🚨 **Emergency Services**\n\nWe operate a **24/7 Emergency Unit.**\n\n• Emergency Hotline: **+1 800-MEDIFLOW**\n• Walk-ins accepted — no prior booking needed\n• Ambulance coordination: **911**\n• On-site ER staff always available\n\n⚠️ For life-threatening situations always call 911 first.`,

    departments: `🏥 **Clinical Departments**\n\n• ❤️ Cardiology — Heart & Vascular\n• 👶 Pediatrics — Children's Health\n• 🧠 Neurology — Brain & Nervous System\n• 🦴 Orthopedics — Bones & Joints\n• 👁️ Ophthalmology — Eye Care\n• 💊 General Medicine — Primary Care\n• 🩺 Dermatology — Skin & Hair\n• 🚨 Emergency — Critical Care (24/7)`,

    cancel: `🗓️ **Cancelling an Appointment**\n\nTo cancel:\n1. Go to your **Dashboard** → view appointments\n2. Find the booking and click **Cancel**\n\nOr call us: **+1 555-0100**\n\n⚠️ Please cancel at least **24 hours in advance** to avoid a cancellation fee of $25.`,

    insurance: `🏦 **Insurance & Payments**\n\nAccepted insurance providers:\n• BlueCross BlueShield\n• Aetna\n• Cigna\n• United Healthcare\n• Medicare / Medicaid\n\n💳 We also accept credit/debit cards and HSA/FSA.\n\nFor billing queries call: **+1 555-0101**`,

    greeting: `👋 Hi there! I'm **MediAI**, your MediFlow Health assistant.\n\nI can help you with:\n• 🕐 Clinic hours & schedules\n• 👨‍⚕️ Doctor info & availability\n• 💳 Fees & insurance\n• 📅 Booking guidance\n• 🚨 Emergency contacts\n\nWhat would you like to know?`,

    fallback: `🤔 I'm not sure about that one. Here's what I can help with:\n\n• **Working hours** — our schedule\n• **Our doctors** — specialists & availability\n• **Consultation fee** — pricing details\n• **How to book** — appointment guide\n• **Emergency** — 24/7 contacts\n\nTry one of the quick options below, or call us at **+1 555-0100**.`,
  };
}

function getResponse(input: string): string {
  const q = input.toLowerCase().trim();
  const kb = buildKnowledge();

  if (!q || q.length < 2) return kb.fallback;

  if (/hour|time|open|close|schedule|timing|when|day|weekend|sunday|saturday|monday/.test(q)) return kb.hours;
  if (/doctor|physician|specialist|staff|who|dr\.|cardiolog|pediatric|neurolog|dr /.test(q)) return kb.doctors;
  if (/fee|cost|price|charge|pay|amount|how much|billing|bill/.test(q)) return kb.fee;
  if (/book|appointment|schedule|slot|reserve|visit|consult/.test(q)) return kb.booking;
  if (/emergency|urgent|ambulance|critical|icu|accident|crisis|911/.test(q)) return kb.emergency;
  if (/department|dept|cardiology|pediatric|neurology|ortho|eye|derm|general/.test(q)) return kb.departments;
  if (/cancel|reschedule|postpone|change/.test(q)) return kb.cancel;
  if (/insurance|coverage|aetna|bluecross|cigna|united|medicare|hsa|fsa/.test(q)) return kb.insurance;
  if (/hi|hello|hey|good|morning|afternoon|evening|start/.test(q)) return kb.greeting;

  return kb.fallback;
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ── Render markdown-like bold text ─────────────────────────
function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

// ── Gemini-style 4-pointed star icon ──────────────────────
function GeminiIcon({ size = 24, color = "#fff", color2 }: { size?: number; color?: string; color2?: string }) {
  const id = `gem-${Math.random().toString(36).slice(2, 7)}`;
  const c2 = color2 || color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* Gemini 4-pointed star — smooth bezier crosshatch */}
      <path
        d="M12 2
           C 12 7.5, 15.5 8.5, 22 12
           C 15.5 15.5, 12 16.5, 12 22
           C 12 16.5, 8.5 15.5, 2 12
           C 8.5 8.5, 12 7.5, 12 2
           Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

export default function AIAgent({ role = "patient" }: AIAgentProps) {
  const theme = THEMES[role];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [pulse, setPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stop pulsing after 8s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const addBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    const delay = Math.min(500 + text.length * 8, 1800);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        from: "bot",
        text,
        time: formatTime(),
      }]);
    }, delay);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setPulse(false);
    if (!hasOpened) {
      setHasOpened(true);
      setTimeout(() => {
        addBotMessage(buildKnowledge().greeting);
      }, 300);
    }
  };

  const handleSend = useCallback((text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text: query,
      time: formatTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    addBotMessage(getResponse(query));
  }, [input, addBotMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
        style={{ bottom: isOpen ? "0" : "24px" }}>

        {/* Tooltip hint (only when closed, first 8s) */}
        {!isOpen && pulse && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold animate-fade-in-up"
            style={{ background: theme.cardBg, backdropFilter: "blur(16px)", border: `1px solid ${theme.border}`, color: "rgba(255,255,255,0.9)" }}>
            <GeminiIcon size={16} color={theme.accent} color2={theme.accentDark} />
            Ask MediAI anything!
          </div>
        )}

        {!isOpen && (
          <button
            id="mediAI-fab"
            onClick={handleOpen}
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative active:scale-90 transition-all"
            style={{
              background: theme.btnGrad,
              border: `1px solid ${theme.btnBorder}`,
              boxShadow: theme.btnShadow,
            }}
            title="Chat with MediAI"
          >
            <GeminiIcon size={28} color="#fff" color2={theme.accent} />
            {pulse && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                style={{ background: "#22c55e", borderColor: "rgba(0,0,0,0.3)", animation: "ping 1s ease-in-out infinite" }} />
            )}
          </button>
        )}
      </div>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          id="mediAI-panel"
          className="fixed z-[9998] flex flex-col overflow-hidden"
          style={{
            bottom: 24,
            right: 24,
            width: "clamp(320px, 90vw, 400px)",
            height: "clamp(480px, 80vh, 600px)",
            background: "rgba(10,5,0,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${theme.border}`,
            borderRadius: "20px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3)",
            animation: "fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: theme.nav, borderBottom: `1px solid ${theme.navBorder}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: theme.bubble }}>
                <GeminiIcon size={20} color={theme.accent} color2={theme.accentDark} />
              </div>
              <div>
                <p className="font-headline text-sm font-bold text-white leading-tight">MediAI Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-label text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>Online • MediFlow Health</span>
                </div>
              </div>
            </div>
            <button
              id="mediAI-close"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
            style={{ scrollbarWidth: "thin", scrollbarColor: `${theme.accentDark} transparent` }}>
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: theme.bubble }}>
                  <GeminiIcon size={36} color={theme.accent} color2={theme.accentDark} />
                </div>
                <p className="font-headline text-base font-bold text-white">Hi! I'm MediAI</p>
                <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Ask me about doctors, hours, fees, appointments, or anything clinic-related!
                </p>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {msg.from === "bot" && (
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1"
                    style={{ background: theme.bubble }}>
                    <GeminiIcon size={14} color={theme.accent} color2={theme.accentDark} />
                  </div>
                )}
                <div style={{ maxWidth: "80%" }}>
                  <div className="px-3 py-2.5 rounded-2xl text-xs font-body"
                    style={msg.from === "user"
                      ? {
                          background: theme.btnGrad,
                          border: `1px solid ${theme.btnBorder}`,
                          color: "#fff",
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "rgba(255,255,255,0.10)",
                          border: `1px solid ${theme.border}`,
                          color: "rgba(255,255,255,0.92)",
                          borderBottomLeftRadius: "6px",
                        }
                    }>
                    {msg.from === "bot"
                      ? <BotText text={msg.text} />
                      : msg.text
                    }
                  </div>
                  <p className="font-label text-[9px] mt-1 px-1"
                    style={{ color: "rgba(255,255,255,0.3)", textAlign: msg.from === "user" ? "right" : "left" }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start gap-2 items-end">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: theme.bubble }}>
                  <GeminiIcon size={14} color={theme.accent} color2={theme.accentDark} />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1"
                  style={{ background: "rgba(255,255,255,0.10)", border: `1px solid ${theme.border}` }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: theme.accent,
                        animation: `bounce 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.18}s`,
                      }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto flex-shrink-0"
            style={{ scrollbarWidth: "none", borderTop: `1px solid ${theme.border}` }}>
            {QUICK_CHIPS.map(chip => (
              <button key={chip}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-full font-label text-[10px] whitespace-nowrap flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{ background: theme.tagBg, border: `1px solid ${theme.border}`, color: theme.tagColor }}>
                {chip}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 flex gap-2 flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.2)" }}>
            <input
              ref={inputRef}
              id="mediAI-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about hours, doctors, fees..."
              className="flex-1 h-10 px-3 rounded-xl font-body text-xs outline-none"
              style={{
                background: theme.inputBg,
                border: `1.5px solid ${theme.inputBorder}`,
                color: theme.inputColor,
              }}
            />
            <button
              id="mediAI-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
              style={{
                background: input.trim() ? theme.btnGrad : "rgba(255,255,255,0.08)",
                border: `1px solid ${input.trim() ? theme.btnBorder : "rgba(255,255,255,0.1)"}`,
                boxShadow: input.trim() ? theme.btnShadow : "none",
              }}>
              <span className="material-symbols-outlined text-[18px]"
                style={{ color: input.trim() ? "#fff" : "rgba(255,255,255,0.3)" }}>send</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping {
          0%,100%{transform:scale(1);opacity:1}
          50%{transform:scale(1.6);opacity:0.5}
        }
        @keyframes bounce {
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-5px)}
        }
      `}</style>
    </>
  );
}
