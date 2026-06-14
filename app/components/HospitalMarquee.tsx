"use client";

import React from "react";

const ICONS: { Icon: React.FC<{ size?: number }>; name: string }[] = [
  {
    name: "MedCross Health",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="14" y="4" width="12" height="32" rx="4" stroke="white" strokeWidth="2" />
        <rect x="4" y="14" width="32" height="12" rx="4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "LifeStar Medical",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
        <path d="M21 4 L24 14 L34 10 L28 18 L38 21 L28 24 L34 32 L24 28 L21 38 L18 28 L8 32 L14 24 L4 21 L14 18 L8 10 L18 14 Z"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="21" cy="21" r="5" stroke="white" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: "ShieldCare",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
        <path d="M19 3 L33 9 L33 20 C33 28 19 35 19 35 C19 35 5 28 5 20 L5 9 Z"
          stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="19" y1="13" x2="19" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="20" x2="26" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "CardioVita",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <path d="M22 36 C22 36 6 26 6 15 C6 10 10 6 15 6 C18 6 21 8 22 10 C23 8 26 6 29 6 C34 6 38 10 38 15 C38 26 22 36 22 36Z"
          stroke="white" strokeWidth="1.8" />
        <polyline points="8,22 13,22 16,16 19,28 22,22 26,22 29,18 32,22 36,22"
          stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Caduceus Clinic",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <line x1="22" y1="4" x2="22" y2="40" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 12 C28 10 30 16 22 18 C30 20 28 26 22 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M22 12 C16 10 14 16 22 18 C14 20 16 26 22 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M14 8 C10 4 8 8 14 10 C14 10 16 6 22 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M30 8 C34 4 36 8 30 10 C30 10 28 6 22 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    name: "Horizon Hospital",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="1.8" />
        <line x1="13" y1="12" x2="13" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="27" y1="12" x2="27" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="20" x2="27" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Genomica Research",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <path d="M15 4 C25 10, 19 18, 29 22 C19 26, 25 34, 15 40" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M29 4 C19 10, 25 18, 15 22 C25 26, 19 34, 29 40" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <line x1="16" y1="14" x2="28" y2="18" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="16" y1="26" x2="28" y2="30" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "StethoCare",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <path d="M13 6 L13 20 C13 26 18 30 22 30 C26 30 31 26 31 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M31 20 L31 26 C31 32 36 34 36 34" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="36" r="3" stroke="white" strokeWidth="1.8" />
        <circle cx="10" cy="7" r="2.5" stroke="white" strokeWidth="1.5" />
        <circle cx="16" cy="7" r="2.5" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "RxPharm Group",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
        <circle cx="21" cy="21" r="17" stroke="white" strokeWidth="1.8" />
        <path d="M15 14 L15 28 M15 14 C15 14 23 14 23 19 C23 24 15 24 15 24" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <line x1="20" y1="24" x2="27" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "DiamondMed",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="5" y="5" width="30" height="30" rx="4" transform="rotate(45 20 20)"
          stroke="white" strokeWidth="1.8" />
        <line x1="20" y1="12" x2="20" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="20" x2="28" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "LabMicro Institute",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <rect x="17" y="4" width="8" height="14" rx="2" stroke="white" strokeWidth="1.8" />
        <line x1="21" y1="18" x2="21" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="21" cy="28" rx="10" ry="4" stroke="white" strokeWidth="1.8" />
        <line x1="10" y1="36" x2="32" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Lotus Wellness",
    Icon: ({ size = 34 }) => (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <path d="M22 38 C22 38 8 30 8 18 C8 12 13 8 18 10 C20 10 21 11 22 12 C23 11 24 10 26 10 C31 8 36 12 36 18 C36 30 22 38 22 38Z"
          stroke="white" strokeWidth="1.8" />
        <path d="M22 12 C16 6 8 8 6 14" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M22 12 C28 6 36 8 38 14" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <line x1="22" y1="20" x2="22" y2="38" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HospitalMarquee() {
  // Triple the list for a seamless infinite loop with no gap
  const items = [...ICONS, ...ICONS, ...ICONS];

  return (
    <>
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .mq-single {
          animation: marqueeLeft 30s linear infinite;
          will-change: transform;
        }
        .mq-single:hover { animation-play-state: paused; }
      `}</style>

      <div
        className="w-full overflow-hidden my-6"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        {/* Single row scrolling left */}
        <div className="mq-single flex items-center" style={{ width: "max-content" }}>
          {items.map(({ Icon, name }, i) => (
            <div key={i}
              className="flex items-center gap-3 px-7 py-3 flex-shrink-0"
              style={{ borderRight: "1px solid rgba(255,200,160,0.1)" }}>
              {/* Icon */}
              <div style={{ opacity: 0.35 }}>
                <Icon size={26} />
              </div>
              {/* Name */}
              <span
                className="font-headline text-xs font-semibold whitespace-nowrap tracking-wide"
                style={{ color: "rgba(255,230,200,0.45)" }}>
                {name}
              </span>
              {/* Dot separator */}
              <span style={{ color: "rgba(255,180,120,0.25)", fontSize: 18, lineHeight: 1, marginLeft: 4 }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
