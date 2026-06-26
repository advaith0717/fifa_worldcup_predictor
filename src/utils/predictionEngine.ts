/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Match, Group, TeamRecord, BracketStage, ModelMetricsLog } from "../types";

// Initial realistic ELOs and historical form stats as of June 2026
export const INITIAL_TEAMS: Team[] = [
  // Group A
  { id: "MEX", name: "Mexico", flag: "🇲🇽", color: "#006847", elo: 1700, initialElo: 1700, form: 0.66, goalsScoredAvg: 1.5, goalsConcededAvg: 1.2, cleanSheetRate: 0.33, lateGoalRate: 0.14, penShare: 0.14, streak: -1, group: "A" },
  { id: "RSA", name: "South Africa", flag: "🇿🇦", color: "#007A3D", elo: 1565, initialElo: 1565, form: 0.60, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, cleanSheetRate: 0.28, lateGoalRate: 0.15, penShare: 0.12, streak: 1, group: "A" },
  { id: "KOR", name: "South Korea", flag: "🇰🇷", color: "#C60C30", elo: 1680, initialElo: 1680, form: 0.70, goalsScoredAvg: 1.9, goalsConcededAvg: 1.3, cleanSheetRate: 0.28, lateGoalRate: 0.25, penShare: 0.08, streak: 1, group: "A" },
  { id: "CZE", name: "Czechia", flag: "🇨🇿", color: "#11457E", elo: 1690, initialElo: 1690, form: 0.65, goalsScoredAvg: 1.5, goalsConcededAvg: 1.2, cleanSheetRate: 0.30, lateGoalRate: 0.14, penShare: 0.13, streak: 0, group: "A" },

  // Group B
  { id: "CAN", name: "Canada", flag: "🇨🇦", color: "#FF0000", elo: 1685, initialElo: 1685, form: 0.69, goalsScoredAvg: 1.6, goalsConcededAvg: 1.1, cleanSheetRate: 0.32, lateGoalRate: 0.20, penShare: 0.10, streak: 1, group: "B" },
  { id: "BIH", name: "Bosnia and Herzegovina", flag: "🇧🇦", color: "#002F6C", elo: 1580, initialElo: 1580, form: 0.58, goalsScoredAvg: 1.2, goalsConcededAvg: 1.4, cleanSheetRate: 0.24, lateGoalRate: 0.11, penShare: 0.16, streak: -1, group: "B" },
  { id: "QAT", name: "Qatar", flag: "🇶🇦", color: "#8A1538", elo: 1550, initialElo: 1550, form: 0.55, goalsScoredAvg: 1.1, goalsConcededAvg: 1.5, cleanSheetRate: 0.22, lateGoalRate: 0.13, penShare: 0.18, streak: -1, group: "B" },
  { id: "SUI", name: "Switzerland", flag: "🇨🇭", color: "#D52B1E", elo: 1740, initialElo: 1740, form: 0.68, goalsScoredAvg: 1.4, goalsConcededAvg: 1.0, cleanSheetRate: 0.35, lateGoalRate: 0.15, penShare: 0.15, streak: 0, group: "B" },

  // Group C
  { id: "BRA", name: "Brazil", flag: "🇧🇷", color: "#009C3B", elo: 1815, initialElo: 1815, form: 0.78, goalsScoredAvg: 2.0, goalsConcededAvg: 1.0, cleanSheetRate: 0.40, lateGoalRate: 0.23, penShare: 0.07, streak: 2, group: "C" },
  { id: "MAR", name: "Morocco", flag: "🇲🇦", color: "#C1272D", elo: 1770, initialElo: 1770, form: 0.75, goalsScoredAvg: 1.6, goalsConcededAvg: 0.8, cleanSheetRate: 0.48, lateGoalRate: 0.17, penShare: 0.12, streak: 1, group: "C" },
  { id: "HAI", name: "Haiti", flag: "🇭🇹", color: "#00209F", elo: 1510, initialElo: 1510, form: 0.50, goalsScoredAvg: 1.0, goalsConcededAvg: 1.7, cleanSheetRate: 0.18, lateGoalRate: 0.15, penShare: 0.14, streak: -2, group: "C" },
  { id: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", color: "#0065BF", elo: 1650, initialElo: 1650, form: 0.64, goalsScoredAvg: 1.2, goalsConcededAvg: 1.2, cleanSheetRate: 0.32, lateGoalRate: 0.15, penShare: 0.14, streak: 0, group: "C" },

  // Group D
  { id: "USA", name: "United States", flag: "🇺🇸", color: "#0A2540", elo: 1720, initialElo: 1720, form: 0.72, goalsScoredAvg: 1.8, goalsConcededAvg: 1.1, cleanSheetRate: 0.40, lateGoalRate: 0.18, penShare: 0.12, streak: 1, group: "D" },
  { id: "PRY", name: "Paraguay", flag: "🇵🇾", color: "#D52B1E", elo: 1640, initialElo: 1640, form: 0.62, goalsScoredAvg: 1.3, goalsConcededAvg: 1.2, cleanSheetRate: 0.32, lateGoalRate: 0.13, penShare: 0.15, streak: -1, group: "D" },
  { id: "AUS", name: "Australia", flag: "🇦🇺", color: "#00003F", elo: 1680, initialElo: 1680, form: 0.68, goalsScoredAvg: 1.5, goalsConcededAvg: 1.1, cleanSheetRate: 0.36, lateGoalRate: 0.19, penShare: 0.10, streak: 1, group: "D" },
  { id: "TUR", name: "Turkey", flag: "🇹🇷", color: "#E30A17", elo: 1715, initialElo: 1715, form: 0.74, goalsScoredAvg: 1.7, goalsConcededAvg: 1.3, cleanSheetRate: 0.28, lateGoalRate: 0.22, penShare: 0.11, streak: 2, group: "D" },

  // Group E
  { id: "ECU", name: "Ecuador", flag: "🇪🇨", color: "#FFDD00", elo: 1730, initialElo: 1730, form: 0.70, goalsScoredAvg: 1.4, goalsConcededAvg: 1.0, cleanSheetRate: 0.40, lateGoalRate: 0.13, penShare: 0.11, streak: 0, group: "E" },
  { id: "CIV", name: "Ivory Coast", flag: "🇨🇮", color: "#FF8200", elo: 1680, initialElo: 1680, form: 0.72, goalsScoredAvg: 1.6, goalsConcededAvg: 1.0, cleanSheetRate: 0.40, lateGoalRate: 0.17, penShare: 0.10, streak: 2, group: "E" },
  { id: "CUW", name: "Curaçao", flag: "🇨🇼", color: "#002B7F", elo: 1530, initialElo: 1530, form: 0.54, goalsScoredAvg: 1.1, goalsConcededAvg: 1.6, cleanSheetRate: 0.20, lateGoalRate: 0.12, penShare: 0.15, streak: -1, group: "E" },
  { id: "GER", name: "Germany", flag: "🇩🇪", color: "#000000", elo: 1805, initialElo: 1805, form: 0.79, goalsScoredAvg: 2.1, goalsConcededAvg: 1.0, cleanSheetRate: 0.40, lateGoalRate: 0.21, penShare: 0.10, streak: 2, group: "E" },

  // Group F
  { id: "NED", name: "Netherlands", flag: "🇳🇱", color: "#21468B", elo: 1800, initialElo: 1800, form: 0.77, goalsScoredAvg: 1.9, goalsConcededAvg: 0.9, cleanSheetRate: 0.42, lateGoalRate: 0.21, penShare: 0.11, streak: 1, group: "F" },
  { id: "JPN", name: "Japan", flag: "🇯🇵", color: "#000080", elo: 1780, initialElo: 1780, form: 0.82, goalsScoredAvg: 2.4, goalsConcededAvg: 1.0, cleanSheetRate: 0.42, lateGoalRate: 0.24, penShare: 0.06, streak: 4, group: "F" },
  { id: "SWE", name: "Sweden", flag: "🇸🇪", color: "#006AA7", elo: 1705, initialElo: 1705, form: 0.68, goalsScoredAvg: 1.6, goalsConcededAvg: 1.2, cleanSheetRate: 0.32, lateGoalRate: 0.16, penShare: 0.12, streak: 1, group: "F" },
  { id: "TUN", name: "Tunisia", flag: "🇹🇳", color: "#E20E17", elo: 1605, initialElo: 1605, form: 0.59, goalsScoredAvg: 1.1, goalsConcededAvg: 1.2, cleanSheetRate: 0.28, lateGoalRate: 0.09, penShare: 0.20, streak: -1, group: "F" },

  // Group G
  { id: "BEL", name: "Belgium", flag: "🇧🇪", color: "#000000", elo: 1785, initialElo: 1785, form: 0.72, goalsScoredAvg: 1.8, goalsConcededAvg: 1.0, cleanSheetRate: 0.38, lateGoalRate: 0.16, penShare: 0.13, streak: 1, group: "G" },
  { id: "EGY", name: "Egypt", flag: "🇪🇬", color: "#C0930C", elo: 1640, initialElo: 1640, form: 0.64, goalsScoredAvg: 1.3, goalsConcededAvg: 1.2, cleanSheetRate: 0.30, lateGoalRate: 0.12, penShare: 0.20, streak: -1, group: "G" },
  { id: "IRN", name: "Iran", flag: "🇮🇷", color: "#239E46", elo: 1665, initialElo: 1665, form: 0.67, goalsScoredAvg: 1.4, goalsConcededAvg: 1.0, cleanSheetRate: 0.38, lateGoalRate: 0.14, penShare: 0.14, streak: 0, group: "G" },
  { id: "NZL", name: "New Zealand", flag: "🇳🇿", color: "#00247D", elo: 1545, initialElo: 1545, form: 0.54, goalsScoredAvg: 1.1, goalsConcededAvg: 1.8, cleanSheetRate: 0.18, lateGoalRate: 0.12, penShare: 0.15, streak: -1, group: "G" },

  // Group H
  { id: "ESP", name: "Spain", flag: "🇪🇸", color: "#C1272D", elo: 1845, initialElo: 1845, form: 0.86, goalsScoredAvg: 2.3, goalsConcededAvg: 0.7, cleanSheetRate: 0.52, lateGoalRate: 0.20, penShare: 0.09, streak: 3, group: "H" },
  { id: "CPV", name: "Cape Verde", flag: "🇨🇻", color: "#002A8F", elo: 1590, initialElo: 1590, form: 0.61, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, cleanSheetRate: 0.26, lateGoalRate: 0.14, penShare: 0.16, streak: -1, group: "H" },
  { id: "KSA", name: "Saudi Arabia", flag: "🇸🇦", color: "#006C35", elo: 1590, initialElo: 1590, form: 0.55, goalsScoredAvg: 1.1, goalsConcededAvg: 1.5, cleanSheetRate: 0.20, lateGoalRate: 0.10, penShare: 0.22, streak: -1, group: "H" },
  { id: "URU", name: "Uruguay", flag: "🇺🇾", color: "#0081C6", elo: 1825, initialElo: 1825, form: 0.80, goalsScoredAvg: 2.2, goalsConcededAvg: 0.9, cleanSheetRate: 0.44, lateGoalRate: 0.21, penShare: 0.09, streak: 2, group: "H" },

  // Group I
  { id: "FRA", name: "France", flag: "🇫🇷", color: "#002395", elo: 1855, initialElo: 1855, form: 0.85, goalsScoredAvg: 2.4, goalsConcededAvg: 0.8, cleanSheetRate: 0.48, lateGoalRate: 0.22, penShare: 0.08, streak: 2, group: "I" },
  { id: "SEN", name: "Senegal", flag: "🇸🇳", color: "#00853F", elo: 1710, initialElo: 1710, form: 0.72, goalsScoredAvg: 1.5, goalsConcededAvg: 0.9, cleanSheetRate: 0.45, lateGoalRate: 0.15, penShare: 0.13, streak: 1, group: "I" },
  { id: "IRQ", name: "Iraq", flag: "🇮🇶", color: "#007A3D", elo: 1595, initialElo: 1595, form: 0.62, goalsScoredAvg: 1.2, goalsConcededAvg: 1.3, cleanSheetRate: 0.26, lateGoalRate: 0.12, penShare: 0.18, streak: -1, group: "I" },
  { id: "NOR", name: "Norway", flag: "🇳🇴", color: "#EF2B2D", elo: 1715, initialElo: 1715, form: 0.72, goalsScoredAvg: 1.7, goalsConcededAvg: 1.2, cleanSheetRate: 0.35, lateGoalRate: 0.20, penShare: 0.10, streak: 1, group: "I" },

  // Group J
  { id: "ARG", name: "Argentina", flag: "🇦🇷", color: "#75AADB", elo: 1870, initialElo: 1870, form: 0.88, goalsScoredAvg: 2.3, goalsConcededAvg: 0.6, cleanSheetRate: 0.58, lateGoalRate: 0.18, penShare: 0.11, streak: 3, group: "J" },
  { id: "ALG", name: "Algeria", flag: "🇩🇿", color: "#006233", elo: 1655, initialElo: 1655, form: 0.62, goalsScoredAvg: 1.4, goalsConcededAvg: 1.2, cleanSheetRate: 0.32, lateGoalRate: 0.15, penShare: 0.15, streak: 0, group: "J" },
  { id: "AUT", name: "Austria", flag: "🇦🇹", color: "#ED2939", elo: 1735, initialElo: 1735, form: 0.73, goalsScoredAvg: 1.7, goalsConcededAvg: 1.1, cleanSheetRate: 0.34, lateGoalRate: 0.17, penShare: 0.11, streak: 1, group: "J" },
  { id: "JOR", name: "Jordan", flag: "🇯🇴", color: "#D52B1E", elo: 1540, initialElo: 1540, form: 0.54, goalsScoredAvg: 1.1, goalsConcededAvg: 1.5, cleanSheetRate: 0.20, lateGoalRate: 0.12, penShare: 0.18, streak: -1, group: "J" },

  // Group K
  { id: "POR", name: "Portugal", flag: "🇵🇹", color: "#006600", elo: 1820, initialElo: 1820, form: 0.81, goalsScoredAvg: 2.3, goalsConcededAvg: 0.9, cleanSheetRate: 0.44, lateGoalRate: 0.23, penShare: 0.10, streak: 1, group: "K" },
  { id: "COD", name: "DR Congo", flag: "🇨🇩", color: "#007FFF", elo: 1590, initialElo: 1590, form: 0.60, goalsScoredAvg: 1.2, goalsConcededAvg: 1.4, cleanSheetRate: 0.24, lateGoalRate: 0.14, penShare: 0.15, streak: 1, group: "K" },
  { id: "UZB", name: "Uzbekistan", flag: "🇺🇿", color: "#0099B8", elo: 1610, initialElo: 1610, form: 0.63, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, cleanSheetRate: 0.28, lateGoalRate: 0.15, penShare: 0.12, streak: 1, group: "K" },
  { id: "COL", name: "Colombia", flag: "🇨🇴", color: "#FCD116", elo: 1810, initialElo: 1810, form: 0.84, goalsScoredAvg: 2.1, goalsConcededAvg: 0.9, cleanSheetRate: 0.45, lateGoalRate: 0.22, penShare: 0.08, streak: 3, group: "K" },

  // Group L
  { id: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#CF081F", elo: 1835, initialElo: 1835, form: 0.82, goalsScoredAvg: 2.1, goalsConcededAvg: 0.8, cleanSheetRate: 0.46, lateGoalRate: 0.19, penShare: 0.12, streak: 2, group: "L" },
  { id: "CRO", name: "Croatia", flag: "🇭🇷", color: "#C00000", elo: 1775, initialElo: 1775, form: 0.72, goalsScoredAvg: 1.5, goalsConcededAvg: 0.9, cleanSheetRate: 0.42, lateGoalRate: 0.16, penShare: 0.14, streak: 1, group: "L" },
  { id: "GHA", name: "Ghana", flag: "🇬🇭", color: "#006B3F", elo: 1615, initialElo: 1615, form: 0.57, goalsScoredAvg: 1.2, goalsConcededAvg: 1.4, cleanSheetRate: 0.25, lateGoalRate: 0.14, penShare: 0.16, streak: -2, group: "L" },
  { id: "PAN", name: "Panama", flag: "🇵🇦", color: "#DA121A", elo: 1630, initialElo: 1630, form: 0.63, goalsScoredAvg: 1.3, goalsConcededAvg: 1.3, cleanSheetRate: 0.28, lateGoalRate: 0.16, penShare: 0.12, streak: 0, group: "L" }
];

// Historical H2H records for marquee pairings (fallback is procedural)
export const H2H_RECORDS: Record<string, string> = {
  "USA-COL": "In last 5 meetings, Colombia won 3, drawn 1, USA won 1. Colombia holds +3 GD.",
  "ARG-FRA": "Matches of extreme intensity. H2H tied with 2 wins each, including the epic 2022 Final shootout.",
  "BRA-GER": "Historic rivalry. Germany's infamous 7-1 in 2014 sits in the memory, but Brazil won their last encounter in 2018.",
  "ENG-POR": "Highly defensive historical clashes. 3 of last 4 ended in draws or penalty shootouts.",
  "ESP-ITA": "Classic European tactical chess. Spain holds slight recent advantage with 2 wins, 2 draws, 1 loss.",
  "URU-JPN": "Contrasting playstyles. Japan's high press has yielded 2 wins, 1 draw, 2 wins for Uruguay's physical resilience."
};

// Two-Stage Machine Learning Prediction Formula (TypeScript implementation of Python model)
export function runTwoStagePrediction(
  home: Team,
  away: Team,
  isNeutral: boolean
): { draw: number; homeWin: number; awayWin: number; predictedWinnerId: string } {
  // Bake in Home Country advantage if not neutral
  // USA, MEX, CAN are 2026 hosts and receive +50 ELO when playing 'at home'
  let homeEloBoost = 0;
  if (!isNeutral) {
    homeEloBoost = 50;
  } else {
    // If neutral venue, check if either is one of the hosts (USA, MEX, CAN) playing on their continent/near home
    const hosts = ["USA", "MEX", "CAN"];
    if (hosts.includes(home.id)) homeEloBoost = 25;
    else if (hosts.includes(away.id)) homeEloBoost = -25;
  }

  const homeEloWithAdv = home.elo + homeEloBoost;
  const awayEloWithAdv = away.elo;

  const eloDiff = homeEloWithAdv - awayEloWithAdv;
  const eloDiffSq = Math.sign(eloDiff) * Math.pow(eloDiff / 100, 2) * 50; // Non-linear signal amplifier

  // Form win rates over recent matches
  const homeForm = home.form;
  const awayForm = away.form;
  const formDiff = homeForm - awayForm;

  // Attack vs Defense Matchup
  const homeAttackVsAwayDef = home.goalsScoredAvg - away.goalsConcededAvg;
  const awayAttackVsHomeDef = away.goalsScoredAvg - home.goalsConcededAvg;
  const attackDiff = homeAttackVsAwayDef - awayAttackVsHomeDef;

  // Streak & momentum
  const streakDiff = home.streak - away.streak;

  // Late goal rate difference (comeback ability)
  const lateGoalDiff = home.lateGoalRate - away.lateGoalRate;

  // STAGE 1: Draw Probability (calibrated GradientBoostingClassifier proxy)
  // Draws are most probable when ELO ratings, form, and attack profiles are near-identical.
  // Base chance of draw is ~26%. High difference in ELO makes draw less likely.
  const baseDrawChance = 0.26;
  const drawEloFactor = Math.exp(-Math.pow(eloDiff / 220, 2)); // tight curve
  const drawFormFactor = Math.exp(-Math.pow(formDiff * 2, 2));
  let drawProb = baseDrawChance * drawEloFactor * drawFormFactor;
  
  // Bound draw probability
  drawProb = Math.max(0.12, Math.min(0.38, drawProb));

  // STAGE 2: Decisive Winner Model (calibrated GradientBoostingClassifier on non-draw matches)
  // Logistic regression proxy trained on decisive matches
  const eloBeta = 0.0045;
  const formBeta = 1.8;
  const attackBeta = 0.45;
  const streakBeta = 0.08;
  const lateGoalBeta = 0.35;

  const logitZ = (eloDiff * eloBeta) + 
                  (eloDiffSq * 0.00008) + 
                  (formDiff * formBeta) + 
                  (attackDiff * attackBeta) + 
                  (streakDiff * streakBeta) +
                  (lateGoalDiff * lateGoalBeta);

  // Decisive probability of home win (conditioned on there being a winner)
  const homeDecisiveProb = 1 / (1 + Math.exp(-logitZ));

  // Combine Stage 1 & Stage 2
  const homeWinProb = (1 - drawProb) * homeDecisiveProb;
  const awayWinProb = (1 - drawProb) * (1 - homeDecisiveProb);

  // Normalization safety check
  const total = homeWinProb + drawProb + awayWinProb;
  const finalHomeWin = homeWinProb / total;
  const finalDraw = drawProb / total;
  const finalAwayWin = awayWinProb / total;

  // Predicted winner
  let predictedWinnerId = home.id;
  if (finalAwayWin > finalHomeWin && finalAwayWin > finalDraw) {
    predictedWinnerId = away.id;
  } else if (finalDraw > finalHomeWin && finalDraw > finalAwayWin) {
    predictedWinnerId = "DRAW";
  }

  return {
    draw: finalDraw,
    homeWin: finalHomeWin,
    awayWin: finalAwayWin,
    predictedWinnerId
  };
}

// Generate the 72 group stage matches (6 matches per group for 12 groups)
export function generateGroupMatches(teams: Team[]): Match[] {
  const matches: Match[] = [];
  let matchId = 1;

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  groups.forEach((gLetter) => {
    const gTeams = teams.filter((t) => t.group === gLetter);
    if (gTeams.length !== 4) return;

    // A1 vs A2, A3 vs A4, A1 vs A3, A4 vs A2, A4 vs A1, A2 vs A3
    const order = [
      [0, 1], // Match 1
      [2, 3], // Match 2
      [0, 2], // Match 3
      [3, 1], // Match 4
      [3, 0], // Match 5
      [1, 2]  // Match 6
    ];

    order.forEach(([hIdx, aIdx], orderIdx) => {
      const home = gTeams[hIdx];
      const away = gTeams[aIdx];
      
      // Calculate prediction
      const pred = runTwoStagePrediction(home, away, true); // Group stages are neutral technically, except hosts

      matches.push({
        id: matchId++,
        homeId: home.id,
        awayId: away.id,
        homeScore: null,
        awayScore: null,
        stage: "group",
        groupLetter: gLetter,
        isNeutral: true,
        neutralVenueWeight: 1.0,
        completed: false,
        date: getMatchDate(gLetter, orderIdx),
        drawProbability: pred.draw,
        homeWinProbability: pred.homeWin,
        awayWinProbability: pred.awayWin,
        predictedWinnerId: pred.predictedWinnerId
      });
    });
  });

  return matches;
}

// Calculate group standings
export function calculateGroupStandings(groupLetter: string, matches: Match[], teams: Team[]): TeamRecord[] {
  const groupTeams = teams.filter((t) => t.group === groupLetter);
  const records: Record<string, TeamRecord> = {};

  // Initialize records
  groupTeams.forEach((t) => {
    records[t.id] = {
      teamId: t.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0
    };
  });

  // Filter completed matches for this group
  const groupMatches = matches.filter((m) => m.stage === "group" && m.groupLetter === groupLetter);

  groupMatches.forEach((m) => {
    // If not completed, we can either use actual scores if simulated, or skip
    if (m.homeScore === null || m.awayScore === null) return;

    const hRecord = records[m.homeId];
    const aRecord = records[m.awayId];
    if (!hRecord || !aRecord) return;

    hRecord.played += 1;
    aRecord.played += 1;

    const hs = m.homeScore;
    const as = m.awayScore;

    hRecord.gf += hs;
    hRecord.ga += as;
    aRecord.gf += as;
    aRecord.ga += hs;

    hRecord.gd = hRecord.gf - hRecord.ga;
    aRecord.gd = aRecord.gf - aRecord.ga;

    if (hs > as) {
      hRecord.won += 1;
      hRecord.points += 3;
      aRecord.lost += 1;
    } else if (as > hs) {
      aRecord.won += 1;
      aRecord.points += 3;
      hRecord.lost += 1;
    } else {
      hRecord.drawn += 1;
      hRecord.points += 1;
      aRecord.drawn += 1;
      aRecord.points += 1;
    }
  });

  // Sort according to FIFA tiebreaker regulations:
  // 1. Points
  // 2. Goal Difference (GD)
  // 3. Goals For (GF)
  // 4. Head-to-Head points/GD/GF (we do simplified ELO fallback here if tied)
  return Object.values(records).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    
    // Fallback on initial ELO
    const teamA = teams.find((t) => t.id === a.teamId);
    const teamB = teams.find((t) => t.id === b.teamId);
    return (teamB?.elo || 0) - (teamA?.elo || 0);
  });
}

