
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';

export const SetupScreen: React.FC = () => {
  const { dispatch } = useGame();
  const { toast } = useToast();
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(5).fill(''));
  const [mafiaCount, setMafiaCount] = useState<number>(1);
  const [healerCount, setHealerCount] = useState<number>(1);
  const [copCount] = useState<number>(1); // Fixed at 1

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handlePlayerCountChange = (value: number[]) => {
    const count = value[0];
    setPlayerCount(count);
    
    // Adjust player names array
    if (count > playerNames.length) {
      setPlayerNames([...playerNames, ...Array(count - playerNames.length).fill('')]);
    } else {
      setPlayerNames(playerNames.slice(0, count));
    }
    
    // Adjust role counts if needed
    if (mafiaCount + healerCount + copCount > count) {
      setMafiaCount(Math.max(1, count - healerCount - copCount));
    }
  };

  const handleMafiaCountChange = (value: number[]) => {
    const count = value[0];
    setMafiaCount(count);
  };

  const handleHealerCountChange = (value: number[]) => {
    const count = value[0];
    setHealerCount(count);
  };

  const handleStartGame = () => {
    // Validate player names
    if (playerNames.some(name => !name.trim())) {
      toast({
        title: "Missing Information",
        description: "Please enter names for all players.",
        variant: "destructive"
      });
      return;
    }

    // Validate role counts
    if (mafiaCount + healerCount + copCount > playerCount) {
      toast({
        title: "Invalid Role Count",
        description: "The total number of special roles cannot exceed the number of players.",
        variant: "destructive"
      });
      return;
    }

    // Start the game
    dispatch({
      type: 'SETUP_GAME',
      payload: {
        playerNames,
        mafiaCount,
        healerCount,
        copCount
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="bg-mafia-card text-mafia-text shadow-xl border-mafia-primary">
        <CardHeader className="border-b border-mafia-primary pb-4">
          <CardTitle className="text-2xl font-bold text-center text-mafia-primary">
            Mafia Mayhem
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Number of Players: {playerCount}</h3>
              <Slider 
                value={[playerCount]} 
                onValueChange={handlePlayerCountChange} 
                min={4} 
                max={15} 
                step={1} 
                className="my-4"
              />
            </div>

            <div className="space-y-4">
              {playerNames.map((name, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`player-${index}`}>Player {index + 1}</Label>
                  <Input
                    id={`player-${index}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Enter player ${index + 1} name`}
                    className="bg-mafia-dark text-mafia-text border-mafia-primary"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Role Settings</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Mafia: {mafiaCount}</Label>
                  <span className="text-sm text-mafia-secondary">Min: 1</span>
                </div>
                <Slider 
                  value={[mafiaCount]} 
                  onValueChange={handleMafiaCountChange} 
                  min={1} 
                  max={Math.max(1, Math.floor(playerCount / 2))} 
                  step={1} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Healers: {healerCount}</Label>
                  <span className="text-sm text-mafia-secondary">Optional</span>
                </div>
                <Slider 
                  value={[healerCount]} 
                  onValueChange={handleHealerCountChange} 
                  min={0} 
                  max={Math.max(0, playerCount - mafiaCount - copCount)} 
                  step={1} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Cops: {copCount}</Label>
                  <span className="text-sm text-mafia-secondary">Fixed</span>
                </div>
                <div className="h-2 bg-mafia-primary rounded-full opacity-50"></div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <Label>Villagers:</Label>
                  <span>{playerCount - mafiaCount - healerCount - copCount}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            onClick={handleStartGame}
            className="w-full bg-mafia-primary hover:bg-mafia-primary/80 text-white"
          >
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
