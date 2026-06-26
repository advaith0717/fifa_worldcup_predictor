/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string;
  name: string;
  flag: string;
  color: string;
  elo: number;
  initialElo: number;
  form: number; // 0.0 to 1.0 representation of recent form
  goalsScoredAvg: number;
  goalsConcededAvg: number;
  cleanSheetRate: number;
  lateGoalRate: number; // Rate of goals scored after 75 mins
  penShare: number; // Share of goals scored via penalties (lower = higher open-play strength)
  streak: number; // Current streak (+3 = 3 wins, -2 = 2 losses)
  group: string; // Group letter A to L
}

export interface Match {
  id: number;
  homeId: string; // "TBD" if not yet resolved
  awayId: string; // "TBD" if not yet resolved
  homePlaceholder?: string; // e.g. "1st Group A"
  awayPlaceholder?: string; // e.g. "2nd Group B"
  homeScore: number | null;
  awayScore: number | null;
  homePenalties?: number | null;
  awayPenalties?: number | null;
  stage: "group" | "R32" | "R16" | "QF" | "SF" | "third" | "final";
  groupLetter?: string;
  isNeutral: boolean;
  neutralVenueWeight: number; // 1.0 for World Cup match
  completed: boolean;
  date?: string; // YYYY-MM-DD format
  
  // Model prediction outputs
  drawProbability: number;
  homeWinProbability: number;
  awayWinProbability: number;
  predictedWinnerId: string;
  
  // Custom manual intervention override
  isSimulatedByUser?: boolean;
}

export interface TeamRecord {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export interface Group {
  letter: string;
  teams: string[]; // Team IDs
  matches: number[]; // Match IDs
  standings: TeamRecord[];
}

export interface BracketStage {
  R32: Match[];
  R16: Match[];
  QF: Match[];
  SF: Match[];
  third: Match[];
  final: Match[];
}

export interface ModelMetricsLog {
  version: string;
  date: string;
  decisiveAccuracy: number; // Stage 2 accuracy (target: 80.5%)
  combinedAccuracy: number; // Stage 1+2 accuracy (target: 62%)
  totalMatchesTrained: number;
}
