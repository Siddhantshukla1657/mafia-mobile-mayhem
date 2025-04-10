
import React from 'react';
import { RoleCard } from './RoleCard';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const NightPhase: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, currentPlayerIndex, currentRound } = state;
  
  // Get the current player who needs to act
  const currentPlayer = players[currentPlayerIndex];
  
  // Get available targets (all other living players)
  const availableTargets = players
    .filter(player => player.isAlive && player.id !== currentPlayer.id)
    .map(player => ({ id: player.id, name: player.name }));
  
  const handleActionComplete = (targetId: string | null, actionType: 'kill' | 'investigate' | 'heal' | 'none') => {
    dispatch({
      type: 'RECORD_ACTION',
      payload: {
        playerId: currentPlayer.id,
        targetId,
        actionType
      }
    });
  };
  
  // If night phase is complete, show the end night button
  if (players.every(player => !player.isAlive || player.hasActed)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="bg-mafia-card text-mafia-text shadow-xl border-mafia-primary">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Night Phase Complete</h2>
            <p className="text-center mb-6">All players have taken their actions.</p>
            <Button 
              onClick={() => dispatch({ type: 'END_NIGHT' })}
              className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
            >
              View Night Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-mafia-primary mb-6">
        Night {currentRound} - {currentPlayer.name}'s Turn
      </h1>
      
      <RoleCard 
        playerName={currentPlayer.name}
        role={currentPlayer.role}
        onActionComplete={handleActionComplete}
        availableTargets={availableTargets}
        key={`${currentRound}-${currentPlayer.id}`} /* Force re-render on player change */
      />
    </div>
  );
};
