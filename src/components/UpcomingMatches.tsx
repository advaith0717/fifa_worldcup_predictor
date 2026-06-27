/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BracketStage, Match, Team } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Play, RotateCcw, AlertCircle, Check, Loader2, X, Info, Trophy, Shield, Users } from "lucide-react";

interface UpcomingMatchesProps {
  matches: Match[];
  teams: Team[];
  bracket: BracketStage;
  onUpdateScore: (matchId: number, homeScore: number, awayScore: number, homePens?: number | null, awayPens?: number | null) => void;
  onSimulateRemaining: () => void;
  onReset: () => void;
  onSyncLiveResults: () => void;
  favoriteTeamId: string | null;
  onChangeFavoriteTeam: (teamId: string | null) => void;
  mcProbabilities: { r32: number; r16: number; qf: number; sf: number; final: number; champion: number; } | null;
}

type StageFilter = "all" | "group" | "ko";

export default function UpcomingMatches({
  matches,
  teams,
  bracket,
  onUpdateScore,
  onSimulateRemaining,
  onReset,
  onSyncLiveResults,
  favoriteTeamId,
  onChangeFavoriteTeam,
  mcProbabilities
}: UpcomingMatchesProps) {
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // Automatically show completed matches if there are no uncompleted matches left
  useEffect(() => {
    const hasUncompleted = matches.some((m) => !m.completed);
    if (!hasUncompleted) {
      setShowCompleted(true);
    }
  }, [matches]);
  
  // Scoring state
  const [activeScoringMatchId, setActiveScoringMatchId] = useState<number | null>(null);
  const [homeInput, setHomeInput] = useState<string>("");
  const [awayInput, setAwayInput] = useState<string>("");
  const [homePensInput, setHomePensInput] = useState<string>("");
  const [awayPensInput, setAwayPensInput] = useState<string>("");

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  // Helper to fetch full team object
  const getTeam = (id: string): Team | undefined => teams.find((t) => t.id === id);

  const getPredictionDeviationReason = (m: Match, homeTeam?: Team, awayTeam?: Team): string | null => {
    if (!homeTeam || !awayTeam || !m.completed) return null;
    
    const actualWinnerId = m.homeScore! > m.awayScore! 
      ? m.homeId 
      : m.awayScore! > m.homeScore! 
        ? m.awayId 
        : "DRAW";
        
    if (actualWinnerId === m.predictedWinnerId) return null;

    const predictedWinnerName = m.predictedWinnerId === "DRAW" 
      ? "a Draw" 
      : (m.predictedWinnerId === m.homeId ? homeTeam.name : awayTeam.name);
      
    if (actualWinnerId === "DRAW") {
      return `Upset Warning / Draw Factor: Belo predicted a decisive win for ${predictedWinnerName}, but a stubborn defensive low-block and below-average finishing efficiency led to a stalemate. Single matches in cup football are highly prone to high-variance tactical stalemates.`;
    }
    
    const winnerTeam = actualWinnerId === m.homeId ? homeTeam : awayTeam;
    const loserTeam = actualWinnerId === m.homeId ? awayTeam : homeTeam;
    
    if (winnerTeam.elo < loserTeam.elo) {
      return `Tactical Upset / Underdog Factor: ${winnerTeam.name} (ELO ${Math.round(winnerTeam.elo)}) were ELO underdogs against ${loserTeam.name} (ELO ${Math.round(loserTeam.elo)}), but peak team chemistry (${(winnerTeam.form * 100).toFixed(0)}% form index) or late-game execution (${(winnerTeam.lateGoalRate * 100).toFixed(0)}% late-game surge) nullified the ELO gap.`;
    }
    
    return `Model Variance: The outcome deviated from the initial prediction due to live tactical setups or dynamic international tournament variance.`;
  };

  // Filtered matches
  const filteredMatches = matches.filter((m) => {
    // Stage Filter
    if (stageFilter === "group") {
      if (m.stage !== "group") return false;
      if (selectedGroup !== "all" && m.groupLetter !== selectedGroup) return false;
    } else if (stageFilter === "ko") {
      if (m.stage === "group") return false;
    }

    // Completed Filter - if showCompleted is false, we pop them out of the schedule
    if (!showCompleted && m.completed) {
      return false;
    }

    return true;
  });

  const handleOpenScorePanel = (m: Match) => {
    setActiveScoringMatchId(m.id);
    setHomeInput(m.homeScore !== null ? m.homeScore.toString() : "0");
    setAwayInput(m.awayScore !== null ? m.awayScore.toString() : "0");
    setHomePensInput(m.homePenalties !== null && m.homePenalties !== undefined ? m.homePenalties.toString() : "");
    setAwayPensInput(m.awayPenalties !== null && m.awayPenalties !== undefined ? m.awayPenalties.toString() : "");
  };

  const handleSaveScore = (m: Match) => {
    const hs = parseInt(homeInput, 10);
    const as = parseInt(awayInput, 10);
    
    if (isNaN(hs) || isNaN(as)) return;

    let hp: number | null = null;
    let ap: number | null = null;

    // Check penalty shootout conditions for knockouts
    if (m.stage !== "group" && hs === as) {
      hp = parseInt(homePensInput, 10);
      ap = parseInt(awayPensInput, 10);
      if (isNaN(hp) || isNaN(ap) || hp === ap) {
        // Force inputs
        alert("Knockout matches cannot end in a draw! Please specify a penalty shootout winner.");
        return;
      }
    }

    onUpdateScore(m.id, hs, as, hp, ap);
    setActiveScoringMatchId(null);
  };

  // Human-friendly stage name
  const getStageName = (m: Match) => {
    if (m.stage === "group") return `Group ${m.groupLetter} • Match ${m.id}`;
    if (m.stage === "R32") return `Round of 32 • Match ${m.id}`;
    if (m.stage === "R16") return `Round of 16 • Match ${m.id}`;
    if (m.stage === "QF") return `Quarterfinal • Match ${m.id}`;
    if (m.stage === "SF") return `Semifinal • Match ${m.id}`;
    if (m.stage === "third") return "3rd Place Playoff";
    return "The Grand Final";
  };

  const formatMatchDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mName = months[parseInt(month, 10) - 1];
    return `${mName} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <div id="matches-root" className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4">
      
      {/* Favorite Team & Monte Carlo Championship Probability Tracker */}
      <div className="bg-slate-900 text-white border-2 border-[#ff4800]/50 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#ff4800]/20 to-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#ff4800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-[#ff4800]" />
              <h3 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ff4800]/90 uppercase font-mono">
                CHAMPIONSHIP PROBABILITY TRACKER
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-light max-w-xl">
              Select your favorite team to run a 300-run **Monte Carlo simulation** in real-time. This projects their statistical probability to advance through each stage of the 2026 World Cup.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[240px]">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Select Favorite Team:</label>
            <select
              value={favoriteTeamId || ""}
              onChange={(e) => onChangeFavoriteTeam(e.target.value || null)}
              className="bg-slate-800/90 border border-slate-700/80 rounded-xl py-2 px-3 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#ff4800] transition-all cursor-pointer"
            >
              <option value="" className="bg-slate-900 font-normal text-slate-400">-- Choose Team --</option>
              {[...teams].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 font-bold text-white">
                  {t.flag} {t.name} (ELO: {t.elo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {favoriteTeamId && mcProbabilities ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col lg:flex-row gap-6 relative z-10"
          >
            {/* Detailed Team Card */}
            {(() => {
              const favTeam = teams.find(t => t.id === favoriteTeamId);
              if (!favTeam) return null;
              return (
                <div 
                  className="w-full lg:w-72 bg-slate-950/80 border-2 border-slate-800 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg p-5 flex flex-col justify-between relative overflow-hidden shrink-0"
                  style={{ borderLeft: `4px solid ${favTeam.color || '#ff4800'}` }}
                >
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: favTeam.color || '#ff4800' }} />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl filter drop-shadow">{favTeam.flag}</span>
                      <div>
                        <h4 className="text-lg font-black text-white leading-tight">{favTeam.name}</h4>
                        <span className="text-[10px] font-mono uppercase text-slate-400">Group {favTeam.group} • {favTeam.id}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-800/60">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Current ELO</span>
                        <span className="text-base font-extrabold font-mono text-white">{favTeam.elo}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Form Rating</span>
                        <span className="text-base font-extrabold font-mono text-emerald-400">{(favTeam.form * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Avg Scored</span>
                        <span className="text-xs font-bold font-mono text-slate-300">{favTeam.goalsScoredAvg.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Avg Conceded</span>
                        <span className="text-xs font-bold font-mono text-slate-300">{favTeam.goalsConcededAvg.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Recent Streak:</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${favTeam.streak > 0 ? 'bg-emerald-500/15 text-emerald-400' : favTeam.streak < 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                      {favTeam.streak > 0 ? `+${favTeam.streak} W` : favTeam.streak < 0 ? `${favTeam.streak} L` : 'Draw'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Monte Carlo Projections Grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Round of 32", key: "r32", color: "from-blue-500 to-indigo-500" },
                { label: "Round of 16", key: "r16", color: "from-indigo-500 to-purple-500" },
                { label: "Quarterfinals", key: "qf", color: "from-purple-500 to-pink-500" },
                { label: "Semifinals", key: "sf", color: "from-pink-500 to-rose-500" },
                { label: "Reach Finals", key: "final", color: "from-rose-500 to-[#ff4800]" },
                { label: "World Champion", key: "champion", color: "from-[#ff4800] to-yellow-500" }
              ].map((stage, sIdx) => {
                const val = mcProbabilities[stage.key as keyof typeof mcProbabilities] ?? 0;
                return (
                  <div
                    key={stage.key}
                    className="bg-slate-800/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/50 transition-all shadow-xs group"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                      {stage.label}
                    </span>
                    
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono tracking-tighter text-white">
                        {val}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">%</span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, delay: sIdx * 0.05 }}
                        className={`h-full bg-gradient-to-r ${stage.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 border border-slate-800/50 border-dashed rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
            No team selected. Pick a team from the selector above to project their path to glory.
          </div>
        )}
      </div>

      {/* Tournament Schedule Stats & Stage Forecast Card */}
      {(() => {
        const groupOnOrAfterJune25 = matches.filter(m => m.stage === "group");
        const remainingGroupStageCount = groupOnOrAfterJune25.filter(m => !m.completed).length;
        const totalGroupStageOnOrAfterJune25Count = groupOnOrAfterJune25.length;

        const remainingR32Count = bracket.R32.filter(m => !m.completed).length;
        const remainingR16Count = bracket.R16.filter(m => !m.completed).length;

        const predictedR32TeamIds = Array.from(new Set(
          bracket.R32.flatMap(m => [m.homeId, m.awayId])
        )).filter(id => id && id !== "TBD" && !id.includes("Group") && !id.includes("3rd"));
        const predictedR32Teams = predictedR32TeamIds.map(id => teams.find(t => t.id === id)).filter(Boolean) as Team[];

        const predictedR16TeamIds = Array.from(new Set(
          bracket.R16.flatMap(m => [m.homeId, m.awayId])
        )).filter(id => id && id !== "TBD" && !id.includes("Winner") && !id.includes("Match"));
        const predictedR16Teams = predictedR16TeamIds.map(id => teams.find(t => t.id === id)).filter(Boolean) as Team[];

        const topPredictedTeams = [...teams].sort((a, b) => b.elo - a.elo).slice(0, 8);

        return (
          <div className="bg-white border-2 border-slate-900 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg p-6 shadow-[5px_5px_0px_0px_rgba(30,41,59,0.9)] hover:shadow-[7px_7px_0px_0px_rgba(30,41,59,1)] transition-all flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info className="w-5 h-5 text-[#ff4800]" />
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Tournament Schedule & Stage Forecast</h3>
                <p className="text-[10px] text-slate-500 font-light mt-0.5">Statistical forecast of the remaining matches and qualification pathways from June 27, 2026.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">Group Stage Matches</span>
                  <span className="text-2xl font-black font-mono text-slate-900 block mt-1.5">{remainingGroupStageCount} <span className="text-xs text-slate-400 font-normal">/ {totalGroupStageOnOrAfterJune25Count} Remaining</span></span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-light">Total remaining group stage matches scheduled from June 27 onwards.</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">Round of 32 Matches</span>
                  <span className="text-2xl font-black font-mono text-slate-900 block mt-1.5">{remainingR32Count} <span className="text-xs text-slate-400 font-normal">/ 16 Remaining</span></span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-light">16 high-stakes single-elimination knockout matches.</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">Round of 16 Matches</span>
                  <span className="text-2xl font-black font-mono text-slate-900 block mt-1.5">{remainingR16Count} <span className="text-xs text-slate-400 font-normal">/ 8 Remaining</span></span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-light">8 matches to decide the quarterfinal contenders.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  Projected R32 Teams ({predictedR32Teams.length})
                </span>
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-[160px] overflow-y-auto flex flex-wrap gap-1.5 scrollbar-thin">
                  {predictedR32Teams.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">No teams predicted yet</span>
                  ) : (
                    predictedR32Teams.map(t => (
                      <span key={t.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200/60 rounded text-[10px] font-semibold text-slate-800 shadow-3xs">
                        <span>{t.flag}</span>
                        <span>{t.name}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-purple-500" />
                  Projected R16 Teams ({predictedR16Teams.length})
                </span>
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-[160px] overflow-y-auto flex flex-wrap gap-1.5 scrollbar-thin">
                  {predictedR16Teams.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">No teams predicted yet</span>
                  ) : (
                    predictedR16Teams.map(t => (
                      <span key={t.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200/60 rounded text-[10px] font-semibold text-slate-800 shadow-3xs">
                        <span>{t.flag}</span>
                        <span>{t.name}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#ff4800]" />
                  Most Predicted / Favorites (Top ELO)
                </span>
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-[160px] overflow-y-auto flex flex-wrap gap-1.5 scrollbar-thin">
                  {topPredictedTeams.map(t => (
                    <span key={t.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200/60 rounded text-[10px] font-semibold text-slate-800 shadow-3xs">
                      <span>{t.flag}</span>
                      <span>{t.name}</span>
                      <span className="text-[8px] text-slate-400 font-mono">({Math.round(t.elo)})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Simulation Cockpit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-slate-900 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg p-6 shadow-[5px_5px_0px_0px_rgba(255,72,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(255,72,0,1)] transition-all">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#ff4800]" />
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans leading-tight">Interactive Prediction Sandbox</h3>
            <p className="text-xs text-slate-500 font-light mt-0.5">Edit real-time results or let the Two-Stage AI execute remaining predictions.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onSyncLiveResults}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer border border-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff4800] fill-none" />
            Sync Today's Data
          </button>
          <button
            onClick={onSimulateRemaining}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#ff4800] text-white hover:bg-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-orange-200 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Simulate Remaining (AI)
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Stage selection & Completed toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-slate-900 border-2 border-slate-900 p-1 rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm w-full sm:w-auto shadow-[3px_3px_0px_0px_rgba(255,72,0,1)]">
            <button
              onClick={() => { setStageFilter("all"); setSelectedGroup("all"); }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-tr-md rounded-bl-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${stageFilter === "all" ? "bg-[#ff4800] text-white shadow-sm font-black" : "text-slate-400 hover:text-white"}`}
            >
              All Matches
            </button>
            <button
              onClick={() => setStageFilter("group")}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-tr-md rounded-bl-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${stageFilter === "group" ? "bg-[#ff4800] text-white shadow-sm font-black" : "text-slate-400 hover:text-white"}`}
            >
              Group Stage
            </button>
            <button
              onClick={() => { setStageFilter("ko"); setSelectedGroup("all"); }}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-tr-md rounded-bl-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${stageFilter === "ko" ? "bg-[#ff4800] text-white shadow-sm font-black" : "text-slate-400 hover:text-white"}`}
            >
              Knockouts
            </button>
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-xs font-medium text-slate-600 cursor-pointer select-none transition-all w-full sm:w-auto justify-center sm:justify-start shadow-3xs">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-slate-300 text-[#ff4800] focus:ring-[#ff4800] w-3.5 h-3.5 accent-[#ff4800]"
            />
            <span>Show Completed Matches</span>
          </label>
        </div>

        {/* Group select when groupstage filter active */}
        {stageFilter === "group" && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full"
          >
            <span className="text-xs text-slate-500 font-mono hidden md:inline">Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-white border border-slate-200 rounded-md py-1 px-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
            >
              <option value="all">All Groups</option>
              {groups.map((g) => (
                <option key={g} value={g}>Group {g}</option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* Match Cards List */}
      <div className="flex flex-col gap-4">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No matching fixtures found</p>
            <p className="text-xs text-slate-400 font-light mt-1">Try resetting the tournament or modifying filters.</p>
          </div>
        ) : (
          filteredMatches.map((m) => {
            const homeTeam = getTeam(m.homeId);
            const awayTeam = getTeam(m.awayId);
            const isScoringActive = activeScoringMatchId === m.id;

            return (
              <div 
                key={m.id}
                className={`group relative bg-white border-2 border-slate-900 rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-lg rounded-br-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,72,0,0.85)] hover:shadow-[6px_6px_0px_0px_rgba(255,72,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 ${m.completed ? "bg-slate-50/70" : "bg-white"}`}
              >
                {/* Stage banner */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-100/70 border-b border-slate-100 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{getStageName(m)}</span>
                    {m.date && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-slate-400 font-medium normal-case">
                          <Calendar className="w-3 h-3" />
                          {formatMatchDate(m.date)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {m.completed ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Check className="w-3 h-3" />
                        Completed
                      </span>
                    ) : m.date === "2026-06-27" ? (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-black animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Playing Today
                      </span>
                    ) : m.date && m.date < "2026-06-27" ? (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold">
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Main match body */}
                <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* Left: Scoreboard */}
                  <div className="flex items-center justify-center gap-4 w-full md:w-auto md:flex-1">
                    {/* Home team */}
                    <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0">
                      <div className="text-right min-w-0">
                        <span className="block text-sm font-bold text-slate-900 truncate">
                          {homeTeam ? homeTeam.name : (m.homePlaceholder || m.homeId || "TBD")}
                        </span>
                        {homeTeam && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            ELO: {Math.round(homeTeam.elo)}
                          </span>
                        )}
                      </div>
                      <span className="text-2xl flex-shrink-0 select-none">
                        {homeTeam ? homeTeam.flag : "🏳️"}
                      </span>
                    </div>

                    {/* Scores display / center */}
                    <div className="flex flex-col items-center justify-center gap-1 bg-slate-100 rounded-lg py-1.5 px-4 min-w-[76px] shadow-inner">
                      {m.completed ? (
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                            {m.homeScore} – {m.awayScore}
                          </span>
                          {m.homePenalties !== null && m.homePenalties !== undefined && (
                            <span className="text-[10px] font-semibold text-slate-500 font-mono mt-1 leading-none">
                              ({m.homePenalties}–{m.awayPenalties} pen)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-slate-400 font-mono tracking-widest leading-none py-1">
                          VS
                        </span>
                      )}
                    </div>

                    {/* Away team */}
                    <div className="flex items-center justify-start gap-2.5 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0 select-none">
                        {awayTeam ? awayTeam.flag : "🏳️"}
                      </span>
                      <div className="text-left min-w-0">
                        <span className="block text-sm font-bold text-slate-900 truncate">
                          {awayTeam ? awayTeam.name : (m.awayPlaceholder || m.awayId || "TBD")}
                        </span>
                        {awayTeam && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            ELO: {Math.round(awayTeam.elo)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: AI Prediction meter */}
                  {!m.completed && homeTeam && awayTeam ? (
                    <div className="flex flex-col gap-1.5 w-full md:w-56">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                        <span>{homeTeam.id} ({Math.round(m.homeWinProbability * 100)}%)</span>
                        <span>DRAW ({Math.round(m.drawProbability * 100)}%)</span>
                        <span>{awayTeam.id} ({Math.round(m.awayWinProbability * 100)}%)</span>
                      </div>
                      
                      {/* Tri-split bar */}
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                        <div 
                          className="h-full" 
                          style={{ 
                            width: `${m.homeWinProbability * 100}%`, 
                            backgroundColor: homeTeam.color || "#ff4800" 
                          }} 
                        />
                        <div 
                          className="h-full bg-slate-300" 
                          style={{ width: `${m.drawProbability * 100}%` }} 
                        />
                        <div 
                          className="h-full bg-slate-400" 
                          style={{ width: `${m.awayWinProbability * 100}%` }} 
                        />
                      </div>

                      <span className="text-[10px] font-sans font-light text-slate-500 text-center leading-none mt-1">
                        Belo Forecast: <strong className="text-[#ff4800] font-semibold">{m.predictedWinnerId === "DRAW" ? "Draw likely" : `${getTeam(m.predictedWinnerId)?.name} favored`}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="w-full md:w-56 flex flex-col items-center justify-center text-center">
                      {m.completed ? (
                        <div className="text-xs text-slate-400 font-light italic">
                          Match finalized. Teams rated & continuous logs updated.
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-light italic">
                          Waiting for previous stages to resolve.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
                    {!m.completed && homeTeam && awayTeam && (
                      <button
                        onClick={() => handleOpenScorePanel(m)}
                        className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                      >
                        Simulate
                      </button>
                    )}
                  </div>

                </div>

                {/* Dynamic prediction deviation explanation */}
                {(() => {
                  const deviationReason = getPredictionDeviationReason(m, homeTeam, awayTeam);
                  if (!deviationReason) return null;
                  return (
                    <div className="px-4 py-2 bg-rose-50/75 border-t border-rose-100 text-[11px] text-rose-700 leading-relaxed font-light flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{deviationReason}</span>
                    </div>
                  );
                })()}

                {/* Score entry panel (Expanded) */}
                <AnimatePresence>
                  {isScoringActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50 overflow-hidden"
                    >
                      <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>Enter Fulltime Scores</span>
                          <button onClick={() => setActiveScoringMatchId(null)}>
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                          </button>
                        </div>

                        {/* Numeric score inputs */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-600">{homeTeam?.name}</span>
                            <input
                              type="number"
                              min="0"
                              value={homeInput}
                              onChange={(e) => setHomeInput(e.target.value)}
                              className="w-16 h-12 text-center bg-white border border-slate-200 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                            />
                          </div>

                          <span className="text-slate-400 font-mono text-xl mt-4">–</span>

                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-600">{awayTeam?.name}</span>
                            <input
                              type="number"
                              min="0"
                              value={awayInput}
                              onChange={(e) => setAwayInput(e.target.value)}
                              className="w-16 h-12 text-center bg-white border border-slate-200 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                            />
                          </div>
                        </div>

                        {/* Knockout Shootout Fields */}
                        {m.stage !== "group" && homeInput === awayInput && homeInput !== "" && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center"
                          >
                            <span className="text-xs text-orange-800 font-bold block mb-2">Tiebreaker: Penalty Shootout Needed!</span>
                            <div className="flex items-center justify-center gap-4">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] text-orange-700 font-mono">Pens Made</span>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="4"
                                  value={homePensInput}
                                  onChange={(e) => setHomePensInput(e.target.value)}
                                  className="w-14 h-9 text-center bg-white border border-slate-200 rounded-md text-sm font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                                />
                              </div>
                              <span className="text-orange-400 font-mono mt-4">–</span>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] text-orange-700 font-mono">Pens Made</span>
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="3"
                                  value={awayPensInput}
                                  onChange={(e) => setAwayPensInput(e.target.value)}
                                  className="w-14 h-9 text-center bg-white border border-slate-200 rounded-md text-sm font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <button
                          onClick={() => handleSaveScore(m)}
                          className="w-full py-2.5 bg-[#ff4800] text-white font-extrabold hover:bg-orange-600 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Confirm & Update Ratings
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
