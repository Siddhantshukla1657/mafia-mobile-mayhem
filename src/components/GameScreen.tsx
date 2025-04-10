
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { SetupScreen } from './SetupScreen';
import { NightPhase } from './NightPhase';
import { SummaryPhase } from './SummaryPhase';
import { DayPhase } from './DayPhase';
import { GameOver } from './GameOver';

export const GameScreen: React.FC = () => {
  const { state } = useGame();
  const { gamePhase, winner } = state;
  
  // Show game over screen if a winner is determined
  if (winner) {
    return <GameOver />;
  }
  
  // Render the appropriate phase
  switch (gamePhase) {
    case 'setup':
      return <SetupScreen />;
    case 'night':
      return <NightPhase />;
    case 'summary':
      return <SummaryPhase />;
    case 'day':
      return <DayPhase />;
    default:
      return <div>Loading...</div>;
  }
};
