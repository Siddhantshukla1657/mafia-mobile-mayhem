
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { GameScreen } from '@/components/GameScreen';

const Index = () => {
  return (
    <div className="min-h-screen bg-mafia-background text-mafia-text flex flex-col">
      <header className="py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-mafia-primary">Mafia Mayhem</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <GameProvider>
          <GameScreen />
        </GameProvider>
      </main>
      
      <footer className="py-4 text-center text-mafia-secondary text-sm">
        <p>Play with friends - pass the device around!</p>
      </footer>
    </div>
  );
};

export default Index;