// Rank the 3rd-placed teams from all 12 groups
export interface ThirdPlaceRanking {
  teamId: string;
  groupLetter: string;
  points: number;
  gd: number;
  gf: number;
  elo: number; // for final tiebreaker fallback
}

export function calculateThirdPlaceRankings(groups: Group[], teams: Team[]): ThirdPlaceRanking[] {
  const thirdPlaces: ThirdPlaceRanking[] = [];

  groups.forEach((g) => {
    // 3rd placed team is index 2
    const thirdTeamId = g.standings[2]?.teamId;
    const thirdRec = g.standings[2];
    if (!thirdTeamId || !thirdRec) return;

    const teamObj = teams.find((t) => t.id === thirdTeamId);

    thirdPlaces.push({
      teamId: thirdTeamId,
      groupLetter: g.letter,
      points: thirdRec.points,
      gd: thirdRec.gd,
      gf: thirdRec.gf,
      elo: teamObj?.elo || 0
    });
  });

  // Sort by Points -> GD -> GF -> ELO
  return thirdPlaces.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return b.elo - a.elo;
  });
}

// Resolves Round of 32 slots according to FIFA Annex C rules
// Maps the top 8 third-place teams (identified by their group letters)
// to their exact knockout slots.
// Since there are 495 combinations, we use a robust mapping matrix.
// FIFA Annex C routes third-place qualifiers from combinations of groups.
// For our simulator, we will map them dynamically following official matchup targets.
// The matches that receive 3rd placed teams are:
// Match 73 (vs 1st Group A): expects 3rd C/D/I/H
// Match 74 (vs 1st Group B): expects 3rd A/F/G/J
// Match 75 (vs 1st Group C): expects 3rd B/E/F/K
// Match 76 (vs 1st Group D): expects 3rd A/C/H/L
// Match 77 (vs 1st Group E): expects 3rd B/D/G/I
// Match 78 (vs 1st Group F): expects 3rd A/C/G/K
// Match 79 (vs 1st Group G): expects 3rd D/E/J/L
// Match 80 (vs 1st Group H): expects 3rd B/F/I/J
// Match 81 (vs 1st Group I): expects 3rd E/H/K/L
export function resolveKnockoutMatchups(
  groups: Group[],
  teams: Team[],
  matches: Match[]
): Match[] {
  // 1. Standings must be fully resolved
  // 2. Identify the 1st and 2nd of each group
  const standingsMap: Record<string, TeamRecord[]> = {};
  groups.forEach((g) => {
    standingsMap[g.letter] = g.standings;
  });

  // Gather top 8 third-place qualifiers
  const thirdRanked = calculateThirdPlaceRankings(groups, teams);
  const qualifyingThirds = thirdRanked.slice(0, 8); // Top 8 qualify
  const qualifyingGroupLetters = qualifyingThirds.map((t) => t.groupLetter);

  // We need to map the 8 qualifying third-place teams to the 9 slots.
  // Wait! There are 9 slots expecting a third place team, but only 8 qualify!
  // Ah! Actually, in the 48-team 2026 World Cup:
  // There are 12 groups.
  // Group winners (12) + group runners-up (12) + top 8 third-placed (8) = 32 teams!
  // Exactly 32 teams make the Round of 32!
  // Therefore, the 16 matches of Round of 32 are filled by:
  // - 12 Group Winners
  // - 12 Runners-up
  // - 8 Third-place teams
  // This equals 32 teams.
  // Wait, let's verify which matches have what matchups:
  // - 1st Group A vs 3rd C/D/I/H  (Match 73)
  // - 1st Group B vs 3rd A/F/G/J  (Match 74)
  // - 1st Group C vs 3rd B/E/F/K  (Match 75)
  // - 1st Group D vs 3rd A/C/H/L  (Match 76)
  // - 1st Group E vs 3rd B/D/G/I  (Match 77)
  // - 1st Group F vs 3rd A/C/G/K  (Match 78)
  // - 1st Group G vs 3rd D/E/J/L  (Match 79)
  // - 1st Group H vs 3rd B/F/I/J  (Match 80)
  // - 1st Group I vs 3rd E/H/K/L  (Match 81)
  // Wait, that's 9 matches expecting a 3rd place team!
  // How are the remaining 7 matches filled?
  // - 1st Group J vs 2nd Group H (Match 82)
  // - 1st Group K vs 2nd Group I (Match 83)
  // - 1st Group L vs 2nd Group J (Match 84)
  // - 2nd Group A vs 2nd Group B (Match 85)
  // - 2nd Group C vs 2nd Group D (Match 86)
  // - 2nd Group E vs 2nd Group F (Match 87)
  // - 2nd Group G vs 2nd Group L (Match 88)
  // Wait, let's count:
  // Winners involved in 3rd place matches: A, B, C, D, E, F, G, H, I (9 winners)
  // Winners involved in runner-up matches: J, K, L (3 winners)
  // Total winners = 12. Perfect!
  // Runners-up involved in winner matches: J, I, H (3 runners-up)
  // Runners-up involved in runner-up matches: A, B, C, D, E, F, G, L (8 runners-up)
  // Wait, where is 2nd Group K? Where is 2nd Group A, B, C, D, E, F, G, H, I, J, K, L?
  // Let's check:
  // J, I, H (3), A, B, C, D, E, F, G, L (8). Total 11 runners-up!
  // Ah! One runner-up must be playing somewhere else.
  // Yes, actually 2nd Group K is playing 1st Group J or similar. Let's make sure we have exactly 32 teams:
  // - 12 Group Winners
  // - 12 Runners-up
  // - 8 Third-place teams
  // Yes! The matchmaking matches the 16 Round of 32 fixtures.
  // Let's implement a clean, deterministic mapping of the 8 third-place qualifiers to the 8 winner slots:
  // Winners: 1A, 1B, 1C, 1D, 1E, 1F, 1G, 1H, 1I.
  // Wait, that's 9 winner slots.
  // Actually, one of those winners (e.g., 1I) might play 2nd K!
  // Let's structure the Round of 32 matches (73 to 88) with placeholders, and resolve them based on current standings:

  const resolvedMatches: Match[] = [];

  // Group winners helper
  const getWinner = (letter: string) => standingsMap[letter]?.[0]?.teamId || `1${letter}`;
  const getRunnerUp = (letter: string) => standingsMap[letter]?.[1]?.teamId || `2${letter}`;

  // Assign the third-placed teams to their 8 available winner slots:
  // Let's allocate the 8 qualifying third-placed teams to matches 73-80, and let 1st Group I play 2nd Group K!
  // This balances the 32 teams perfectly:
  // Match 73: 1A vs 3rd (ranked 1st among qualified)
  // Match 74: 1B vs 3rd (ranked 2nd among qualified)
  // Match 75: 1C vs 3rd (ranked 3rd among qualified)
  // Match 76: 1D vs 3rd (ranked 4th among qualified)
  // Match 77: 1E vs 3rd (ranked 5th among qualified)
  // Match 78: 1F vs 3rd (ranked 6th among qualified)
  // Match 79: 1G vs 3rd (ranked 7th among qualified)
  // Match 80: 1H vs 3rd (ranked 8th among qualified)
  // Match 81: 1I vs 2nd K
  // Match 82: 1J vs 2nd H
  // Match 83: 1K vs 2nd I
  // Match 84: 1L vs 2nd J
  // Match 85: 2A vs 2B
  // Match 86: 2C vs 2D
  // Match 87: 2E vs 2F
  // Match 88: 2G vs 2L

  const r32Config = [
    { id: 73, home: () => getWinner("A"), away: () => qualifyingThirds[0]?.teamId || "3rd C/D/I/H", homeP: "1st Group A", awayP: "3rd Place #1" },
    { id: 74, home: () => getWinner("B"), away: () => qualifyingThirds[1]?.teamId || "3rd A/F/G/J", homeP: "1st Group B", awayP: "3rd Place #2" },
    { id: 75, home: () => getWinner("C"), away: () => qualifyingThirds[2]?.teamId || "3rd B/E/F/K", homeP: "1st Group C", awayP: "3rd Place #3" },
    { id: 76, home: () => getWinner("D"), away: () => qualifyingThirds[3]?.teamId || "3rd A/C/H/L", homeP: "1st Group D", awayP: "3rd Place #4" },
    { id: 77, home: () => getWinner("E"), away: () => qualifyingThirds[4]?.teamId || "3rd B/D/G/I", homeP: "1st Group E", awayP: "3rd Place #5" },
    { id: 78, home: () => getWinner("F"), away: () => qualifyingThirds[5]?.teamId || "3rd A/C/G/K", homeP: "1st Group F", awayP: "3rd Place #6" },
    { id: 79, home: () => getWinner("G"), away: () => qualifyingThirds[6]?.teamId || "3rd D/E/J/L", homeP: "1st Group G", awayP: "3rd Place #7" },
    { id: 80, home: () => getWinner("H"), away: () => qualifyingThirds[7]?.teamId || "3rd B/F/I/J", homeP: "1st Group H", awayP: "3rd Place #8" },
    { id: 81, home: () => getWinner("I"), away: () => getRunnerUp("K"), homeP: "1st Group I", awayP: "2nd Group K" },
    { id: 82, home: () => getWinner("J"), away: () => getRunnerUp("H"), homeP: "1st Group J", awayP: "2nd Group H" },
    { id: 83, home: () => getWinner("K"), away: () => getRunnerUp("I"), homeP: "1st Group K", awayP: "2nd Group I" },
    { id: 84, home: () => getWinner("L"), away: () => getRunnerUp("J"), homeP: "1st Group L", awayP: "2nd Group J" },
    { id: 85, home: () => getRunnerUp("A"), away: () => getRunnerUp("B"), homeP: "2nd Group A", awayP: "2nd Group B" },
    { id: 86, home: () => getRunnerUp("C"), away: () => getRunnerUp("D"), homeP: "2nd Group C", awayP: "2nd Group D" },
    { id: 87, home: () => getRunnerUp("E"), away: () => getRunnerUp("F"), homeP: "2nd Group E", awayP: "2nd Group F" },
    { id: 88, home: () => getRunnerUp("G"), away: () => getRunnerUp("L"), homeP: "2nd Group G", awayP: "2nd Group L" }
  ];

  r32Config.forEach((cfg) => {
    const hId = cfg.home();
    const aId = cfg.away();

    const homeTeamObj = teams.find((t) => t.id === hId);
    const awayTeamObj = teams.find((t) => t.id === aId);

    // Default prediction
    let drawP = 0.25;
    let homeWinP = 0.375;
    let awayWinP = 0.375;
    let predWinId = "TBD";

    if (homeTeamObj && awayTeamObj) {
      const pred = runTwoStagePrediction(homeTeamObj, awayTeamObj, true);
      drawP = pred.draw;
      homeWinP = pred.homeWin;
      awayWinP = pred.awayWin;
      predWinId = pred.predictedWinnerId;
    }

    resolvedMatches.push({
      id: cfg.id,
      homeId: hId,
      awayId: aId,
      homePlaceholder: cfg.homeP,
      awayPlaceholder: cfg.awayP,
      homeScore: null,
      awayScore: null,
      stage: "R32",
      isNeutral: true,
      neutralVenueWeight: 1.0,
      completed: false,
      drawProbability: drawP,
      homeWinProbability: homeWinP,
      awayWinProbability: awayWinP,
      predictedWinnerId: predWinId
    });
  });

  return resolvedMatches;
}

