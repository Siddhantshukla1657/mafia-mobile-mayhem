import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameState, Player, PlayerRole, NightAction, RoundSummary } from '../models/GameTypes';

// Define action types
type GameAction =
  | { type: 'SETUP_GAME'; payload: { playerNames: string[]; mafiaCount: number; healerCount: number; copCount: number } }
  | { type: 'START_NIGHT' }
  | { type: 'RECORD_ACTION'; payload: { playerId: string; targetId: string | null; actionType: 'kill' | 'investigate' | 'heal' | 'none' } }
  | { type: 'END_NIGHT' }
  | { type: 'ELIMINATE_PLAYER'; payload: { playerId: string } }
  | { type: 'START_NEW_ROUND' }
  | { type: 'RESET_GAME' };

// Initial game state
const initialGameState: GameState = {
  players: [],
  settings: {
    mafiaCount: 0,
    healerCount: 0,
    copCount: 0,
  },
  nightActions: [],
  currentRound: 0,
  gamePhase: 'setup',
  currentPlayerIndex: -1,
  roundSummary: null,
  winner: null,
};

// Create context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

// Helper functions
const assignRoles = (playerNames: string[], mafiaCount: number, healerCount: number, copCount: number): Player[] => {
  // Create array of roles
  const roles: PlayerRole[] = [];
  
  // Add required roles
  for (let i = 0; i < mafiaCount; i++) roles.push('mafia');
  for (let i = 0; i < healerCount; i++) roles.push('healer');
  for (let i = 0; i < copCount; i++) roles.push('cop');
  
  // Fill the rest with villagers
  const villagerCount = playerNames.length - roles.length;
  for (let i = 0; i < villagerCount; i++) roles.push('villager');
  
  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  
  // Assign roles to players
  return playerNames.map((name, index) => ({
    id: uuidv4(),
    name,
    role: roles[index],
    isAlive: true,
    hasActed: false,
  }));
};

const checkWinCondition = (players: Player[]): 'mafia' | 'villagers' | null => {
  const alivePlayers = players.filter(player => player.isAlive);
  const aliveMafia = alivePlayers.filter(player => player.role === 'mafia');
  const aliveVillagers = alivePlayers.filter(player => player.role !== 'mafia');
  
  if (aliveMafia.length === 0) {
    return 'villagers';
  }
  
  if (aliveMafia.length >= aliveVillagers.length) {
    return 'mafia';
  }
  
  return null;
};

const processNightActions = (players: Player[], nightActions: NightAction[]): RoundSummary => {
  const mafiaActions = nightActions.filter(action => 
    action.actionType === 'kill' && 
    players.find(p => p.id === action.playerId)?.role === 'mafia'
  );
  
  const healerActions = nightActions.filter(action => 
    action.actionType === 'heal' && 
    players.find(p => p.id === action.playerId)?.role === 'healer'
  );
  
  const copActions = nightActions.filter(action => 
    action.actionType === 'investigate' && 
    players.find(p => p.id === action.playerId)?.role === 'cop'
  );

  // Find the target of mafia's kill action
  const targetToKill = mafiaActions.length > 0 ? mafiaActions[0].targetId : null;
  
  // Check if healer healed the target
  const wasHealed = targetToKill !== null && 
    healerActions.some(action => action.targetId === targetToKill);
  
  // Check if cop found a mafia
  let copFoundMafia = false;
  if (copActions.length > 0 && copActions[0].targetId) {
    const investigatedPlayer = players.find(p => p.id === copActions[0].targetId);
    copFoundMafia = investigatedPlayer?.role === 'mafia' || false;
  }
  
  return {
    killedPlayerId: wasHealed ? null : targetToKill,
    wasHealed,
    copFoundMafia,
    eliminatedPlayerId: null,
    eliminatedPlayerRole: null
  };
};

// Reducer to handle state changes
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SETUP_GAME': {
      const { playerNames, mafiaCount, healerCount, copCount } = action.payload;
      const players = assignRoles(playerNames, mafiaCount, healerCount, copCount);
      
      return {
        ...state,
        players,
        settings: { mafiaCount, healerCount, copCount },
        currentRound: 1,
        gamePhase: 'night',
        currentPlayerIndex: 0,
        nightActions: [],
        roundSummary: null,
        winner: null,
      };
    }
    
    case 'START_NIGHT': {
      // Reset actions for the new night phase
      const players = state.players.map(player => ({ 
        ...player, 
        hasActed: false 
      }));
      
      // Find the first living player
      const firstLivingIndex = players.findIndex(player => player.isAlive);
      
      return {
        ...state,
        players,
        nightActions: [],
        gamePhase: 'night',
        currentPlayerIndex: firstLivingIndex,
      };
    }
    
    case 'RECORD_ACTION': {
      const { playerId, targetId, actionType } = action.payload;
      
      // Add the action
      const nightActions = [
        ...state.nightActions,
        { playerId, targetId, actionType }
      ];
      
      // Mark this player as having acted
      const players = state.players.map(player =>
        player.id === playerId ? { ...player, hasActed: true } : player
      );
      
      // Find next living player who hasn't acted
      let nextPlayerIndex = state.currentPlayerIndex;
      let allPlayersActed = true;
      
      for (let i = 0; i < players.length; i++) {
        // Start from the next player
        const index = (state.currentPlayerIndex + i + 1) % players.length;
        const player = players[index];
        
        if (player.isAlive && !player.hasActed) {
          nextPlayerIndex = index;
          allPlayersActed = false;
          break;
        }
      }
      
      // If all players have acted, process the night phase
      if (allPlayersActed) {
        const roundSummary = processNightActions(players, nightActions);
        
        // Apply the kill if not healed
        const updatedPlayers = roundSummary.killedPlayerId 
          ? players.map(player => 
              player.id === roundSummary.killedPlayerId 
                ? { ...player, isAlive: false } 
                : player
            )
          : players;
        
        return {
          ...state,
          players: updatedPlayers,
          nightActions,
          gamePhase: 'summary',
          roundSummary,
          winner: checkWinCondition(updatedPlayers),
        };
      }
      
      // Otherwise, continue with next player
      return {
        ...state,
        players,
        nightActions,
        currentPlayerIndex: nextPlayerIndex,
      };
    }
    
    case 'END_NIGHT': {
      return {
        ...state,
        gamePhase: 'day',
      };
    }
    
    case 'ELIMINATE_PLAYER': {
      const { playerId } = action.payload;
      const eliminatedPlayer = state.players.find(p => p.id === playerId);
      
      if (!eliminatedPlayer) return state;
      
      // Mark player as eliminated
      const players = state.players.map(player =>
        player.id === playerId ? { ...player, isAlive: false } : player
      );
      
      // Update the round summary
      const roundSummary = state.roundSummary ? {
        ...state.roundSummary,
        eliminatedPlayerId: playerId,
        eliminatedPlayerRole: eliminatedPlayer.role
      } : null;
      
      // Check win condition
      const winner = checkWinCondition(players);
      
      return {
        ...state,
        players,
        roundSummary,
        winner,
      };
    }
    
    case 'START_NEW_ROUND': {
      return {
        ...state,
        currentRound: state.currentRound + 1,
        gamePhase: 'night',
        currentPlayerIndex: state.players.findIndex(player => player.isAlive),
        nightActions: [],
        roundSummary: null,
        players: state.players.map(player => ({
          ...player,
          hasActed: false
        })),
      };
    }
    
    case 'RESET_GAME': {
      return initialGameState;
    }
    
    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
