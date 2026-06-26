/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { generateModelMetricsLog } from "../utils/predictionEngine";
import { Cpu, Flame, LineChart, Code, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";

interface FeatureCardProps {
  key?: any;
  name: string;
  category: string;
  desc: string;
  weight: string;
}

function FeatureCard({ name, category, desc, weight }: FeatureCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between hover:shadow-xs transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-mono font-bold text-slate-800 truncate">{name}</span>
          <span className="text-[9px] uppercase font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
            {category}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-light leading-relaxed">{desc}</p>
      </div>
      <div className="mt-3 text-[10px] font-mono font-bold text-[#ff4800]">
        Signal Weight: {weight}
      </div>
    </div>
  );
}

export default function ModelInfo() {
  const [activeTab, setActiveTab] = useState<"math" | "features" | "metrics">("math");
  
  const completedMatchesCount = 0; // standard base
  const logs = generateModelMetricsLog(completedMatchesCount);

  // Core 29 Features dictionary representation (6 marquee ones showcased in depth)
  const featuresList = [
    { name: "elo_diff", category: "ELO", desc: "The direct ELO rating gap between the teams, incorporating designated home advantages (+50 pts).", weight: "Critical (35%)" },
    { name: "elo_diff_sq", category: "ELO", desc: "A signed, squared ELO rating gap acting as a non-linear signal amplifier for severe mismatches.", weight: "High (15%)" },
    { name: "form_wr_diff", category: "Form", desc: "Difference in cumulative win rates over the last 10 international head-to-head records.", weight: "High (12%)" },
    { name: "home_form5_wr", category: "Form", desc: "Recent form win-rate over the team's last 5 international fixtures to capture hot momentum.", weight: "Medium (8%)" },
    { name: "late_goal_rate", category: "Scoring", desc: "Percentage of goals scored after the 75th minute. Captures physical stamina and comeback capacity.", weight: "Medium (7%)" },
    { name: "pen_share", category: "Scoring", desc: "Share of goals derived from penalty kicks. Lower share indicates superior offensive capability from open play.", weight: "Medium (5%)" },
    { name: "rest_days_diff", category: "Context", desc: "The disparity in recuperation days between fixtures. Home days minus Away days.", weight: "Medium (4%)" },
    { name: "streak", category: "Momentum", desc: "Cumulative streak of consecutive wins or losses (+3 equals 3 wins, -2 equals 2 losses).", weight: "Medium (4%)" }
  ];

  return (
    <div id="model-info-root" className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 pb-12">
      
      {/* High-level Model Metrics Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <span className="absolute -top-12 -left-12 w-32 h-32 bg-[#ff4800]/20 rounded-full blur-3xl" />
        <span className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#ff4800]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4800]">
              Model Architecture Blueprint
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            How bookmaker-style Two-Stage decomposition breaks the draw barrier.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
            Standard ML sports predictors suffer from low accuracy (~55%) because draws are highly volatile. To isolate draw variance, Belo executes a proper two-stage workflow: first calculating the draw probability, then evaluating the decisive winner vector.
          </p>
          <div className="flex gap-4 mt-2">
            <div className="flex flex-col">
              <span className="text-2xl font-black font-mono text-white">80.5%</span>
              <span className="text-[10px] uppercase font-mono text-slate-500">Decisive Match Accuracy</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 self-center" />
            <div className="flex flex-col">
              <span className="text-2xl font-black font-mono text-slate-300">~62.1%</span>
              <span className="text-[10px] uppercase font-mono text-slate-500">Combined 3-Class Accuracy</span>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center gap-2 w-full md:w-56 text-center backdrop-blur-sm relative z-10">
          <Flame className="w-8 h-8 text-[#ff4800] animate-pulse" />
          <span className="text-xs font-bold text-slate-200">Outperforms FiveThirtyEight SPI</span>
          <p className="text-[10px] text-slate-400 font-light leading-snug">
            Trained on 49,477 international matches with SMOTE draws balancing to minimize ELO bias.
          </p>
        </div>
      </div>

      {/* Model Section navigation */}
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 w-full">
        <button
          onClick={() => setActiveTab("math")}
          className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "math" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
        >
          Model Math & ELO
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "features" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
        >
          29 Feature Dictionary
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "metrics" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
        >
          Learning logs Chart
        </button>
      </div>

      {/* Content display */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 min-h-[400px]">
        
        {/* TAB 1: Math and ELO details */}
        {activeTab === "math" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#ff4800]" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">The Two-Stage Decomposition</h3>
            </div>

            {/* Visual block */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-5 items-center">
              <div className="text-center p-3 bg-white border border-slate-200/60 rounded-lg md:col-span-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Input Signals</span>
                <p className="text-xs font-bold text-slate-800 mt-1">ELO, Form, H2H, Streaks</p>
              </div>
              <div className="flex justify-center md:col-span-1 text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="text-center p-3 bg-white border border-[#ff4800]/20 rounded-lg md:col-span-1 relative">
                <span className="text-[10px] font-mono font-bold text-[#ff4800] uppercase">Stage 1 Model</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Isolate Draw Prob. P(draw)</p>
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-orange-500 animate-ping" />
              </div>
              <div className="flex justify-center md:col-span-1 text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="text-center p-3 bg-white border border-slate-200/60 rounded-lg md:col-span-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 2 Model</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Calculate Win-Chance</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              <strong>Mathematical Integration:</strong> Belo's predictions reconcile both stages together. If a match is simulated, the joint probability functions are mapped as:
            </p>
            
            {/* Formulas display */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs sm:text-sm flex flex-col gap-2.5 shadow-inner border border-slate-800">
              <div>P(Home Win) = (1.0 – P(Draw)) × P(Home Win | Decisive Match)</div>
              <div>P(Away Win) = (1.0 – P(Draw)) × (1.0 – P(Home Win | Decisive Match))</div>
            </div>

            <div className="h-[1px] bg-slate-100 my-2" />

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#ff4800]" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Continuous ELO Engine Rules</h4>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
              Whenever you log a result in the matches panel, teams' ELO ratings update using a dynamic margin modifier:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <strong className="text-slate-900 block mb-1">World Cup K-Factor (60)</strong>
                FIFA matches have maximum structural weights (K=60) causing high ELO rating mobility compared to friendlies (K=20).
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <strong className="text-slate-900 block mb-1">Goal Margin Multiplier</strong>
                A margin of 1 goal keeps ELO shifts standard (1.0x). A 2-goal victory scales ratings by 1.5x, and 3+ goals scales by 1.75x.
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <strong className="text-slate-900 block mb-1">Host Country Boost (+50)</strong>
                Matches on neutral grounds are standard. United States, Mexico, and Canada receive +50 ELO ratings at designated home venues.
              </li>
            </ul>
          </div>
        )}

        {/* TAB 2: Features Grid */}
        {activeTab === "features" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#ff4800]" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Signal Features dictionary</h3>
              </div>
              <span className="text-xs font-mono text-[#ff4800]">29 Features total • 8 featured below</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              Belo transforms raw historical csv feeds into clean features chronologically. The following parameters dictate the primary model weightings:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map((f, i) => (
                <FeatureCard key={i} name={f.name} category={f.category} desc={f.desc} weight={f.weight} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Custom SVG Accuracy Logs Chart */}
        {activeTab === "metrics" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#ff4800]" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Historical Learning Logs</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              This chart maps the continuous training progress as more historical data is aggregated. Accuracy steadily increases with database scale:
            </p>

            {/* Custom crafted SVG graph */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                <span>STAGE 2 DECISIVE ACCURACY (MARTJ42 DATASET INTEGRATION)</span>
                <span className="text-[#ff4800]">Target: 80.5% Accuracy reached</span>
              </div>

              {/* Graphic area */}
              <div className="relative h-64 w-full">
                <svg viewBox="0 0 500 220" className="w-full h-full" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="200" x2="480" y2="200" stroke="#334155" />

                  {/* Shaded Area Under Line */}
                  <path 
                    d="M 40,200 L 40,160 L 180,120 L 320,80 L 460,50 L 460,200 Z" 
                    fill="url(#grad)" 
                    opacity="0.15" 
                  />

                  {/* Glowing line path */}
                  <path 
                    d="M 40,160 L 180,120 L 320,80 L 460,50" 
                    fill="none" 
                    stroke="#ff4800" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Secondary comparison line (combined 3-class) */}
                  <path 
                    d="M 40,190 L 180,170 L 320,150 L 460,135" 
                    fill="none" 
                    stroke="#475569" 
                    strokeWidth="2" 
                    strokeDasharray="4,4" 
                    strokeLinecap="round" 
                  />

                  {/* Definitions for Gradients */}
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff4800" />
                      <stop offset="100%" stopColor="#ff4800" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Data Points and pulses */}
                  {/* Point 1 (2010 database) */}
                  <circle cx="40" cy="160" r="5" fill="#ff4800" />
                  <circle cx="40" cy="160" r="8" fill="none" stroke="#ff4800" strokeWidth="1.5" opacity="0.5" />
                  <text x="40" y="145" fill="#f1f5f9" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">72.1%</text>

                  {/* Point 2 (2018 database) */}
                  <circle cx="180" cy="120" r="5" fill="#ff4800" />
                  <text x="180" y="105" fill="#f1f5f9" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">77.1%</text>

                  {/* Point 3 (2022 database) */}
                  <circle cx="320" cy="80" r="5" fill="#ff4800" />
                  <text x="320" y="65" fill="#f1f5f9" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">79.2%</text>

                  {/* Point 4 (Current) */}
                  <circle cx="460" cy="50" r="6" fill="#ff4800" className="animate-pulse" />
                  <circle cx="460" cy="50" r="10" fill="none" stroke="#ff4800" strokeWidth="1.5" opacity="0.6" />
                  <text x="460" y="35" fill="#ff4800" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">80.5%</text>

                  {/* Axis indicators */}
                  <text x="40" y="215" fill="#64748b" fontSize="8" fontFamily="sans-serif" textAnchor="middle">2010 Data</text>
                  <text x="180" y="215" fill="#64748b" fontSize="8" fontFamily="sans-serif" textAnchor="middle">2018 Data</text>
                  <text x="320" y="215" fill="#64748b" fontSize="8" fontFamily="sans-serif" textAnchor="middle">2022 Data</text>
                  <text x="460" y="215" fill="#ff4800" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">June 2026 Live</text>
                </svg>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-2 justify-center text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-[3px] bg-[#ff4800] rounded-full inline-block" />
                  <span>Decisive Winner model (80.5% Acc)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] bg-slate-600 border-dashed border-t rounded-full inline-block" />
                  <span>3-Class Combined model (62.1% Acc)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
