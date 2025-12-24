
import React, { useState, useEffect } from 'react';
import { GameState, LevelId, PlayerStats, Bird } from './types';
import { INITIAL_BIRDS, LEVELS } from './constants';
import StartScreen from './components/StartScreen';
import LevelSelection from './components/LevelSelection';
import Gameplay from './components/Gameplay';
import Summary from './components/Summary';
import Gallery from './components/Gallery';
import Header from './components/Header';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentLevel, setCurrentLevel] = useState<LevelId | null>(null);
  const [stats, setStats] = useState<PlayerStats>({
    budget: 1000,
    satisfaction: 100,
    birdsSaved: 0,
    totalBirds: 0,
  });
  const [unlockedBirds, setUnlockedBirds] = useState<Bird[]>(INITIAL_BIRDS);

  const handleStart = () => setGameState(GameState.LEVEL_SELECTION);
  
  const handleSelectLevel = (levelId: LevelId) => {
    setCurrentLevel(levelId);
    setGameState(GameState.PLAYING);
  };

  const handleLevelComplete = (newStats: Partial<PlayerStats>, newlyUnlockedBirds: string[]) => {
    setStats(prev => ({
      ...prev,
      budget: prev.budget - (newStats.budget || 0), // Spent amount
      satisfaction: Math.min(100, Math.max(0, prev.satisfaction + (newStats.satisfaction || 0))),
      birdsSaved: prev.birdsSaved + (newStats.birdsSaved || 0),
      totalBirds: prev.totalBirds + (newStats.totalBirds || 0),
    }));

    if (newlyUnlockedBirds.length > 0) {
      setUnlockedBirds(prev => prev.map(b => 
        newlyUnlockedBirds.includes(b.id) ? { ...b, unlocked: true } : b
      ));
    }
    
    setGameState(GameState.LEVEL_SELECTION);
  };

  const handleUniversalBack = () => {
    switch (gameState) {
      case GameState.LEVEL_SELECTION:
        setGameState(GameState.START);
        break;
      case GameState.PLAYING:
      case GameState.GALLERY:
      case GameState.SUMMARY:
        setGameState(GameState.LEVEL_SELECTION);
        break;
      default:
        break;
    }
  };

  const resetGame = () => {
    setStats({
      budget: 1000,
      satisfaction: 100,
      birdsSaved: 0,
      totalBirds: 0,
    });
    setUnlockedBirds(INITIAL_BIRDS.map(b => ({ ...b, unlocked: false })));
    setGameState(GameState.START);
  };

  const showSummary = () => setGameState(GameState.SUMMARY);
  const showGallery = () => setGameState(GameState.GALLERY);
  const backToMenu = () => setGameState(GameState.LEVEL_SELECTION);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-emerald-50 text-slate-800">
      {gameState === GameState.START && (
        <StartScreen onStart={handleStart} />
      )}

      {gameState !== GameState.START && (
        <Header 
          stats={stats} 
          onShowGallery={showGallery} 
          onShowSummary={showSummary} 
          onBack={handleUniversalBack}
          gameState={gameState}
        />
      )}

      {gameState === GameState.LEVEL_SELECTION && (
        <LevelSelection onSelect={handleSelectLevel} onFinish={showSummary} />
      )}

      {gameState === GameState.PLAYING && currentLevel && (
        <Gameplay 
          level={LEVELS[currentLevel]} 
          onComplete={handleLevelComplete} 
          onBack={backToMenu}
        />
      )}

      {gameState === GameState.GALLERY && (
        <Gallery birds={unlockedBirds} onBack={backToMenu} />
      )}

      {gameState === GameState.SUMMARY && (
        <Summary stats={stats} onRestart={resetGame} />
      )}
    </div>
  );
};

export default App;
