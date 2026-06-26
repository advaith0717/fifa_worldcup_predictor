/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Cpu, Database, Flame, Globe, Sparkles, TrendingUp } from "lucide-react";
import BouncingFootball from "./BouncingFootball";

interface WorldCup {
  year: number;
  host: string;
  winner: string;
  winnerFlag: string;
  winnerColor: string;
}

const HISTORICAL_WCS: WorldCup[] = [
  { year: 1930, host: "Uruguay", winner: "Uruguay", winnerFlag: "🇺🇾", winnerColor: "#0081C6" },
  { year: 1934, host: "Italy", winner: "Italy", winnerFlag: "🇮🇹", winnerColor: "#0066BC" },
  { year: 1938, host: "France", winner: "Italy", winnerFlag: "🇮🇹", winnerColor: "#0066BC" },
  { year: 1950, host: "Brazil", winner: "Uruguay", winnerFlag: "🇺🇾", winnerColor: "#0081C6" },
  { year: 1954, host: "Switzerland", winner: "West Germany", winnerFlag: "🇩🇪", winnerColor: "#FFD700" },
  { year: 1958, host: "Sweden", winner: "Brazil", winnerFlag: "🇧🇷", winnerColor: "#009C3B" },
  { year: 1962, host: "Chile", winner: "Brazil", winnerFlag: "🇧🇷", winnerColor: "#009C3B" },
  { year: 1966, host: "England", winner: "England", winnerFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", winnerColor: "#CF081F" },
  { year: 1970, host: "Mexico", winner: "Brazil", winnerFlag: "🇧🇷", winnerColor: "#009C3B" },
  { year: 1974, host: "Germany", winner: "West Germany", winnerFlag: "🇩🇪", winnerColor: "#FFD700" },
  { year: 1978, host: "Argentina", winner: "Argentina", winnerFlag: "🇦🇷", winnerColor: "#75AADB" },
  { year: 1982, host: "Spain", winner: "Italy", winnerFlag: "🇮🇹", winnerColor: "#0066BC" },
  { year: 1986, host: "Mexico", winner: "Argentina", winnerFlag: "🇦🇷", winnerColor: "#75AADB" },
  { year: 1990, host: "Italy", winner: "West Germany", winnerFlag: "🇩🇪", winnerColor: "#FFD700" },
  { year: 1994, host: "United States", winner: "Brazil", winnerFlag: "🇧🇷", winnerColor: "#009C3B" },
  { year: 1998, host: "France", winner: "France", winnerFlag: "🇫🇷", winnerColor: "#002395" },
  { year: 2002, host: "Korea/Japan", winner: "Brazil", winnerFlag: "🇧🇷", winnerColor: "#009C3B" },
  { year: 2006, host: "Germany", winner: "Italy", winnerFlag: "🇮🇹", winnerColor: "#0066BC" },
  { year: 2010, host: "South Africa", winner: "Spain", winnerFlag: "🇪🇸", winnerColor: "#C1272D" },
  { year: 2014, host: "Brazil", winner: "Germany", winnerFlag: "🇩🇪", winnerColor: "#FFD700" },
  { year: 2018, host: "Russia", winner: "France", winnerFlag: "🇫🇷", winnerColor: "#002395" },
  { year: 2022, host: "Qatar", winner: "Argentina", winnerFlag: "🇦🇷", winnerColor: "#75AADB" },
  { year: 2026, host: "Can/Mex/USA", winner: "Live Simulator", winnerFlag: "🏆", winnerColor: "#FF4800" }
];

interface Badge3D {
  wc: WorldCup;
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  speed: number;
  radius: number;
  hovered: boolean;
  screenX?: number;
  screenY?: number;
  screenRadius?: number;
}

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgesRef = useRef<Badge3D[]>([]);
  
  // Interactive 3D rotation angles
  const angleX = useRef<number>(0);
  const angleY = useRef<number>(0.003); // Initial slow rotation velocity
  const currentRotX = useRef<number>(0);
  const currentRotY = useRef<number>(0);
  
  const isDragging = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  
  const [hoveredBadge, setHoveredBadge] = useState<Badge3D | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Initialize badges in 3D Space (dispersed across the entire screen viewport)
  const initBadges = (width: number, height: number) => {
    const list: Badge3D[] = [];
    const count = HISTORICAL_WCS.length;
    
    HISTORICAL_WCS.forEach((wc, i) => {
      // Disperse evenly across the full width and height
      const x = (Math.random() - 0.5) * width * 0.88;
      const y = (Math.random() - 0.5) * height * 0.88;
      const z = (Math.random() - 0.5) * 300; // broader depth range

      list.push({
        wc,
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.004,
        radius: wc.year === 2026 ? 38 : 28, // 2026 is slightly larger & highlighted
        hovered: false
      });
    });
    badgesRef.current = list;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    initBadges(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
      // Re-disperses across the full screen dimensions on resize
      badgesRef.current.forEach((b) => {
        b.baseX = (Math.random() - 0.5) * width * 0.88;
        b.baseY = (Math.random() - 0.5) * height * 0.88;
        b.baseZ = (Math.random() - 0.5) * 300;
      });
    };
    window.addEventListener("resize", handleResize);

    const fov = 400; // Camera perspective distance
    const cx = width / 2;
    const cy = height / 2;

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Auto rotation friction / easing
      if (!isDragging.current) {
        angleY.current *= 0.98;
        angleX.current *= 0.98;
        // Gently oscillate the rotation angles back and forth over time to create a slow breathing swing
        const time = Date.now() * 0.0002;
        angleY.current = 0.0006 * Math.cos(time);
        angleX.current = 0.0004 * Math.sin(time);
      }
      
      currentRotY.current += angleY.current;
      currentRotX.current += angleX.current;

      const cosY = Math.cos(angleY.current);
      const sinY = Math.sin(angleY.current);
      const cosX = Math.cos(angleX.current);
      const sinX = Math.sin(angleX.current);

      // 1. Update positions & drift + 3D rotations
      badgesRef.current.forEach((b) => {
        // Natural independent orbital drift
        b.phase += b.speed;
        const driftX = Math.sin(b.phase) * 0.35;
        const driftY = Math.cos(b.phase) * 0.35;
        const driftZ = Math.sin(b.phase * 1.5) * 0.25;

        let x = b.x + driftX;
        let y = b.y + driftY;
        let z = b.z + driftZ;

        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        b.x = x1;
        b.y = y2;
        b.z = z2;

        // Perspective projections
        let scale = fov / (fov + b.z);
        if (isNaN(scale) || !isFinite(scale)) {
          scale = 1;
        }
        scale = Math.max(0.05, Math.min(4, scale));

        b.screenX = cx + b.x * scale;
        b.screenY = cy + b.y * scale;
        b.screenRadius = Math.max(1, b.radius * scale);
      });

      // 1.5. Render Constellation Lines (subtle glowing connections between close badges)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < badgesRef.current.length; i++) {
        const b1 = badgesRef.current[i];
        for (let j = i + 1; j < badgesRef.current.length; j++) {
          const b2 = badgesRef.current[j];
          
          const dx = b1.x - b2.x;
          const dy = b1.y - b2.y;
          const dz = b1.z - b2.z;
          const dist3D = Math.hypot(dx, dy, dz);
          
          if (dist3D < 180) {
            const sx1 = b1.screenX!;
            const sy1 = b1.screenY!;
            const sx2 = b2.screenX!;
            const sy2 = b2.screenY!;
            
            const avgZ = (b1.z + b2.z) / 2;
            const depthAlpha = Math.max(0.08, Math.min(0.5, (fov - avgZ) / (fov * 1.5)));
            const proximityAlpha = (1 - dist3D / 180) * 0.22;
            
            // Vibrant gradient stroke or colored connection
            ctx.strokeStyle = b1.wc.year === 2026 || b2.wc.year === 2026
              ? `rgba(255, 72, 0, ${depthAlpha * proximityAlpha * 1.8})`
              : `rgba(99, 102, 241, ${depthAlpha * proximityAlpha * 0.8})`;
            
            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.stroke();
          }
        }
      }

      // 2. Depth sort (render far away badges first, close ones on top)
      const sorted = [...badgesRef.current].sort((a, b) => b.z - a.z);

      // 3. Render Badges
      sorted.forEach((b) => {
        const sx = b.screenX!;
        const sy = b.screenY!;
        const sr = Math.max(1, b.screenRadius!);

        // Opacity based on depth (fades far into space)
        const alpha = Math.max(0.15, Math.min(1, (fov - b.z) / (fov * 1.3)));

        ctx.save();
        
        // 2026 Special Live Pulse Glow
        if (b.wc.year === 2026) {
          const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.12;
          const glowGrad = ctx.createRadialGradient(sx, sy, sr * 0.8, sx, sy, sr * 2 * pulse);
          glowGrad.addColorStop(0, `rgba(255, 72, 0, ${0.45 * alpha})`);
          glowGrad.addColorStop(1, "rgba(255, 72, 0, 0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 2.2 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw shadow/halo
        const shadowGrad = ctx.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr);
        shadowGrad.addColorStop(0, `rgba(5, 10, 15, ${0.8 * alpha})`);
        shadowGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Main circle badge background
        const bgGrad = ctx.createRadialGradient(sx - sr * 0.3, sy - sr * 0.3, sr * 0.1, sx, sy, sr);
        if (b.wc.year === 2026) {
          bgGrad.addColorStop(0, `rgba(30, 20, 15, ${alpha})`);
          bgGrad.addColorStop(1, `rgba(255, 72, 0, ${alpha})`);
        } else {
          bgGrad.addColorStop(0, `rgba(30, 41, 59, ${alpha})`);
          bgGrad.addColorStop(1, `rgba(15, 23, 42, ${alpha})`);
        }
        ctx.fillStyle = bgGrad;
        ctx.strokeStyle = b.wc.year === 2026 ? `rgba(255, 72, 0, ${alpha * 0.8})` : `rgba(255, 255, 255, ${alpha * 0.25})`;
        ctx.lineWidth = b.wc.year === 2026 ? 3 : 1.5;

        // Hover scale feedback
        if (b.hovered) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          // Draw outer hover ring
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Year text
        ctx.fillStyle = b.wc.year === 2026 ? `rgba(255, 255, 255, ${alpha})` : `rgba(241, 245, 249, ${alpha})`;
        ctx.font = `bold ${Math.round(sr * 0.52)}px "Space Grotesk", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.wc.year.toString(), sx, sy - sr * 0.15);

        // Draw Flag Emoji (winner representation)
        ctx.font = `${Math.round(sr * 0.45)}px sans-serif`;
        ctx.fillText(b.wc.winnerFlag, sx, sy + sr * 0.35);

        // Pulsing Live indicator dot for 2026
        if (b.wc.year === 2026) {
          const dotPulse = Math.sin(Date.now() * 0.008) > 0;
          ctx.fillStyle = dotPulse ? `rgba(255, 72, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx + sr * 0.55, sy - sr * 0.55, sr * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Interactivity handlers for drag & rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging.current) {
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;
      
      // Map mouse drag displacement directly to 3D orbital velocity
      angleY.current = dx * 0.005;
      angleX.current = dy * 0.005;

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      return;
    }

    // Check collision / hover state on badges
    let foundHover: Badge3D | null = null;
    // Iterate from front to back (closest z) so we prioritize foreground badges
    const sortedBadges = [...badgesRef.current].sort((a, b) => a.z - b.z);
    
    badgesRef.current.forEach((b) => (b.hovered = false));

    for (let i = 0; i < sortedBadges.length; i++) {
      const b = sortedBadges[i];
      if (b.screenX && b.screenY && b.screenRadius) {
        const dist = Math.hypot(mx - b.screenX, my - b.screenY);
        if (dist <= b.screenRadius * 1.15) {
          b.hovered = true;
          foundHover = b;
          break; // Stop at first foreground collision
        }
      }
    }

    if (foundHover) {
      setHoveredBadge(foundHover);
      setTooltipPos({ x: mx + 15, y: my + 15 });
    } else {
      setHoveredBadge(null);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    isDragging.current = true;
    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const dx = e.touches[0].clientX - lastMouseX.current;
    const dy = e.touches[0].clientY - lastMouseY.current;

    angleY.current = dx * 0.008;
    angleX.current = dy * 0.008;

    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;
  };

  return (
    <div id="landing-root" className="relative min-h-screen bg-[#050a0f] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#ff4800]/30 selection:text-[#ff4800]">
      {/* 3D Floating Scene Container */}
      <div 
        ref={containerRef}
        className="relative h-[82vh] md:h-[88vh] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block touch-none" />

        {/* Deep ambient blur highlights to elevate vibrance */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#ff4800]/10 to-transparent rounded-full blur-[110px] pointer-events-none animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-[130px] pointer-events-none animate-pulse duration-[8000ms]" />

        {/* Brand Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none z-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BouncingFootball size={42} />
                <div className="absolute -bottom-1 left-1 right-1 h-0.5 bg-orange-500/20 rounded-full blur-[1px] animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ff4800] flex items-center gap-2">
                BELO
                <span className="text-xs bg-[#ff4800] text-white px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase">
                  2026
                </span>
              </span>
            </div>
            <div className="text-xs font-mono tracking-widest text-slate-400 uppercase hidden md:block">
              FIFA World Cup 2026 Match Simulator
            </div>
          </div>

          {/* Core Branding Heading */}
          <div className="max-w-2xl mx-auto text-center mt-[15vh]">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-4">
              THE NEXT CHAMPION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4800] to-orange-400">
                PREDICTED LIVE
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
              Continuous-learning ELO engine trained on <span className="text-white font-medium">49,477 historical internationals</span>.
              Watch the whole tournament update instantly with every score.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 pb-2">
            <span className="text-xs font-mono text-slate-400 tracking-wider">DRAG OR SPIN TO EXPLORE HISTORY</span>
            <ArrowDown className="w-4 h-4 text-[#ff4800] animate-bounce" />
          </div>
        </div>

        {/* Custom 3D Tooltip render */}
        {hoveredBadge && (
          <div 
            className="absolute bg-slate-900/95 border border-slate-800 rounded-lg p-3 shadow-2xl pointer-events-none backdrop-blur-md z-30 transition-all duration-75 flex flex-col gap-1 w-52"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">World Cup {hoveredBadge.wc.year}</span>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: hoveredBadge.wc.winnerColor }} />
            </div>
            <h3 className="text-base font-bold text-white mt-1">Host: {hoveredBadge.wc.host}</h3>
            <div className="h-[1px] bg-slate-800 my-1" />
            <div className="flex items-center gap-2">
              <span className="text-xl">{hoveredBadge.wc.winnerFlag}</span>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Winner</span>
                <span className="text-sm font-bold" style={{ color: hoveredBadge.wc.winnerColor }}>
                  {hoveredBadge.wc.winner}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Section Revealed on Scroll */}
      <div className="relative w-full py-16 px-4 md:px-8 bg-gradient-to-b from-[#050a0f] to-[#020508] border-t border-slate-900 z-20 flex-1">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center text-center">
              <Database className="w-5 h-5 text-[#ff4800] mb-2" />
              <span className="text-2xl font-extrabold font-mono text-white">49,477+</span>
              <span className="text-[10px] uppercase font-mono text-slate-400 mt-1">Match History</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Cpu className="w-5 h-5 text-[#ff4800] mb-2" />
              <span className="text-2xl font-extrabold font-mono text-white">2-Stage</span>
              <span className="text-[10px] uppercase font-mono text-slate-400 mt-1">Architecture</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Flame className="w-5 h-5 text-[#ff4800] mb-2" />
              <span className="text-2xl font-extrabold font-mono text-white">80.5%</span>
              <span className="text-[10px] uppercase font-mono text-slate-400 mt-1">Decisive Acc.</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="w-5 h-5 text-[#ff4800] mb-2" />
              <span className="text-2xl font-extrabold font-mono text-white">Realtime</span>
              <span className="text-[10px] uppercase font-mono text-slate-400 mt-1">ELO Training</span>
            </div>
          </div>

          {/* Narrative description - Funky Asymmetrical Card */}
          <div className="bg-slate-900/40 border-2 border-slate-800 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl p-8 relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4800]/5 rounded-full blur-2xl" />
            
            <div className="flex flex-col gap-8">
              
              {/* Task 3: About Belo - Core Purpose */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#ff4800] animate-pulse" />
                  <span className="text-xs uppercase font-mono font-bold text-[#ff4800] tracking-widest">ABOUT THE PROJECT</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4 text-white font-display">
                  A Living "What-If" Tournament Sandbox
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                  Belo is a highly interactive digital playground designed to put the entire <strong>FIFA World Cup 2026</strong> tournament model directly into your hands. This is not a static webpage or a passive reader. Belo is an active, real-time companion simulator that models the entire tournament journey from the initial group stage kickoffs to the championship trophy lift.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  With Belo, you become the director. You can input customized scorelines, log actual live-game events, or trigger mass AI simulations. The moment you record a match result, the engine dynamically recalibrates: group standings are re-sorted according to official FIFA tiebreaker procedures, 3rd-place qualification grids are updated, and knockout bracket matchups are automatically generated on the fly. 
                </p>
              </div>

              {/* Task 4: Contrasting with Static Predictor */}
              <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs uppercase font-mono font-bold text-indigo-400 tracking-widest">TOURNAMENT CONTINUUM VS. STATIC MODEL</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-3 text-white font-display">
                    How is this different from Static Match Predictions?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                    When you look up a match online, most standard predictors output static percentages (e.g., <em>"Team A: 48% Win Chance, Draw: 27%, Team B: 25%"</em>) for that match in isolation. This is what we call an <strong>isolated island model</strong>. It assumes every game occurs in a vacuum, completely disconnected from what happened before or what lies ahead.
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-4">
                    Belo is entirely different. Instead of analyzing matches in isolation, we model the <strong>Tournament Continuum</strong>:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-3 font-light pl-1">
                    <li className="flex gap-2 items-start">
                      <span className="text-[#ff4800] font-bold text-sm leading-none">•</span>
                      <span><strong>Dynamic Rating Shifts (Continuous Learning):</strong> As matches conclude, Belo immediately computes ELO rating gains and losses for those teams. A team that secures an impressive group stage victory becomes stronger in subsequent simulations, carrying momentum forward just like in real life.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#ff4800] font-bold text-sm leading-none">•</span>
                      <span><strong>Holistic Monte Carlo Projections:</strong> Instead of simple win/loss rates, our tracker runs high-speed parallel tournament trials in the background. It calculates how a team's group placement (1st, 2nd, or a wild-card 3rd) shifts their potential knockout pathway, forecasting their actual probability of advancing to the Finals based on dynamic matchups.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-[#ff4800] font-bold text-sm leading-none">•</span>
                      <span><strong>Knockout Interdependence:</strong> If you simulate an upset in Group A, Belo instantly re-routes the entire bracket. It recalculates who they will meet in the Round of 32 and beyond, demonstrating how a single goal ripples across the entire Road to the Final.</span>
                    </li>
                  </ul>
                </div>

                {/* FIFA Rules sidebar with vibrant asymmetric styling */}
                <div className="w-full md:w-72 bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-[#ff4800]/30 p-6 rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-md rounded-br-md shrink-0">
                  <h3 className="text-xs uppercase font-mono font-black text-[#ff4800] mb-3 tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff4800] animate-ping" />
                    FIFA Annex C Rules
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 font-light">
                    Belo fully executes the official <strong>FIFA 2026 Tournament Regulations</strong>, mapping the precise 12-group matrix. There are no approximations: group tiebreakers (goal difference, goals scored, head-to-head records) and the 8 best 3rd-placed ranking matrices are exactly modeled.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-slate-800 text-[9px] font-mono text-slate-300 rounded font-semibold uppercase">Annex C Compliant</span>
                    <span className="px-2 py-1 bg-slate-800 text-[9px] font-mono text-slate-300 rounded font-semibold uppercase">Monte Carlo</span>
                    <span className="px-2 py-1 bg-slate-800 text-[9px] font-mono text-slate-300 rounded font-semibold uppercase">Continuous ELO</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Launcher action */}
          <div className="flex flex-col items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.06, rotate: -0.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterApp}
              className="px-8 py-4 bg-gradient-to-r from-[#ff4800] to-orange-500 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm text-white font-extrabold tracking-wide uppercase shadow-2xl shadow-[#ff4800]/30 hover:shadow-[#ff4800]/50 transition-all border-2 border-slate-900 cursor-pointer text-sm"
            >
              LAUNCH SIMULATOR APP
            </motion.button>
            <span className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-wider">Created by Advaith R — CSE (AI & ML)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
