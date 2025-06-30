export interface OfflinePongModule {
  component: () => Promise<string>;
  init: () => Promise<void>;
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export interface GameState {
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  score1: number;
  score2: number;
  isPlaying: boolean;
  isPaused: boolean;
  winner: number | null;
}
