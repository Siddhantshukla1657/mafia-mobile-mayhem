
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skull } from 'lucide-react';

export const DayPhase: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, currentRound, winner } = state;
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  const livingPlayers = players.filter(player => player.isAlive);
  
  const handleEliminatePlayer = () => {
    if (!selectedPlayerId) return;
    
    dispatch({
      type: 'ELIMINATE_PLAYER',
      payload: {
        playerId: selectedPlayerId
      }
    });
  };
  
  const handleNextRound = () => {
    dispatch({ type: 'START_NEW_ROUND' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="bg-mafia-card text-mafia-text shadow-xl border-mafia-primary">
        <CardHeader className="border-b border-mafia-primary pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Day {currentRound} - Voting Phase
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Vote to eliminate:</h3>
            
            <RadioGroup value={selectedPlayerId || ""} onValueChange={setSelectedPlayerId}>
              {livingPlayers.map(player => (
                <div key={player.id} className="flex items-center space-x-2 mb-3 p-2 rounded-md hover:bg-mafia-dark">
                  <RadioGroupItem value={player.id} id={player.id} className="text-mafia-primary" />
                  <Label htmlFor={player.id} className="w-full cursor-pointer">{player.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {state.roundSummary?.eliminatedPlayerId && (
            <div className="bg-mafia-dark p-4 rounded-md">
              <div className="flex items-center space-x-3">
                <Skull className="h-6 w-6 text-mafia-accent" />
                <h3 className="font-medium">Eliminated:</h3>
              </div>
              
              <div className="mt-2 pl-9">
                <p className="text-mafia-text">
                  {players.find(p => p.id === state.roundSummary?.eliminatedPlayerId)?.name}
                </p>
                <p className="text-mafia-secondary text-sm">
                  Role: {state.roundSummary?.eliminatedPlayerRole?.charAt(0).toUpperCase() + 
                        state.roundSummary?.eliminatedPlayerRole?.slice(1)}
                </p>
              </div>
            </div>
          )}
          
          {winner && (
            <div className="bg-gradient-to-r from-mafia-primary to-mafia-accent/80 p-4 rounded-md">
              <h3 className="font-medium text-lg text-white">Game Over!</h3>
              <p className="text-white">
                {winner === 'mafia' 
                  ? 'The Mafia has won!' 
                  : 'The Villagers have won!'}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-4">
          {state.roundSummary?.eliminatedPlayerId || winner ? (
            winner ? (
              <Button 
                onClick={() => dispatch({ type: 'RESET_GAME' })}
                className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
              >
                Start New Game
              </Button>
            ) : (
              <Button 
                onClick={handleNextRound}
                className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
              >
                Start Next Round
              </Button>
            )
          ) : (
            <Button 
              onClick={handleEliminatePlayer}
              disabled={!selectedPlayerId}
              className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white disabled:opacity-50"
            >
              Eliminate Player
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