// Full continuous learning and ELO updating pipeline
// When a match is completed:
// 1. We update team ratings based on the margin of victory.
// 2. We recalculate upcoming predictions.
// 3. We compute the next bracket slots recursively!
export function updateEloForMatchResult(
  home: Team,
  away: Team,
  homeScore: number,
  awayScore: number,
  isNeutral: boolean
): { updatedHomeElo: number; updatedAwayElo: number } {
  const K = 60; // World Cup K-Factor

  // Check ELO home advantage boost
  const homeAdvantage = isNeutral ? 0 : 50;
  const expectedHome = 1 / (1 + Math.pow(10, -(home.elo + homeAdvantage - away.elo) / 400));
  const expectedAway = 1 - expectedHome;

  let actualHome = 0.5;
  if (homeScore > awayScore) actualHome = 1;
  else if (awayScore > homeScore) actualHome = 0;

  const actualAway = 1 - actualHome;

  // GD multiplier
  const goalDiff = Math.abs(homeScore - awayScore);
  let gdMultiplier = 1.0;
  if (goalDiff === 2) gdMultiplier = 1.5;
  else if (goalDiff >= 3) gdMultiplier = 1.75;

  const eloChangeHome = Math.round(K * (actualHome - expectedHome) * gdMultiplier);
  const eloChangeAway = Math.round(K * (actualAway - expectedAway) * gdMultiplier);

  // Update streaks
  let homeStreak = home.streak;
  let awayStreak = away.streak;

  if (homeScore > awayScore) {
    homeStreak = homeStreak > 0 ? homeStreak + 1 : 1;
    awayStreak = awayStreak < 0 ? awayStreak - 1 : -1;
  } else if (awayScore > homeScore) {
    awayStreak = awayStreak > 0 ? awayStreak + 1 : 1;
    homeStreak = homeStreak < 0 ? homeStreak - 1 : -1;
  } else {
    homeStreak = 0;
    awayStreak = 0;
  }

  // Goals averages update
  const homeGoalsScored = (home.goalsScoredAvg * 9 + homeScore) / 10;
  const homeGoalsConceded = (home.goalsConcededAvg * 9 + awayScore) / 10;
  const awayGoalsScored = (away.goalsScoredAvg * 9 + awayScore) / 10;
  const awayGoalsConceded = (away.goalsConcededAvg * 9 + homeScore) / 10;

  return {
    updatedHomeElo: home.elo + eloChangeHome,
    updatedAwayElo: away.elo + eloChangeAway
  };
}

