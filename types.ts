
export enum GameState {
  START = 'START',
  LEVEL_SELECTION = 'LEVEL_SELECTION',
  PLAYING = 'PLAYING',
  BIRD_VIEW = 'BIRD_VIEW',
  RESULT = 'RESULT',
  GALLERY = 'GALLERY',
  SUMMARY = 'SUMMARY'
}

export enum LevelId {
  GLASS_MAZE = 'GLASS_MAZE',
  LIGHT_TRAP = 'LIGHT_TRAP',
  AERIAL_SNARE = 'AERIAL_SNARE'
}

export interface Bird {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  status: 'common' | 'vulnerable' | 'endangered';
  unlocked: boolean;
  image: string;
}

export interface PlayerStats {
  budget: number;
  satisfaction: number;
  birdsSaved: number;
  totalBirds: number;
}

export interface LevelConfig {
  id: LevelId;
  title: string;
  subtitle: string;
  description: string;
  budget: number;
  maxSatisfaction: number;
}
