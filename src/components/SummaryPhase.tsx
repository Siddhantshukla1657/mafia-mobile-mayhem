
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, Check } from 'lucide-react';
import { MagnifyingGlass } from './icons/MagnifyingGlass';
import { Heart } from './icons/Heart';

export const SummaryPhase: React.FC = () => {
  const { state, dispatch } = useGame();
  const { roundSummary, players, winner, currentRound } = state;
  
  if (!roundSummary) return null;
  
  const getKilledPlayerName = () => {
    if (!roundSummary.killedPlayerId) return 'No one';
    const player = players.find(p => p.id === roundSummary.killedPlayerId);
    return player ? player.name : 'Unknown Player';
  };

  const handleNextPhase = () => {
    dispatch({ type: 'END_NIGHT' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="bg-mafia-card text-mafia-text shadow-xl border-mafia-primary">
        <CardHeader className="border-b border-mafia-primary pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Night {currentRound} Summary
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Killed Summary */}
          <div className="bg-mafia-dark p-4 rounded-md flex items-center space-x-4">
            <div className="rounded-full bg-mafia-accent/20 p-3">
              <Skull className="h-8 w-8 text-mafia-accent" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Player Killed</h3>
              <p className={roundSummary.wasHealed ? "text-green-400" : "text-mafia-accent"}>
                {roundSummary.wasHealed 
                  ? 'Someone was targeted but healed!' 
                  : getKilledPlayerName()}
              </p>
            </div>
          </div>
          
          {/* Cop Summary */}
          <div className="bg-mafia-dark p-4 rounded-md flex items-center space-x-4">
            <div className="rounded-full bg-blue-500/20 p-3">
              <MagnifyingGlass className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Investigation</h3>
              <p>
                {roundSummary.copFoundMafia 
                  ? 'The Cop found a Mafia member!' 
                  : 'The Cop did not find any Mafia.'}
              </p>
            </div>
          </div>
          
          {/* Healer Summary */}
          <div className="bg-mafia-dark p-4 rounded-md flex items-center space-x-4">
            <div className="rounded-full bg-green-500/20 p-3">
              <Heart className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Healing</h3>
              <p>
                {roundSummary.wasHealed 
                  ? 'The Healer saved someone!' 
                  : 'No one was saved by the Healer.'}
              </p>
            </div>
          </div>
          
          {/* Display winner if game over */}
          {winner && (
            <div className="bg-gradient-to-r from-mafia-primary to-mafia-accent/80 p-4 rounded-md flex items-center space-x-4">
              <div className="rounded-full bg-white/20 p-3">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-white">Game Over!</h3>
                <p className="text-white">
                  {winner === 'mafia' 
                    ? 'The Mafia has won!' 
                    : 'The Villagers have won!'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-4">
          {winner ? (
            <Button 
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
            >
              Start New Game
            </Button>
          ) : (
            <Button 
              onClick={handleNextPhase}
              className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
            >
              Continue to Day Phase
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