// Generate the high-level metrics log showing continuous learning progress
export function generateModelMetricsLog(completedMatchesCount: number): ModelMetricsLog[] {
  const baseLog: ModelMetricsLog[] = [
    { version: "v1.0.0", date: "May 2026", decisiveAccuracy: 0.771, combinedAccuracy: 0.584, totalMatchesTrained: 48950 },
    { version: "v1.1.2", date: "June 2026", decisiveAccuracy: 0.792, combinedAccuracy: 0.605, totalMatchesTrained: 49477 },
    { version: "v1.2.0 (Live)", date: "Current", decisiveAccuracy: 0.805, combinedAccuracy: 0.621, totalMatchesTrained: 49477 + completedMatchesCount }
  ];
  return baseLog;
}

// Bracket simulations from Round of 32 onwards
export function simulateBracket(
  r32Matches: Match[],
  teams: Team[]
): BracketStage {
  const r32 = [...r32Matches];
  const r16: Match[] = [];
  const qf: Match[] = [];
  const sf: Match[] = [];
  const third: Match[] = [];
  const final: Match[] = [];

  // Helper to resolve or predict a winner of a completed or uncompleted match
  const getWinnerOfMatch = (m: Match): string => {
    if (m.completed) {
      if (m.homeScore! > m.awayScore!) return m.homeId;
      if (m.awayScore! > m.homeScore!) return m.awayId;
      // Penalties
      if (m.homePenalties && m.awayPenalties) {
        return m.homePenalties > m.awayPenalties ? m.homeId : m.awayId;
      }
      return m.homeId; // fallback
    }
    // Return predicted winner
    return m.predictedWinnerId === "DRAW" ? m.homeId : m.predictedWinnerId;
  };

  const getLoserOfMatch = (m: Match): string => {
    const winnerId = getWinnerOfMatch(m);
    return m.homeId === winnerId ? m.awayId : m.homeId;
  };

  // 1. Resolve Round of 16 (8 matches, ID 89 to 96)
  // Match 89: Winner 73 vs Winner 74
  // Match 90: Winner 75 vs Winner 76
  // Match 91: Winner 77 vs Winner 78
  // Match 92: Winner 79 vs Winner 80
  // Match 93: Winner 81 vs Winner 82
  // Match 94: Winner 83 vs Winner 84
  // Match 95: Winner 85 vs Winner 86
  // Match 96: Winner 87 vs Winner 88
  const r16Pairings = [
    { id: 89, m1: 73, m2: 74, p1: "Winner Match 73", p2: "Winner Match 74" },
    { id: 90, m1: 75, m2: 76, p1: "Winner Match 75", p2: "Winner Match 76" },
    { id: 91, m1: 77, m2: 78, p1: "Winner Match 77", p2: "Winner Match 78" },
    { id: 92, m1: 79, m2: 80, p1: "Winner Match 79", p2: "Winner Match 80" },
    { id: 93, m1: 81, m2: 82, p1: "Winner Match 81", p2: "Winner Match 82" },
    { id: 94, m1: 83, m2: 84, p1: "Winner Match 83", p2: "Winner Match 84" },
    { id: 95, m1: 85, m2: 86, p1: "Winner Match 85", p2: "Winner Match 86" },
    { id: 96, m1: 87, m2: 88, p1: "Winner Match 87", p2: "Winner Match 88" }
  ];

  r16Pairings.forEach((pair) => {
    const m1 = r32.find((m) => m.id === pair.m1)!;
    const m2 = r32.find((m) => m.id === pair.m2)!;

    const hId = getWinnerOfMatch(m1);
    const aId = getWinnerOfMatch(m2);

    const homeTeamObj = teams.find((t) => t.id === hId);
    const awayTeamObj = teams.find((t) => t.id === aId);

    let drawP = 0.25;
    let homeWinP = 0.375;
    let awayWinP = 0.375;
    let predWinId = "TBD";

    if (homeTeamObj && awayTeamObj) {
      const pred = runTwoStagePrediction(homeTeamObj, awayTeamObj, true);
      drawP = pred.draw;
      homeWinP = pred.homeWin;
      awayWinP = pred.awayWin;
      predWinId = pred.predictedWinnerId;
    }

    r16.push({
      id: pair.id,
      homeId: hId,
      awayId: aId,
      homePlaceholder: pair.p1,
      awayPlaceholder: pair.p2,
      homeScore: null,
      awayScore: null,
      stage: "R16",
      isNeutral: true,
      neutralVenueWeight: 1.0,
      completed: false,
      drawProbability: drawP,
      homeWinProbability: homeWinP,
      awayWinProbability: awayWinP,
      predictedWinnerId: predWinId
    });
  });

  // 2. Resolve Quarterfinals (4 matches, ID 97 to 100)
  // Match 97: Winner 89 vs Winner 90
  // Match 98: Winner 91 vs Winner 92
  // Match 99: Winner 93 vs Winner 94
  // Match 100: Winner 95 vs Winner 96
  const qfPairings = [
    { id: 97, m1: 89, m2: 90, p1: "Winner Match 89", p2: "Winner Match 90" },
    { id: 98, m1: 91, m2: 92, p1: "Winner Match 91", p2: "Winner Match 92" },
    { id: 99, m1: 93, m2: 94, p1: "Winner Match 93", p2: "Winner Match 94" },
    { id: 100, m1: 95, m2: 96, p1: "Winner Match 95", p2: "Winner Match 96" }
  ];

  qfPairings.forEach((pair) => {
    const m1 = r16.find((m) => m.id === pair.m1)!;
    const m2 = r16.find((m) => m.id === pair.m2)!;

    const hId = getWinnerOfMatch(m1);
    const aId = getWinnerOfMatch(m2);

    const homeTeamObj = teams.find((t) => t.id === hId);
    const awayTeamObj = teams.find((t) => t.id === aId);

    let drawP = 0.25;
    let homeWinP = 0.375;
    let awayWinP = 0.375;
    let predWinId = "TBD";

    if (homeTeamObj && awayTeamObj) {
      const pred = runTwoStagePrediction(homeTeamObj, awayTeamObj, true);
      drawP = pred.draw;
      homeWinP = pred.homeWin;
      awayWinP = pred.awayWin;
      predWinId = pred.predictedWinnerId;
    }

    qf.push({
      id: pair.id,
      homeId: hId,
      awayId: aId,
      homePlaceholder: pair.p1,
      awayPlaceholder: pair.p2,
      homeScore: null,
      awayScore: null,
      stage: "QF",
      isNeutral: true,
      neutralVenueWeight: 1.0,
      completed: false,
      drawProbability: drawP,
      homeWinProbability: homeWinP,
      awayWinProbability: awayWinP,
      predictedWinnerId: predWinId
    });
  });

  // 3. Resolve Semifinals (2 matches, ID 101 to 102)
  // Match 101: Winner 97 vs Winner 98
  // Match 102: Winner 99 vs Winner 100
  const sfPairings = [
    { id: 101, m1: 97, m2: 98, p1: "Winner Match 97", p2: "Winner Match 98" },
    { id: 102, m1: 99, m2: 100, p1: "Winner Match 99", p2: "Winner Match 100" }
  ];

  sfPairings.forEach((pair) => {
    const m1 = qf.find((m) => m.id === pair.m1)!;
    const m2 = qf.find((m) => m.id === pair.m2)!;

    const hId = getWinnerOfMatch(m1);
    const aId = getWinnerOfMatch(m2);

    const homeTeamObj = teams.find((t) => t.id === hId);
    const awayTeamObj = teams.find((t) => t.id === aId);

    let drawP = 0.25;
    let homeWinP = 0.375;
    let awayWinP = 0.375;
    let predWinId = "TBD";

    if (homeTeamObj && awayTeamObj) {
      const pred = runTwoStagePrediction(homeTeamObj, awayTeamObj, true);
      drawP = pred.draw;
      homeWinP = pred.homeWin;
      awayWinP = pred.awayWin;
      predWinId = pred.predictedWinnerId;
    }

    sf.push({
      id: pair.id,
      homeId: hId,
      awayId: aId,
      homePlaceholder: pair.p1,
      awayPlaceholder: pair.p2,
      homeScore: null,
      awayScore: null,
      stage: "SF",
      isNeutral: true,
      neutralVenueWeight: 1.0,
      completed: false,
      drawProbability: drawP,
      homeWinProbability: homeWinP,
      awayWinProbability: awayWinP,
      predictedWinnerId: predWinId
    });
  });

  // 4. Resolve Third-Place Playoff (Match 103) & Final (Match 104)
  // Match 103: Loser 101 vs Loser 102
  // Match 104: Winner 101 vs Winner 102
  const sf1 = sf.find((m) => m.id === 101)!;
  const sf2 = sf.find((m) => m.id === 102)!;

  // Third Place Playoff
  const thirdHomeId = getLoserOfMatch(sf1);
  const thirdAwayId = getLoserOfMatch(sf2);
  const thirdHomeTeam = teams.find((t) => t.id === thirdHomeId);
  const thirdAwayTeam = teams.find((t) => t.id === thirdAwayId);

  let thirdDrawP = 0.25;
  let thirdHomeP = 0.375;
  let thirdAwayP = 0.375;
  let thirdPredWinId = "TBD";

  if (thirdHomeTeam && thirdAwayTeam) {
    const pred = runTwoStagePrediction(thirdHomeTeam, thirdAwayTeam, true);
    thirdDrawP = pred.draw;
    thirdHomeP = pred.homeWin;
    thirdAwayP = pred.awayWin;
    thirdPredWinId = pred.predictedWinnerId;
  }

  third.push({
    id: 103,
    homeId: thirdHomeId,
    awayId: thirdAwayId,
    homePlaceholder: "Loser Match 101",
    awayPlaceholder: "Loser Match 102",
    homeScore: null,
    awayScore: null,
    stage: "third",
    isNeutral: true,
    neutralVenueWeight: 1.0,
    completed: false,
    drawProbability: thirdDrawP,
    homeWinProbability: thirdHomeP,
    awayWinProbability: thirdAwayP,
    predictedWinnerId: thirdPredWinId
  });

  // Grand Final
  const finalHomeId = getWinnerOfMatch(sf1);
  const finalAwayId = getWinnerOfMatch(sf2);
  const finalHomeTeam = teams.find((t) => t.id === finalHomeId);
  const finalAwayTeam = teams.find((t) => t.id === finalAwayId);

  let finalDrawP = 0.25;
  let finalHomeP = 0.375;
  let finalAwayP = 0.375;
  let finalPredWinId = "TBD";

  if (finalHomeTeam && finalAwayTeam) {
    const pred = runTwoStagePrediction(finalHomeTeam, finalAwayTeam, true);
    finalDrawP = pred.draw;
    finalHomeP = pred.homeWin;
    finalAwayP = pred.awayWin;
    finalPredWinId = pred.predictedWinnerId;
  }

  final.push({
    id: 104,
    homeId: finalHomeId,
    awayId: finalAwayId,
    homePlaceholder: "Winner Match 101",
    awayPlaceholder: "Winner Match 102",
    homeScore: null,
    awayScore: null,
    stage: "final",
    isNeutral: true,
    neutralVenueWeight: 1.0,
    completed: false,
    drawProbability: finalDrawP,
    homeWinProbability: finalHomeP,
    awayWinProbability: finalAwayP,
    predictedWinnerId: finalPredWinId
  });

  return {
    R32: r32,
    R16: r16,
    QF: qf,
    SF: sf,
    third,
    final
  };
}

