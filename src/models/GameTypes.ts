
export type PlayerRole = 'mafia' | 'cop' | 'healer' | 'villager';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isAlive: boolean;
  hasActed: boolean; // For tracking actions in the night phase
}

export interface NightAction {
  playerId: string;
  targetId: string | null;
  actionType: 'kill' | 'investigate' | 'heal' | 'none';
}

export interface RoundSummary {
  killedPlayerId: string | null;
  wasHealed: boolean;
  copFoundMafia: boolean;
  eliminatedPlayerId: string | null;
  eliminatedPlayerRole: PlayerRole | null;
}

export interface GameSettings {
  mafiaCount: number;
  healerCount: number;
  copCount: number; // Typically 1
}

export interface GameState {
  players: Player[];
  settings: GameSettings;
  nightActions: NightAction[];
  currentRound: number;
  gamePhase: 'setup' | 'night' | 'summary' | 'day' | 'gameOver';
  currentPlayerIndex: number; // For tracking whose turn it is during night phase
  roundSummary: RoundSummary | null;
  winner: 'mafia' | 'villagers' | null;
}
