/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BracketStage, Match, Team } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, GitFork, ArrowRight, Info, AlertTriangle, Shield, Check, Crosshair, Users, Target } from "lucide-react";
import { runTwoStagePrediction } from "../utils/predictionEngine";

interface RoadToFinalProps {
  bracket: BracketStage;
  teams: Team[];
  favoriteTeamId: string | null;
  onChangeFavoriteTeam: (teamId: string | null) => void;
  mcProbabilities: {
    r32: number;
    r16: number;
    qf: number;
    sf: number;
    final: number;
    champion: number;
  } | null;
  groupMatches: Match[];
}

export default function RoadToFinal({
  bracket,
  teams,
  favoriteTeamId,
  onChangeFavoriteTeam,
  mcProbabilities,
  groupMatches
}: RoadToFinalProps) {
  const [viewMode, setViewMode] = useState<"pathway" | "bracket">("pathway");
  const [highlightTeamId, setHighlightTeamId] = useState<string | null>(null);

  const getTeam = (id: string): Team | undefined => teams.find((t) => t.id === id);

  // Helper to resolve predicted winner of a completed or uncompleted match
  const getWinnerOfMatch = (m?: Match): string => {
    if (!m) return "TBD";
    if (m.completed) {
      if (m.homeScore! > m.awayScore!) return m.homeId;
      if (m.awayScore! > m.homeScore!) return m.awayId;
      if (m.homePenalties && m.awayPenalties) {
        return m.homePenalties > m.awayPenalties ? m.homeId : m.awayId;
      }
      return m.homeId;
    }
    if (m.predictedWinnerId && m.predictedWinnerId !== "TBD" && m.predictedWinnerId !== "DRAW") {
      return m.predictedWinnerId;
    }
    const homeTeam = getTeam(m.homeId);
    const awayTeam = getTeam(m.awayId);
    if (homeTeam && awayTeam) {
      return homeTeam.elo >= awayTeam.elo ? m.homeId : m.awayId;
    }
    return `Winner Match ${m.id}`;
  };

  const getPredictionConfidence = (m: Match): number => {
    if (m.completed) return 1.0;
    const maxProb = Math.max(m.homeWinProbability, m.awayWinProbability);
    return maxProb;
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.65) return { label: "High Confidence", color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    if (confidence >= 0.48) return { label: "Moderate Confidence", color: "text-orange-500 bg-orange-50 border-orange-100" };
    return { label: "Volatile / Coin Flip", color: "text-rose-500 bg-rose-50 border-rose-100" };
  };

  // Render Bracket match nodes for the bracket tab
  const renderMatchNode = (m: Match, stageName: string) => {
    const homeTeam = getTeam(m.homeId);
    const awayTeam = getTeam(m.awayId);
    
    const confidence = getPredictionConfidence(m);
    const isHomePredicted = m.completed 
      ? (m.homeScore! > m.awayScore!) 
      : (m.predictedWinnerId === m.homeId || m.predictedWinnerId === "DRAW");
    
    const predictedWinner = isHomePredicted ? homeTeam : awayTeam;
    const isHighlighted = highlightTeamId && (m.homeId === highlightTeamId || m.awayId === highlightTeamId);

    return (
      <motion.div
        key={m.id}
        whileHover={{ y: -3, scale: 1.02 }}
        onClick={() => setHighlightTeamId(highlightTeamId === predictedWinner?.id ? null : predictedWinner?.id || null)}
        className={`relative flex flex-col p-3 bg-white border-2 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm cursor-pointer select-none transition-all duration-200 min-w-[210px] w-[210px] ${isHighlighted ? "border-[#ff4800] shadow-[3px_3px_0px_0px_rgba(255,72,0,1)] bg-orange-50/10" : "border-slate-800 shadow-[3px_3px_0px_0px_rgba(30,41,59,0.9)] hover:shadow-[5px_5px_0px_0px_rgba(255,72,0,1)] hover:border-slate-900"}`}
      >
        <div className="flex items-center justify-between text-[8px] font-mono font-bold text-slate-400 mb-2 uppercase">
          <span>Match {m.id}</span>
          <span>{stageName}</span>
        </div>

        <div className="flex flex-col gap-1.5 mb-2.5">
          <div className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded-md ${homeTeam && isHomePredicted ? "bg-slate-50 font-bold" : "text-slate-500 font-light"}`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm flex-shrink-0">{homeTeam?.flag || "🏳️"}</span>
              <span className="truncate">{homeTeam?.name || m.homePlaceholder || m.homeId || "TBD"}</span>
            </div>
            {m.completed && m.homeScore !== null && (
              <span className="font-mono font-bold">{m.homeScore}</span>
            )}
          </div>

          <div className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded-md ${awayTeam && !isHomePredicted ? "bg-slate-50 font-bold" : "text-slate-500 font-light"}`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm flex-shrink-0">{awayTeam?.flag || "🏳️"}</span>
              <span className="truncate">{awayTeam?.name || m.awayPlaceholder || m.awayId || "TBD"}</span>
            </div>
            {m.completed && m.awayScore !== null && (
              <span className="font-mono font-bold">{m.awayScore}</span>
            )}
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 my-1.5" />

        {predictedWinner ? (
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[9px] font-sans font-medium text-slate-400 leading-none">
              Predicted Winner
            </span>
            <span className="text-[9px] font-mono font-extrabold text-slate-900 leading-none">
              {predictedWinner.id} ({Math.round(confidence * 100)}%)
            </span>
          </div>
        ) : (
          <span className="text-[9px] font-sans text-slate-400 italic">Waiting on qualifiers...</span>
        )}

        {isHighlighted && predictedWinner && (
          <span 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
            style={{ backgroundColor: predictedWinner.color || "#ff4800" }}
          />
        )}
      </motion.div>
    );
  };

  // Helper to calculate knockout win probability
  const getKnockoutWinProbability = (favTeam: Team, oppTeam: Team): number => {
    const pred = runTwoStagePrediction(favTeam, oppTeam, true);
    const total = pred.homeWin + pred.awayWin;
    if (total <= 0) return 0.5;
    return pred.homeWin / total;
  };

  // Compute Favorite Team's Knockout Roadmap
  const getFavoriteKnockoutPath = () => {
    if (!favoriteTeamId) return { isCurrentlyPredictedInR32: false, steps: [] };

    const favTeam = teams.find(t => t.id === favoriteTeamId);
    if (!favTeam) return { isCurrentlyPredictedInR32: false, steps: [] };

    // Find R32 match
    let r32Match = bracket.R32.find(m => m.homeId === favoriteTeamId || m.awayId === favoriteTeamId);
    let r32Id = 73;
    let isCurrentlyPredictedInR32 = true;

    if (r32Match) {
      r32Id = r32Match.id;
    } else {
      isCurrentlyPredictedInR32 = false;
      const groupToR32: Record<string, number> = {
        A: 73, B: 74, C: 75, D: 76, E: 77, F: 78, G: 79, H: 80, I: 81, J: 82, K: 83, L: 84
      };
      r32Id = groupToR32[favTeam.group] || 73;
    }

    // Trace path through stages
    // 1. R32
    // 2. R16
    let r16Id = 89;
    let parentR32Id = 74;
    if (r32Id === 73 || r32Id === 74) { r16Id = 89; parentR32Id = r32Id === 73 ? 74 : 73; }
    else if (r32Id === 75 || r32Id === 76) { r16Id = 90; parentR32Id = r32Id === 75 ? 76 : 75; }
    else if (r32Id === 77 || r32Id === 78) { r16Id = 91; parentR32Id = r32Id === 77 ? 78 : 77; }
    else if (r32Id === 79 || r32Id === 80) { r16Id = 92; parentR32Id = r32Id === 79 ? 80 : 79; }
    else if (r32Id === 81 || r32Id === 82) { r16Id = 93; parentR32Id = r32Id === 81 ? 82 : 81; }
    else if (r32Id === 83 || r32Id === 84) { r16Id = 94; parentR32Id = r32Id === 83 ? 84 : 83; }
    else if (r32Id === 85 || r32Id === 86) { r16Id = 95; parentR32Id = r32Id === 85 ? 86 : 85; }
    else if (r32Id === 87 || r32Id === 88) { r16Id = 96; parentR32Id = r32Id === 87 ? 88 : 87; }

    // 3. QF
    let qfId = 97;
    let parentR16Id = 90;
    if (r16Id === 89 || r16Id === 90) { qfId = 97; parentR16Id = r16Id === 89 ? 90 : 89; }
    else if (r16Id === 91 || r16Id === 92) { qfId = 98; parentR16Id = r16Id === 91 ? 92 : 91; }
    else if (r16Id === 93 || r16Id === 94) { qfId = 99; parentR16Id = r16Id === 93 ? 94 : 93; }
    else if (r16Id === 95 || r16Id === 96) { qfId = 100; parentR16Id = r16Id === 95 ? 96 : 95; }

    // 4. SF
    let sfId = 101;
    let parentQfId = 98;
    if (qfId === 97 || qfId === 98) { sfId = 101; parentQfId = qfId === 97 ? 98 : 97; }
    else if (qfId === 99 || qfId === 100) { sfId = 102; parentQfId = qfId === 99 ? 100 : 99; }

    // 5. Final
    const finalId = 104;
    const parentSfId = sfId === 101 ? 102 : 101;

    // Resolve details for each of the 5 knockout steps
    const steps = [
      {
        stageName: "Round of 32",
        matchId: r32Id,
        getOpponent: (): Team | string => {
          const matchObj = bracket.R32.find(m => m.id === r32Id);
          if (!matchObj) return "TBH";
          if (matchObj.homeId === favoriteTeamId) return getTeam(matchObj.awayId) || matchObj.awayPlaceholder || matchObj.awayId || "TBH";
          if (matchObj.awayId === favoriteTeamId) return getTeam(matchObj.homeId) || matchObj.homePlaceholder || matchObj.homeId || "TBH";
          // If favorite team is not in this slot in simulation, use simulated opponent
          return getTeam(matchObj.awayId) || matchObj.awayPlaceholder || matchObj.awayId || "TBH";
        }
      },
      {
        stageName: "Round of 16",
        matchId: r16Id,
        getOpponent: (): Team | string => {
          const parentMatch = bracket.R32.find(m => m.id === parentR32Id);
          if (!parentMatch) return "TBH";
          const winnerId = getWinnerOfMatch(parentMatch);
          return getTeam(winnerId) || winnerId || "TBH";
        }
      },
      {
        stageName: "Quarterfinals",
        matchId: qfId,
        getOpponent: (): Team | string => {
          const parentMatch = bracket.R16.find(m => m.id === parentR16Id);
          if (!parentMatch) return "TBH";
          const winnerId = getWinnerOfMatch(parentMatch);
          return getTeam(winnerId) || winnerId || "TBH";
        }
      },
      {
        stageName: "Semifinals",
        matchId: sfId,
        getOpponent: (): Team | string => {
          const parentMatch = bracket.QF.find(m => m.id === parentQfId);
          if (!parentMatch) return "TBH";
          const winnerId = getWinnerOfMatch(parentMatch);
          return getTeam(winnerId) || winnerId || "TBH";
        }
      },
      {
        stageName: "World Cup Final",
        matchId: finalId,
        getOpponent: (): Team | string => {
          const parentMatch = bracket.SF.find(m => m.id === parentSfId);
          if (!parentMatch) return "TBH";
          const winnerId = getWinnerOfMatch(parentMatch);
          return getTeam(winnerId) || winnerId || "TBH";
        }
      }
    ];

    return {
      isCurrentlyPredictedInR32,
      steps: steps.map((s) => {
        const opp = s.getOpponent();
        let oppName = "TBH";
        let oppFlag = "🏳️";
        let oppElo = 0;
        let oppColor = "#cbd5e1";
        let isRealTeam = false;
        let oppObj: Team | null = null;

        if (typeof opp === "object") {
          oppObj = opp;
          oppName = opp.name;
          oppFlag = opp.flag;
          oppElo = opp.elo;
          oppColor = opp.color || "#cbd5e1";
          isRealTeam = true;
        } else {
          oppName = opp;
        }

        // Calculate specific win probability
        let prob = 0.5;
        if (isRealTeam && oppObj) {
          prob = getKnockoutWinProbability(favTeam, oppObj);
        } else {
          // fallback based on average elos
          prob = 1 / (1 + Math.pow(10, -(favTeam.elo - 1550) / 400));
        }

        return {
          stageName: s.stageName,
          matchId: s.matchId,
          oppName,
          oppFlag,
          oppElo,
          oppColor,
          isRealOpponent: isRealTeam,
          winProbability: prob
        };
      })
    };
  };

  const finalMatchObj = bracket.final[0];
  let championId = "TBD";
  if (finalMatchObj) {
    championId = getWinnerOfMatch(finalMatchObj);
  }
  const championTeam = getTeam(championId);

  return (
    <div id="road-to-final-root" className="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 pb-12">
      
      {/* Selection / Prompt Panel if no favorite team is selected */}
      <AnimatePresence mode="wait">
        {!favoriteTeamId ? (
          <motion.div
            key="team-select-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-center"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#ff4800]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-xl mx-auto relative z-10 flex flex-col items-center">
              <Trophy className="w-14 h-14 text-yellow-500 mb-4 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 uppercase font-sans">
                Predict Your Team's Road to Glory
              </h2>
              <p className="text-slate-400 font-light text-xs sm:text-sm leading-relaxed mb-8">
                Belo calculates ELO-calibrated match-by-match survival odds for your favorite team. Pick a team below to project their custom pathway to the 2026 World Cup Final.
              </p>

              {/* Grid of All Teams */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-h-[350px] overflow-y-auto pr-2 scrollbar-thin border border-slate-800/80 bg-slate-950/50 p-4 rounded-xl">
                {[...teams].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onChangeFavoriteTeam(t.id)}
                    className="flex items-center gap-2.5 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 rounded-lg text-left text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    <span className="text-xl filter drop-shadow-sm shrink-0">{t.flag}</span>
                    <span className="truncate leading-tight">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="road-to-final-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Header / Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <Shield className="w-6 h-6 text-[#ff4800]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTeam(favoriteTeamId)?.flag}</span>
                    <h3 className="text-lg font-black text-slate-900 leading-none">{getTeam(favoriteTeamId)?.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Championship Odds Profile • ELO: <strong>{Math.round(getTeam(favoriteTeamId)?.elo || 0)}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChangeFavoriteTeam(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Change Favorite Team
                </button>
              </div>
            </div>

            {/* View Toggle Bar */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 self-start">
              <button
                onClick={() => setViewMode("pathway")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${viewMode === "pathway" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                Favorite Team Pathway
              </button>
              <button
                onClick={() => setViewMode("bracket")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${viewMode === "bracket" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
              >
                <GitFork className="w-3.5 h-3.5 rotate-90" />
                Full Bracket Flowchart
              </button>
            </div>

            {/* Core Views */}
            {viewMode === "pathway" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Overall Glory Odds and Stats */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  {/* Glory card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-xl flex flex-col justify-between h-56">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Trophy className="w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest font-black">Championship Glory Probability</span>
                      </div>
                      <h4 className="text-4xl font-extrabold font-mono text-white mt-4 tracking-tighter">
                        {mcProbabilities?.champion || 0}%
                      </h4>
                      <p className="text-[10px] text-slate-400 font-light mt-1.5 leading-relaxed">
                        Continuous 300-run Monte Carlo probability of {getTeam(favoriteTeamId)?.name} overcoming every hurdle to win the Final.
                      </p>
                    </div>

                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" 
                        style={{ width: `${mcProbabilities?.champion || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage matrix card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#ff4800]" />
                      Survival Benchmarks
                    </h4>
                    
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Reach Round of 32", value: mcProbabilities?.r32 || 0 },
                        { label: "Reach Round of 16", value: mcProbabilities?.r16 || 0 },
                        { label: "Reach Quarterfinals", value: mcProbabilities?.qf || 0 },
                        { label: "Reach Semifinals", value: mcProbabilities?.sf || 0 },
                        { label: "Reach Grand Finals", value: mcProbabilities?.final || 0 }
                      ].map((bench, bIdx) => (
                        <div key={bIdx} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>{bench.label}</span>
                            <span className="font-mono font-bold text-slate-900">{bench.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-800 rounded-full" style={{ width: `${bench.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Path Timeline */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                      <Crosshair className="w-5 h-5 text-[#ff4800]" />
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Required Pathway to the Trophy</h4>
                        <p className="text-[10px] text-slate-500 font-light mt-0.5">Every hurdle that {getTeam(favoriteTeamId)?.name} must clear to secure victory.</p>
                      </div>
                    </div>

                    {/* Timeline items */}
                    <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-slate-100 ml-4">
                      
                      {/* Group Stage remaining card */}
                      {(() => {
                        const favTeam = getTeam(favoriteTeamId);
                        if (!favTeam) return null;
                        
                        // Find group matches for this team
                        const matchesOfTeam = groupMatches.filter(m => m.homeId === favoriteTeamId || m.awayId === favoriteTeamId);
                        const completedMatches = matchesOfTeam.filter(m => m.completed);
                        const uncompletedMatches = matchesOfTeam.filter(m => !m.completed);

                        return (
                          <div className="relative">
                            {/* timeline dot */}
                            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                              G
                            </span>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">
                                  Group Stage • Group {favTeam.group}
                                </span>
                                {uncompletedMatches.length === 0 ? (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-mono font-bold rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Group Cleared
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-mono font-bold rounded-full">
                                    {uncompletedMatches.length} matches remaining
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-light">
                                To advance, {favTeam.name} must finish in the Top 2 of Group {favTeam.group} (or as one of the 8 best 3rd placed teams).
                              </p>

                              {/* Render group matches */}
                              <div className="flex flex-col gap-2.5">
                                {matchesOfTeam.map((gm) => {
                                  const oppId = gm.homeId === favoriteTeamId ? gm.awayId : gm.homeId;
                                  const oppTeamObj = getTeam(oppId);
                                  const isHome = gm.homeId === favoriteTeamId;
                                  const ourWinProb = isHome ? gm.homeWinProbability : gm.awayWinProbability;

                                  return (
                                    <div key={gm.id} className="bg-white border border-slate-200/80 p-2.5 rounded-lg flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">{oppTeamObj?.flag || "🏳️"}</span>
                                        <span className="font-bold text-slate-800">{oppTeamObj?.name || "TBD"}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">(ELO {oppTeamObj?.elo})</span>
                                      </div>

                                      <div>
                                        {gm.completed ? (
                                          <span className="font-mono font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                            {gm.homeScore} – {gm.awayScore}
                                          </span>
                                        ) : (
                                          <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[10px] font-mono font-bold text-[#ff4800]">
                                              Win Odds: {Math.round(ourWinProb * 100)}%
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-mono">Draw: {Math.round(gm.drawProbability * 100)}%</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Knockout timeline steps */}
                      {getFavoriteKnockoutPath().steps.map((step, idx) => {
                        const pathData = getFavoriteKnockoutPath();
                        const warningMsg = !pathData.isCurrentlyPredictedInR32 && idx === 0;

                        return (
                          <div key={idx} className="relative">
                            {/* timeline dot */}
                            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center text-white text-[8px] font-black">
                              {idx + 1}
                            </span>

                            <div className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-xl p-4 shadow-xs">
                              
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider">
                                  {step.stageName} • Match {step.matchId}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono font-bold rounded-full">
                                  Knockout
                                </span>
                              </div>

                              {warningMsg && (
                                <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200/50 rounded-lg text-[10px] text-amber-700 font-light leading-relaxed">
                                  ⚠️ <strong>Hypothetical Scenario:</strong> {getTeam(favoriteTeamId)?.name} is not currently projected to advance in the simulated bracket. This path represents the outcome if they qualify in their group's top seed.
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">Opponent / Potential Opponent</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl">{step.oppFlag}</span>
                                    <span className="text-sm font-bold text-slate-950">{step.oppName}</span>
                                    {step.oppElo > 0 && (
                                      <span className="text-[10px] text-slate-400 font-mono font-medium">(ELO {step.oppElo})</span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">Win Probability</span>
                                  <span className="text-lg font-black font-mono text-emerald-600">
                                    {Math.round(step.winProbability * 100)}%
                                  </span>
                                </div>
                              </div>

                              {/* Small mini-tri progress bar */}
                              <div className="mt-3.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${step.winProbability * 100}%` }}
                                />
                                <div 
                                  className="h-full bg-slate-200" 
                                  style={{ width: `${(1 - step.winProbability) * 100}%` }}
                                />
                              </div>

                            </div>
                          </div>
                        );
                      })}

                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Original Flowchart bracket rendering */
              <div className="flex flex-col gap-8">
                {/* Intro info card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <GitFork className="w-5 h-5 text-[#ff4800] rotate-90" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">The Live Roadmap Flowchart</h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mt-0.5">
                        Organic mindmap mapping paths to the final. Click on a predicted node to highlight their path across the diagram.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200/60 rounded-md py-1 px-2 text-[10px] text-slate-500 font-mono">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    <span>Updates automatically as match inputs change ELO scores.</span>
                  </div>
                </div>

                {/* Horizontal Flow Container */}
                <div className="relative w-full overflow-x-auto pb-8 pt-4 cursor-grab active:cursor-grabbing scrollbar-thin">
                  <div className="flex items-start gap-12 min-w-[1300px] relative px-4">
                    
                    {/* Stage 1: Round of 32 */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2 mb-2">
                        Round of 32
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                          {bracket.R32.slice(0, 8).map((m) => renderMatchNode(m, "R32"))}
                        </div>
                        <div className="flex flex-col gap-4">
                          {bracket.R32.slice(8, 16).map((m) => renderMatchNode(m, "R32"))}
                        </div>
                      </div>
                    </div>

                    {/* Spacer connector */}
                    <div className="flex flex-col justify-center h-full pt-10 self-center">
                      <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse" />
                    </div>

                    {/* Stage 2: Round of 16 */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2 mb-2">
                        Round of 16
                      </h4>
                      <div className="flex flex-col gap-5 justify-around h-full py-1">
                        {bracket.R16.map((m) => renderMatchNode(m, "R16"))}
                      </div>
                    </div>

                    {/* Spacer connector */}
                    <div className="flex flex-col justify-center h-full pt-10 self-center">
                      <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse" />
                    </div>

                    {/* Stage 3: Quarterfinals */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2 mb-2">
                        Quarterfinals
                      </h4>
                      <div className="flex flex-col gap-12 justify-around h-full py-6">
                        {bracket.QF.map((m) => renderMatchNode(m, "QF"))}
                      </div>
                    </div>

                    {/* Spacer connector */}
                    <div className="flex flex-col justify-center h-full pt-10 self-center">
                      <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse" />
                    </div>

                    {/* Stage 4: Semifinals */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2 mb-2">
                        Semifinals
                      </h4>
                      <div className="flex flex-col gap-32 justify-around h-full py-16">
                        {bracket.SF.map((m) => renderMatchNode(m, "SF"))}
                      </div>
                    </div>

                    {/* Spacer connector */}
                    <div className="flex flex-col justify-center h-full pt-10 self-center">
                      <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse" />
                    </div>

                    {/* Stage 5: Grand Final */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-2 mb-2">
                        The Grand Final
                      </h4>
                      <div className="flex flex-col items-center justify-center h-full gap-8 py-20">
                        
                        {renderMatchNode(bracket.final[0], "Final")}

                        {championTeam ? (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white rounded-2xl shadow-xl w-64 border border-yellow-400 relative overflow-hidden"
                          >
                            <Trophy className="w-12 h-12 text-yellow-200 mb-2 drop-shadow-md animate-bounce" />
                            <span className="text-[10px] font-mono tracking-widest uppercase text-yellow-100 leading-none mb-1">
                              Predicted Champion
                            </span>
                            <span className="text-4xl select-none mb-1 leading-none">{championTeam.flag}</span>
                            <h3 className="text-xl font-black font-sans leading-tight mt-1">{championTeam.name}</h3>
                            <span className="text-[10px] font-mono font-bold bg-amber-700/50 rounded-full px-3 py-1 mt-3">
                              ELO: {Math.round(championTeam.elo)}
                            </span>
                          </motion.div>
                        ) : (
                          <div className="w-64 p-6 bg-slate-100 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-xs italic">
                            Resolving remaining nodes to project a champion...
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                </div>

                {/* Under-bracket disclaimer info */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex gap-3 max-w-2xl mx-auto">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 leading-relaxed font-light">
                    <strong>A Note on Combined Probability:</strong> In cup football, the overall probability of any specific bracket tree resolving perfectly is extremely low (a joint sequence of 15 matches at 70% confidence each has a combined probability of less than 1%). Belo's mindmap displays the single most probable trajectory based on sequential maximum-likelihood outcomes.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
