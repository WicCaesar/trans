export interface OnlineGameState {
  ball: {
    x: number;
    y: number;
  };
  players: {
    [key: number]: {
      y: number;
    };
  };
  score: {
    [key: number]: number;
  };
  width: number;
  height: number;
  paddleHeight: number;
  paddleWidth: number;
}

export { Ball, Paddle, GameState as OfflineGameState } from './offline-pong.types.js';
