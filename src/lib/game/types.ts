// Game Types for Book Platformer

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2D;
  velocity: Vector2D;
  isGrounded: boolean;
  facingRight: boolean;
  animationFrame: number;
  isJumping: boolean;
}

export interface Camera {
  x: number;
  minX: number;
  maxX: number;
}

export interface BookPlatform {
  id: string;
  title: string;
  author: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  coverUrl?: string;
  amazonUrl?: string;
}

export interface GameState {
  player: Player;
  camera: Camera;
  platforms: BookPlatform[];
  flagpoleReached: boolean;
  gameStarted: boolean;
  showKeyboardHint: boolean;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface GameDimensions {
  width: number;
  height: number;
  groundY: number;
  worldWidth: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}
