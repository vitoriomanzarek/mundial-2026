export type Confederation =
  | "CONMEBOL"
  | "UEFA"
  | "CONCACAF"
  | "AFC"
  | "CAF"
  | "OFC";

export interface Team {
  id: string;
  name: string;
  code: string;
  confederation: Confederation;
  groupId: string;
}

export interface Group {
  id: string;
  teamIds: string[];
}

export type HostCountry = "MEX" | "USA" | "CAN";

export interface Venue {
  id: string;
  stadium: string;
  city: string;
  country: HostCountry;
  capacity: number;
}

export type MatchPhase =
  | "groups"
  | "round32"
  | "round16"
  | "qf"
  | "sf"
  | "third"
  | "final";

export type MatchStatus = "scheduled" | "live" | "finished";

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  penalties?: { home: number; away: number };
}

export interface Match {
  id: string;
  phase: MatchPhase;
  groupId?: string;
  bracketSlot?: string;
  date: string;
  venueId: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  result?: MatchResult;
  status: MatchStatus;
}

export type QualificationZone = "direct" | "third" | null;

export interface StandingsRowView {
  teamId: string;
  name: string;
  code: string;
  played: number;
  goalDifference: number;
  points: number;
  qualification: QualificationZone;
}

export interface GroupView {
  id: string;
  rows: StandingsRowView[];
}

export interface StandingsRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