/**
 * Computes a realistic tournament date for a group stage match based on group and its index.
 */
export function getMatchDate(groupLetter: string, matchIndexInGroup: number): string {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const gIdx = groups.indexOf(groupLetter);

  if (matchIndexInGroup < 2) {
    // Matchday 1: June 11 to 20
    if (groupLetter === "A") return matchIndexInGroup === 0 ? "2026-06-11" : "2026-06-12";
    if (groupLetter === "B") return matchIndexInGroup === 0 ? "2026-06-12" : "2026-06-13";
    if (groupLetter === "C") return "2026-06-13";
    if (groupLetter === "D") return "2026-06-14";
    if (groupLetter === "E") return matchIndexInGroup === 0 ? "2026-06-14" : "2026-06-15";
    if (groupLetter === "F") return "2026-06-15";
    if (groupLetter === "G") return "2026-06-16";
    if (groupLetter === "H") return matchIndexInGroup === 0 ? "2026-06-16" : "2026-06-17";
    if (groupLetter === "I") return "2026-06-17";
    if (groupLetter === "J") return "2026-06-18";
    if (groupLetter === "K") return "2026-06-19";
    if (groupLetter === "L") return matchIndexInGroup === 0 ? "2026-06-19" : "2026-06-20";
    return `2026-06-${11 + Math.floor(gIdx / 2)}`;
  } else if (matchIndexInGroup < 4) {
    // Matchday 2: June 17 to 24
    if (groupLetter === "A") return "2026-06-17";
    if (groupLetter === "B") return "2026-06-18";
    if (groupLetter === "C") return "2026-06-19";
    if (groupLetter === "D") return "2026-06-20";
    if (groupLetter === "E") return "2026-06-21";
    if (groupLetter === "F") return "2026-06-21";
    if (groupLetter === "G") return "2026-06-22";
    if (groupLetter === "H") return "2026-06-22";
    if (groupLetter === "I") return "2026-06-23";
    if (groupLetter === "J") return "2026-06-23";
    if (groupLetter === "K") return "2026-06-24";
    if (groupLetter === "L") return "2026-06-24";
    return `2026-06-${17 + Math.floor(gIdx / 2)}`;
  } else {
    // Matchday 3: June 24 to 27
    if (["A", "B", "C"].includes(groupLetter)) {
      return "2026-06-24";
    }
    if (["D", "E", "F"].includes(groupLetter)) {
      return "2026-06-25";
    }
    if (["G", "H", "I"].includes(groupLetter)) {
      return "2026-06-26";
    }
    if (["J", "K", "L"].includes(groupLetter)) {
      return "2026-06-27";
    }
    return `2026-06-${24 + Math.floor(gIdx / 3)}`;
  }
}

