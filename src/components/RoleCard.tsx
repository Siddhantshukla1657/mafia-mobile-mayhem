
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayerRole } from '@/models/GameTypes';

// Import Icons
import { Skull, User } from 'lucide-react';
import { MagnifyingGlass } from './icons/MagnifyingGlass';
import { Heart } from './icons/Heart';

interface RoleCardProps {
  playerName: string;
  role: PlayerRole;
  onActionComplete: (targetId: string | null, actionType: 'kill' | 'investigate' | 'heal' | 'none') => void;
  availableTargets: { id: string, name: string }[];
}

export const RoleCard: React.FC<RoleCardProps> = ({ 
  playerName, role, onActionComplete, availableTargets 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTargetSelection, setShowTargetSelection] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(true);
    
    // For villager role, complete action after delay
    if (role === 'villager') {
      setTimeout(() => {
        onActionComplete(null, 'none');
      }, 3000);
    } else {
      // For roles that need target selection
      setTimeout(() => {
        setShowTargetSelection(true);
      }, 3000);
    }
  };
  
  const handleTargetSelect = (targetId: string) => {
    let actionType: 'kill' | 'investigate' | 'heal' | 'none' = 'none';
    
    switch (role) {
      case 'mafia':
        actionType = 'kill';
        break;
      case 'cop':
        actionType = 'investigate';
        break;
      case 'healer':
        actionType = 'heal';
        break;
      default:
        actionType = 'none';
    }
    
    onActionComplete(targetId, actionType);
  };
  
  const getRoleIcon = () => {
    switch (role) {
      case 'mafia':
        return <Skull className="h-16 w-16 text-mafia-accent" />;
      case 'cop':
        return <MagnifyingGlass className="h-16 w-16 text-mafia-secondary" />;
      case 'healer':
        return <Heart className="h-16 w-16 text-green-500" />;
      case 'villager':
      default:
        return <User className="h-16 w-16 text-mafia-text" />;
    }
  };
  
  const getRoleColor = () => {
    switch (role) {
      case 'mafia':
        return 'bg-gradient-to-br from-mafia-dark to-mafia-accent/30 border-mafia-accent';
      case 'cop':
        return 'bg-gradient-to-br from-mafia-dark to-blue-900 border-blue-500';
      case 'healer':
        return 'bg-gradient-to-br from-mafia-dark to-green-900 border-green-500';
      case 'villager':
      default:
        return 'bg-gradient-to-br from-mafia-dark to-mafia-card border-mafia-primary';
    }
  };
  
  const getRoleText = () => {
    switch (role) {
      case 'mafia':
        return "You are Mafia. Choose a player to eliminate.";
      case 'cop':
        return "You are the Cop. Choose a player to investigate.";
      case 'healer':
        return "You are a Healer. Choose a player to protect.";
      case 'villager':
      default:
        return "You are a Villager. You have no special action.";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md flex items-center justify-center min-h-[70vh]">
      {!showTargetSelection ? (
        <div className="card-container w-full max-w-xs perspective-1000">
          <div className={`card ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-front">
              <Card className="w-full h-80 flex flex-col items-center justify-center bg-mafia-card border-2 border-mafia-primary cursor-pointer shadow-xl hover:shadow-2xl hover:border-mafia-accent transition-all duration-300" onClick={handleFlip}>
                <div className="text-center p-6">
                  <h2 className="text-2xl font-bold mb-2">{playerName}'s Turn</h2>
                  <p className="text-mafia-secondary mb-6">Tap to reveal your role</p>
                  <div className="w-20 h-20 mx-auto bg-mafia-primary/30 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-4xl">?</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="card-back">
              <Card className={`w-full h-80 flex flex-col items-center justify-center ${getRoleColor()} border-2 shadow-xl`}>
                <div className="text-center p-6">
                  <h2 className="text-xl font-bold mb-4">{playerName}</h2>
                  <div className="mb-4">{getRoleIcon()}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </h3>
                  <p className="text-sm opacity-80">{getRoleText()}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card className="w-full bg-mafia-card border border-mafia-primary shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">{playerName}, choose your target</h2>
            <div className="space-y-2">
              {availableTargets.map((target) => (
                <Button
                  key={target.id}
                  onClick={() => handleTargetSelect(target.id)}
                  className="w-full bg-mafia-dark hover:bg-mafia-primary text-mafia-text mb-2"
                >
                  {target.name}
                </Button>
              ))}
              
              {/* Skip option only for healer since they can choose not to heal */}
              {role === 'healer' && (
                <Button
                  onClick={() => onActionComplete(null, 'heal')}
                  className="w-full bg-mafia-accent/40 hover:bg-mafia-accent text-mafia-text"
                >
                  Skip healing this round
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
