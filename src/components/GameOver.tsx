
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, User } from 'lucide-react';

export const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players, winner } = state;
  
  // Get players by role for the reveal
  const mafia = players.filter(player => player.role === 'mafia');
  const cops = players.filter(player => player.role === 'cop');
  const healers = players.filter(player => player.role === 'healer');
  const villagers = players.filter(player => player.role === 'villager');
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="bg-mafia-card text-mafia-text shadow-xl border-mafia-primary">
        <CardHeader className="bg-gradient-to-r from-mafia-primary to-mafia-accent/80 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Game Over - {winner === 'mafia' ? 'Mafia' : 'Villagers'} Win!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Mafia players */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Skull className="h-5 w-5 text-mafia-accent" />
              <h3 className="text-lg font-medium text-mafia-accent">Mafia</h3>
            </div>
            
            <ul className="pl-7 space-y-1">
              {mafia.map(player => (
                <li key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <span className={!player.isAlive ? "text-mafia-accent" : "text-green-500"}>
                    {player.isAlive ? "Alive" : "Dead"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cop players */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MagnifyingGlass className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-medium text-blue-400">Cops</h3>
            </div>
            
            <ul className="pl-7 space-y-1">
              {cops.map(player => (
                <li key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <span className={!player.isAlive ? "text-mafia-accent" : "text-green-500"}>
                    {player.isAlive ? "Alive" : "Dead"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Healer players */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-medium text-green-400">Healers</h3>
            </div>
            
            <ul className="pl-7 space-y-1">
              {healers.map(player => (
                <li key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <span className={!player.isAlive ? "text-mafia-accent" : "text-green-500"}>
                    {player.isAlive ? "Alive" : "Dead"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Villager players */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-5 w-5 text-mafia-text" />
              <h3 className="text-lg font-medium">Villagers</h3>
            </div>
            
            <ul className="pl-7 space-y-1">
              {villagers.map(player => (
                <li key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <span className={!player.isAlive ? "text-mafia-accent" : "text-green-500"}>
                    {player.isAlive ? "Alive" : "Dead"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            onClick={handleNewGame}
            className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
          >
            Start New Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Import MagnifyingGlass and Heart icons
import { MagnifyingGlass } from './icons/MagnifyingGlass';
import { Heart } from './icons/Heart';
