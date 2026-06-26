/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Team, Match, Group, BracketStage } from "./types";
import { 
  INITIAL_TEAMS, 
  generateGroupMatches, 
  calculateGroupStandings, 
  resolveKnockoutMatchups, 
  updateEloForMatchResult, 
  runTwoStagePrediction, 
  simulateBracket,
  runMonteCarloSimulations
} from "./utils/predictionEngine";

import LandingPage from "./components/LandingPage";
import UpcomingMatches from "./components/UpcomingMatches";
import RoadToFinal from "./components/RoadToFinal";
import ModelInfo from "./components/ModelInfo";
import BouncingFootball from "./components/BouncingFootball";

import { Sparkles, Trophy, GitFork, Info, ChevronRight, LayoutDashboard, Database } from "lucide-react";

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<"matches" | "bracket" | "info">("matches");

  // Core ELO and match database states
  const [teams, setTeams] = useState<Team[]>([]);
  const [groupMatches, setGroupMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [bracket, setBracket] = useState<BracketStage>({
    R32: [], R16: [], QF: [], SF: [], third: [], final: []
  });

  // Favorite team & Monte Carlo probabilities
  const [favoriteTeamId, setFavoriteTeamId] = useState<string | null>(() => {
    return localStorage.getItem("belo_favorite_team") || null;
  });
  const [mcProbabilities, setMcProbabilities] = useState<{
    r32: number;
    r16: number;
    qf: number;
    sf: number;
    final: number;
    champion: number;
  } | null>(null);

  // Sync favorite team with localStorage
  useEffect(() => {
    if (favoriteTeamId) {
      localStorage.setItem("belo_favorite_team", favoriteTeamId);
    } else {
      localStorage.removeItem("belo_favorite_team");
    }
  }, [favoriteTeamId]);

  // Run Monte Carlo simulation whenever the tournament state or favorite team changes
  useEffect(() => {
    if (!favoriteTeamId || teams.length === 0 || groupMatches.length === 0 || groups.length === 0) {
      setMcProbabilities(null);
      return;
    }
    const probs = runMonteCarloSimulations(favoriteTeamId, teams, groupMatches, groups);
    setMcProbabilities(probs);
  }, [favoriteTeamId, teams, groupMatches, groups]);

  // Load initial dataset on mount
  useEffect(() => {
    resetTournamentState();
  }, []);

  // Initialize/Reset all states
  const resetTournamentState = () => {
    let initialTeams = JSON.parse(JSON.stringify(INITIAL_TEAMS));
    let initialMatches = generateGroupMatches(initialTeams);
    
    const todayStr = "2026-06-26";

    // Simulate group matches that occur before June 26, 2026 and are not completed
    initialMatches = initialMatches.map((m: Match) => {
      if (m.date && m.date < todayStr && !m.completed) {
        const home = initialTeams.find((t: Team) => t.id === m.homeId)!;
        const away = initialTeams.find((t: Team) => t.id === m.awayId)!;

        const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
        const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

        // Poisson goal generator inline
        const L_home = Math.exp(-Math.max(0.1, lambdaHome));
        let k_home = 0;
        let p_home = 1.0;
        do {
          k_home++;
          p_home *= Math.random();
        } while (p_home > L_home);
        const homeScore = Math.max(0, k_home - 1);

        const L_away = Math.exp(-Math.max(0.1, lambdaAway));
        let k_away = 0;
        let p_away = 1.0;
        do {
          k_away++;
          p_away *= Math.random();
        } while (p_away > L_away);
        const awayScore = Math.max(0, k_away - 1);

        const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
        initialTeams = initialTeams.map((t: Team) => {
          if (t.id === home.id) return { ...t, elo: eloRes.updatedHomeElo };
          if (t.id === away.id) return { ...t, elo: eloRes.updatedAwayElo };
          return t;
        });

        const pred = runTwoStagePrediction(home, away, m.isNeutral);

        return {
          ...m,
          homeScore,
          awayScore,
          completed: true,
          isSimulatedByUser: true,
          drawProbability: pred.draw,
          homeWinProbability: pred.homeWin,
          awayWinProbability: pred.awayWin,
          predictedWinnerId: pred.predictedWinnerId
        };
      }
      return m;
    });

    // Retrain predictions for remaining uncompleted matches using updated ELOs
    initialMatches = initialMatches.map((m: Match) => {
      if (m.completed) return m;
      const home = initialTeams.find((t: Team) => t.id === m.homeId)!;
      const away = initialTeams.find((t: Team) => t.id === m.awayId)!;
      const pred = runTwoStagePrediction(home, away, m.isNeutral);
      return {
        ...m,
        drawProbability: pred.draw,
        homeWinProbability: pred.homeWin,
        awayWinProbability: pred.awayWin,
        predictedWinnerId: pred.predictedWinnerId
      };
    });

    // Set up standard 12 groups A to L
    const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    const initialGroups: Group[] = groupLetters.map((letter) => {
      const gTeams = initialTeams.filter((t: Team) => t.group === letter).map((t: Team) => t.id);
      const gMatches = initialMatches.filter((m) => m.stage === "group" && m.groupLetter === letter).map((m) => m.id);
      
      return {
        letter,
        teams: gTeams,
        matches: gMatches,
        standings: [] // resolved dynamically below
      };
    });

    // Populate initial standings (with played matches factored in!)
    initialGroups.forEach((g) => {
      g.standings = calculateGroupStandings(g.letter, initialMatches, initialTeams);
    });

    // Solve initial uncompleted Round of 32
    const initialR32 = resolveKnockoutMatchups(initialGroups, initialTeams, initialMatches);
    const initialBracket = simulateBracket(initialR32, initialTeams);

    setTeams(initialTeams);
    setGroupMatches(initialMatches);
    setGroups(initialGroups);
    setBracket(initialBracket);
  };

  // Helper to sync and run two-stage predictions for remaining uncompleted matches
  const retrainRemainingPredictions = (currentTeams: Team[], currentGroupMatches: Match[], currentBracket: BracketStage): { updatedGroupMatches: Match[]; updatedBracket: BracketStage } => {
    // Retrain group stage matches
    const updatedGroupMatches = currentGroupMatches.map((m) => {
      if (m.completed) return m;
      const home = currentTeams.find((t) => t.id === m.homeId)!;
      const away = currentTeams.find((t) => t.id === m.awayId)!;
      const pred = runTwoStagePrediction(home, away, m.isNeutral);
      return {
        ...m,
        drawProbability: pred.draw,
        homeWinProbability: pred.homeWin,
        awayWinProbability: pred.awayWin,
        predictedWinnerId: pred.predictedWinnerId
      };
    });

    // Solve Round of 32 based on latest standings
    const resolvedGroups = groups.map((g) => ({
      ...g,
      standings: calculateGroupStandings(g.letter, updatedGroupMatches, currentTeams)
    }));
    
    const updatedR32 = resolveKnockoutMatchups(resolvedGroups, currentTeams, updatedGroupMatches);

    // Sync user completed scores in Round of 32 if any existed before
    const syncedR32 = updatedR32.map((m) => {
      const existing = currentBracket.R32.find((ex) => ex.id === m.id);
      if (existing && existing.completed) {
        return existing;
      }
      return m;
    });

    // Re-simulate bracket recursively
    const updatedBracket = simulateBracket(syncedR32, currentTeams);

    return { updatedGroupMatches, updatedBracket };
  };

  // Record a score and trigger full continuous-learning update loop
  const handleUpdateScore = (
    matchId: number, 
    homeScore: number, 
    awayScore: number, 
    homePens: number | null = null, 
    awayPens: number | null = null
  ) => {
    // 1. Locate and update match
    let updatedGroupMatches = [...groupMatches];
    let updatedBracket = { ...bracket };
    let currentTeams = [...teams];

    const isGroupMatch = matchId <= 72;
    let matchObj: Match | undefined;

    if (isGroupMatch) {
      updatedGroupMatches = updatedGroupMatches.map((m) => {
        if (m.id === matchId) {
          matchObj = { ...m, homeScore, awayScore, completed: true, isSimulatedByUser: true };
          return matchObj;
        }
        return m;
      });
    } else {
      // Find stage in bracket
      const stages: (keyof BracketStage)[] = ["R32", "R16", "QF", "SF", "third", "final"];
      stages.forEach((st) => {
        updatedBracket[st] = updatedBracket[st].map((m) => {
          if (m.id === matchId) {
            matchObj = { 
              ...m, 
              homeScore, 
              awayScore, 
              homePenalties: homePens, 
              awayPenalties: awayPens, 
              completed: true, 
              isSimulatedByUser: true 
            };
            return matchObj;
          }
          return m;
        });
      });
    }

    if (!matchObj) return;

    // 2. Continuous ELO Learning: Update ELO of involved teams
    const homeTeam = currentTeams.find((t) => t.id === matchObj!.homeId)!;
    const awayTeam = currentTeams.find((t) => t.id === matchObj!.awayId)!;

    const eloUpdates = updateEloForMatchResult(
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      matchObj.isNeutral
    );

    currentTeams = currentTeams.map((t) => {
      if (t.id === homeTeam.id) return { ...t, elo: eloUpdates.updatedHomeElo };
      if (t.id === awayTeam.id) return { ...t, elo: eloUpdates.updatedAwayElo };
      return t;
    });

    // 3. Recalculate group standings and recreate brackets recursively
    const updatedStandingsGroups = groups.map((g) => ({
      ...g,
      standings: calculateGroupStandings(g.letter, updatedGroupMatches, currentTeams)
    }));

    // Retrain predictions and recreate knockout brackets
    const retrained = retrainRemainingPredictions(currentTeams, updatedGroupMatches, updatedBracket);

    setTeams(currentTeams);
    setGroupMatches(retrained.updatedGroupMatches);
    setGroups(updatedStandingsGroups);
    setBracket(retrained.updatedBracket);
  };

  // Poisson goal generator proxy to model realistic scorelines
  const generatePoissonGoals = (lambda: number): number => {
    const L = Math.exp(-Math.max(0.1, lambda));
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return Math.max(0, k - 1);
  };

  // Mass simulation loop for all remaining matches
  const handleSimulateAllRemaining = () => {
    let currentTeams = JSON.parse(JSON.stringify(teams));
    let currentGroupMatches = JSON.parse(JSON.stringify(groupMatches));
    let currentBracket = JSON.parse(JSON.stringify(bracket));

    // A. Simulate group matches
    currentGroupMatches = currentGroupMatches.map((m: Match) => {
      if (m.completed) return m;

      const home = currentTeams.find((t: Team) => t.id === m.homeId)!;
      const away = currentTeams.find((t: Team) => t.id === m.awayId)!;

      // Poisson expected rates incorporating ELO difference
      const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
      const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

      const homeScore = generatePoissonGoals(lambdaHome);
      const awayScore = generatePoissonGoals(lambdaAway);

      // Update ratings
      const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
      currentTeams = currentTeams.map((t: Team) => {
        if (t.id === home.id) return { ...t, elo: eloRes.updatedHomeElo };
        if (t.id === away.id) return { ...t, elo: eloRes.updatedAwayElo };
        return t;
      });

      return {
        ...m,
        homeScore,
        awayScore,
        completed: true,
        isSimulatedByUser: true
      };
    });

    // Resolve standings & solve bracket stages
    let updatedGroups = groups.map((g) => ({
      ...g,
      standings: calculateGroupStandings(g.letter, currentGroupMatches, currentTeams)
    }));

    const solvedR32 = resolveKnockoutMatchups(updatedGroups, currentTeams, currentGroupMatches);

    // Sync any user scores that existed previously in Round of 32
    const r32Final = solvedR32.map((m) => {
      const existing = currentBracket.R32.find((ex: Match) => ex.id === m.id);
      return existing && existing.completed ? existing : m;
    });

    // B. Simulate R32 downwards sequentially
    const stages: (keyof BracketStage)[] = ["R32", "R16", "QF", "SF", "third", "final"];
    const workingBracket: BracketStage = { R32: r32Final, R16: [], QF: [], SF: [], third: [], final: [] };

    stages.forEach((st, idx) => {
      if (idx > 0) {
        // Resolve this stage's inputs from previous stage winners
        const previousStageResolved = simulateBracket(workingBracket.R32, currentTeams);
        workingBracket[st] = previousStageResolved[st];
      }

      // Simulate matches for this stage
      workingBracket[st] = workingBracket[st].map((m: Match) => {
        if (m.completed) return m;

        const home = currentTeams.find((t: Team) => t.id === m.homeId)!;
        const away = currentTeams.find((t: Team) => t.id === m.awayId)!;

        const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
        const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

        let homeScore = generatePoissonGoals(lambdaHome);
        let awayScore = generatePoissonGoals(lambdaAway);

        let homePens: number | null = null;
        let awayPens: number | null = null;

        // Knockout ties resolved via penalties
        if (homeScore === awayScore) {
          const coin = Math.random();
          // ELO biased shootout chance
          const homeProb = 1 / (1 + Math.exp(-(home.elo - away.elo) / 250));
          if (coin < homeProb) {
            homePens = 5;
            awayPens = Math.random() > 0.5 ? 4 : 3;
          } else {
            awayPens = 5;
            homePens = Math.random() > 0.5 ? 4 : 3;
          }
        }

        const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
        currentTeams = currentTeams.map((t: Team) => {
          if (t.id === home.id) return { ...t, elo: eloRes.updatedHomeElo };
          if (t.id === away.id) return { ...t, elo: eloRes.updatedAwayElo };
          return t;
        });

        return {
          ...m,
          homeScore,
          awayScore,
          homePenalties: homePens,
          awayPenalties: awayPens,
          completed: true,
          isSimulatedByUser: true
        };
      });

      // Update intermediate stage matches in working bracket
      const compiled = simulateBracket(workingBracket.R32, currentTeams);
      stages.forEach((subSt) => {
        if (workingBracket[subSt].length > 0) {
          workingBracket[subSt] = workingBracket[subSt].map((m) => {
            const simulated = workingBracket[subSt].find((sim) => sim.id === m.id);
            return simulated || m;
          });
        }
      });
    });

    const finalBracket = simulateBracket(workingBracket.R32, currentTeams);
    // Overwrite with completed scores
    stages.forEach((st) => {
      finalBracket[st] = workingBracket[st];
    });

    setTeams(currentTeams);
    setGroupMatches(currentGroupMatches);
    setGroups(updatedGroups);
    setBracket(finalBracket);
  };

  // Fast forward the World Cup prediction sandbox to June 26, 2026 state
  const handleSyncLiveResults = () => {
    let currentTeams = JSON.parse(JSON.stringify(teams));
    let currentGroupMatches = JSON.parse(JSON.stringify(groupMatches));
    let currentBracket = JSON.parse(JSON.stringify(bracket));

    const todayStr = "2026-06-26";

    // Simulate group matches that occur before June 26, 2026 and are not completed
    currentGroupMatches = currentGroupMatches.map((m: Match) => {
      if (m.date && m.date < todayStr && !m.completed) {
        const home = currentTeams.find((t: Team) => t.id === m.homeId)!;
        const away = currentTeams.find((t: Team) => t.id === m.awayId)!;

        const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
        const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

        const homeScore = generatePoissonGoals(lambdaHome);
        const awayScore = generatePoissonGoals(lambdaAway);

        const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
        currentTeams = currentTeams.map((t: Team) => {
          if (t.id === home.id) return { ...t, elo: eloRes.updatedHomeElo };
          if (t.id === away.id) return { ...t, elo: eloRes.updatedAwayElo };
          return t;
        });

        return {
          ...m,
          homeScore,
          awayScore,
          completed: true,
          isSimulatedByUser: true
        };
      }
      return m;
    });

    // Recalculate group standings
    const updatedGroups = groups.map((g) => ({
      ...g,
      standings: calculateGroupStandings(g.letter, currentGroupMatches, currentTeams)
    }));

    // Retrain the predictions for any remaining uncompleted matches and regenerate brackets
    const retrained = retrainRemainingPredictions(currentTeams, currentGroupMatches, currentBracket);

    setTeams(currentTeams);
    setGroupMatches(retrained.updatedGroupMatches);
    setGroups(updatedGroups);
    setBracket(retrained.updatedBracket);
  };

  // Total completed matches count for statistics info
  const completedCount = groupMatches.filter((m) => m.completed).length +
    (Object.values(bracket).flat() as Match[]).filter((m) => m.completed).length;

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-[#ff4800]/10 selection:text-[#ff4800]">
      {viewMode === "landing" ? (
        <LandingPage onEnterApp={() => setViewMode("app")} />
      ) : (
        <div className="flex flex-col min-h-screen">
          
          {/* Main Dashboard Navbar */}
          <header className="sticky top-0 bg-white/95 border-b border-slate-200/90 z-40 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
              
              {/* Logo / Brand */}
              <div 
                onClick={() => setViewMode("landing")} 
                className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all select-none group"
              >
                <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                  <BouncingFootball size={36} />
                  {/* Subtle ground shadow to match bouncing */}
                  <div className="absolute -bottom-1 left-1.5 right-1.5 h-1 bg-slate-900/10 rounded-full blur-[1px] transform scale-x-75 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-base font-black tracking-wider text-slate-900 leading-none flex items-center gap-1.5">
                    BELO
                    <span className="text-[10px] bg-gradient-to-r from-[#ff4800] to-orange-500 text-white font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest scale-90 origin-left">
                      2026
                    </span>
                  </h1>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 block">
                    World Cup Predictor
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setActiveTab("matches")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "matches" ? "bg-slate-100 text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab("bracket")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "bracket" ? "bg-slate-100 text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Road to Final
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "info" ? "bg-slate-100 text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Model Info
                </button>
              </nav>

              {/* Status Indicator */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200/50 rounded-lg py-1 px-3">
                <Database className="w-3.5 h-3.5 text-[#ff4800]" />
                <span className="text-[10px] font-mono text-slate-600 font-semibold uppercase leading-none">
                  {completedCount} Simulated Results
                </span>
              </div>

            </div>
          </header>

          {/* Core Content Body with balanced padding */}
          <main className="flex-1 py-8 px-2 md:px-4">
            {activeTab === "matches" && (
              <UpcomingMatches
                matches={groupMatches}
                teams={teams}
                bracket={bracket}
                onUpdateScore={handleUpdateScore}
                onSimulateRemaining={handleSimulateAllRemaining}
                onReset={resetTournamentState}
                onSyncLiveResults={handleSyncLiveResults}
                favoriteTeamId={favoriteTeamId}
                onChangeFavoriteTeam={setFavoriteTeamId}
                mcProbabilities={mcProbabilities}
              />
            )}

            {activeTab === "bracket" && (
              <RoadToFinal
                bracket={bracket}
                teams={teams}
                favoriteTeamId={favoriteTeamId}
                onChangeFavoriteTeam={setFavoriteTeamId}
                mcProbabilities={mcProbabilities}
                groupMatches={groupMatches}
              />
            )}

            {activeTab === "info" && (
              <ModelInfo />
            )}
          </main>

          {/* Humble design footer */}
          <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            <span>Belo Predictor Engine © 2026 • Built with precision & architectural honesty</span>
          </footer>

        </div>
      )}
    </div>
  );
}