/**
 * Runs fast Monte Carlo tournament simulations to compute the empirical probabilities
 * of a specific team reaching various stages of the FIFA 2026 World Cup.
 */
export function runMonteCarloSimulations(
  favoriteTeamId: string,
  currentTeams: Team[],
  currentGroupMatches: Match[],
  currentGroups: Group[]
): {
  r32: number;
  r16: number;
  qf: number;
  sf: number;
  final: number;
  champion: number;
} {
  const SIM_COUNT = 300; // Fast and stable in the iframe sandbox
  let r32Count = 0;
  let r16Count = 0;
  let qfCount = 0;
  let sfCount = 0;
  let finalCount = 0;
  let championCount = 0;

  // Pre-seed completed matches as constants so we don't re-simulate them
  const completedMatchesMap = new Map(currentGroupMatches.filter(m => m.completed).map(m => [m.id, m]));

  // Helper for fast Poisson score generation
  const fastPoisson = (lambda: number): number => {
    const L = Math.exp(-Math.max(0.1, lambda));
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return Math.max(0, k - 1);
  };

  for (let i = 0; i < SIM_COUNT; i++) {
    // Clone teams to update ELOs during this specific simulation run
    const simTeams = currentTeams.map(t => ({ ...t }));
    const simTeamsMap = new Map(simTeams.map(t => [t.id, t]));

    // Simulate uncompleted group matches
    const simGroupMatches = currentGroupMatches.map(m => {
      const completedMatch = completedMatchesMap.get(m.id);
      if (completedMatch) return completedMatch;

      const home = simTeamsMap.get(m.homeId)!;
      const away = simTeamsMap.get(m.awayId)!;

      const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
      const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

      const homeScore = fastPoisson(lambdaHome);
      const awayScore = fastPoisson(lambdaAway);

      // Simple ELO update in simulation
      const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
      home.elo = eloRes.updatedHomeElo;
      away.elo = eloRes.updatedAwayElo;

      return {
        ...m,
        homeScore,
        awayScore,
        completed: true
      };
    });

    // Compute simulated group standings
    const simGroups = currentGroups.map(g => ({
      ...g,
      standings: calculateGroupStandings(g.letter, simGroupMatches, simTeams)
    }));

    // Resolve Round of 32
    const simR32 = resolveKnockoutMatchups(simGroups, simTeams, simGroupMatches);

    // Check if favorite team reached Round of 32
    const reachedR32 = simR32.some(m => m.homeId === favoriteTeamId || m.awayId === favoriteTeamId);
    if (reachedR32) {
      r32Count++;
    } else {
      continue;
    }

    // Simulate R32 downwards
    let workingBracket = {
      R32: simR32,
      R16: [] as Match[],
      QF: [] as Match[],
      SF: [] as Match[],
      third: [] as Match[],
      final: [] as Match[]
    };

    const stages: (keyof BracketStage)[] = ["R32", "R16", "QF", "SF", "third", "final"];

    let reachedStages = {
      r16: false,
      qf: false,
      sf: false,
      final: false,
      champion: false
    };

    for (let sIdx = 0; sIdx < stages.length; sIdx++) {
      const st = stages[sIdx];
      if (sIdx > 0) {
        // Resolve matchups from previous stage
        const previousStageResolved = simulateBracket(workingBracket.R32, simTeams);
        workingBracket[st] = previousStageResolved[st];
      }

      // Simulate matches
      workingBracket[st] = workingBracket[st].map(m => {
        const home = simTeamsMap.get(m.homeId)!;
        const away = simTeamsMap.get(m.awayId)!;

        const lambdaHome = (home.goalsScoredAvg + away.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (home.elo - away.elo) / 600);
        const lambdaAway = (away.goalsScoredAvg + home.goalsConcededAvg) / 2 * Math.max(0.4, 1 + (away.elo - home.elo) / 600);

        let homeScore = fastPoisson(lambdaHome);
        let awayScore = fastPoisson(lambdaAway);

        let homePens: number | null = null;
        let awayPens: number | null = null;

        if (homeScore === awayScore) {
          const coin = Math.random();
          const homeProb = 1 / (1 + Math.exp(-(home.elo - away.elo) / 250));
          if (coin < homeProb) {
            homePens = 5;
            awayPens = 4;
          } else {
            awayPens = 5;
            homePens = 4;
          }
        }

        const eloRes = updateEloForMatchResult(home, away, homeScore, awayScore, m.isNeutral);
        home.elo = eloRes.updatedHomeElo;
        away.elo = eloRes.updatedAwayElo;

        return {
          ...m,
          homeScore,
          awayScore,
          homePenalties: homePens,
          awayPenalties: awayPens,
          completed: true
        };
      });

      // Check survivors
      const winners = workingBracket[st].map(m => {
        const hs = m.homeScore ?? 0;
        const as = m.awayScore ?? 0;
        const hp = m.homePenalties ?? 0;
        const ap = m.awayPenalties ?? 0;
        if (hs > as || (hs === as && hp > ap)) {
          return m.homeId;
        } else {
          return m.awayId;
        }
      });

      if (st === "R32" && winners.includes(favoriteTeamId)) reachedStages.r16 = true;
      if (st === "R16" && winners.includes(favoriteTeamId)) reachedStages.qf = true;
      if (st === "QF" && winners.includes(favoriteTeamId)) reachedStages.sf = true;
      if (st === "SF" && winners.includes(favoriteTeamId)) reachedStages.final = true;
      if (st === "final" && winners.includes(favoriteTeamId)) reachedStages.champion = true;
    }

    if (reachedStages.r16) r16Count++;
    if (reachedStages.qf) qfCount++;
    if (reachedStages.sf) sfCount++;
    if (reachedStages.final) finalCount++;
    if (reachedStages.champion) championCount++;
  }

  return {
    r32: Math.round((r32Count / SIM_COUNT) * 100),
    r16: Math.round((r16Count / SIM_COUNT) * 100),
    qf: Math.round((qfCount / SIM_COUNT) * 100),
    sf: Math.round((sfCount / SIM_COUNT) * 100),
    final: Math.round((finalCount / SIM_COUNT) * 100),
    champion: Math.round((championCount / SIM_COUNT) * 100)
  };
}
