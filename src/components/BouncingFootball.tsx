import React from "react";
import { motion } from "motion/react";

export default function BouncingFootball({ size = 32 }: { size?: number }) {
  // Classic soccer pentagon positions for the vector SVG
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        y: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 3.6,
          repeat: Infinity,
          ease: "linear",
        },
      }}
      style={{ width: size, height: size }}
      className="relative cursor-pointer flex items-center justify-center select-none filter drop-shadow-[0_4px_6px_rgba(255,72,0,0.3)]"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer sphere/base with gradient */}
        <defs>
          <radialGradient id="ballShading" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff8f2" />
            <stop offset="35%" stopColor="#ffedd5" />
            <stop offset="70%" stopColor="#ff9f66" />
            <stop offset="100%" stopColor="#d93800" />
          </radialGradient>
          <linearGradient id="pentagonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1e24" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="goldStripe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Sphere body */}
        <circle cx="50" cy="50" r="48" fill="url(#ballShading)" stroke="#1e293b" strokeWidth="2.5" />

        {/* Center Pentagon */}
        <polygon
          points="50,38 61,46 57,59 43,59 39,46"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />

        {/* Top Pentagon panel */}
        <polygon
          points="50,15 58,5 42,5"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />
        <line x1="50" y1="38" x2="50" y2="15" stroke="#ff4800" strokeWidth="2" />

        {/* Top-Right Panel lines */}
        <polygon
          points="78,28 88,38 78,50"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />
        <line x1="61" y1="46" x2="78" y2="28" stroke="#ff4800" strokeWidth="2" />

        {/* Bottom-Right Panel lines */}
        <polygon
          points="70,78 60,88 78,70"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />
        <line x1="57" y1="59" x2="70" y2="78" stroke="#ff4800" strokeWidth="2" />

        {/* Bottom-Left Panel lines */}
        <polygon
          points="30,78 40,88 22,70"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />
        <line x1="43" y1="59" x2="30" y2="78" stroke="#ff4800" strokeWidth="2" />

        {/* Top-Left Panel lines */}
        <polygon
          points="22,28 12,38 22,50"
          fill="url(#pentagonGrad)"
          stroke="#ff4800"
          strokeWidth="1.5"
        />
        <line x1="39" y1="46" x2="22" y2="28" stroke="#ff4800" strokeWidth="2" />

        {/* Connections to outer sphere boundary */}
        <line x1="58" y1="5" x2="78" y2="28" stroke="#ff4800" strokeWidth="1.5" />
        <line x1="42" y1="5" x2="22" y2="28" stroke="#ff4800" strokeWidth="1.5" />
        <line x1="88" y1="38" x2="78" y2="50" stroke="#ff4800" strokeWidth="1.5" />
        <line x1="12" y1="38" x2="22" y2="50" stroke="#ff4800" strokeWidth="1.5" />
        <line x1="78" y1="70" x2="70" y2="78" stroke="#ff4800" strokeWidth="1.5" />
        <line x1="22" y1="70" x2="30" y2="78" stroke="#ff4800" strokeWidth="1.5" />

        {/* Subtle decorative "2026" gold print in center pentagon */}
        <text
          x="50"
          y="50"
          fill="url(#goldStripe)"
          fontSize="10"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Space Grotesk', sans-serif animate-pulse"
        >
          26
        </text>
      </svg>
    </motion.div>
  );
}
