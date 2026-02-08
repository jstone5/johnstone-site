// AABB Collision Detection for Book Platformer

import type { AABB, BookPlatform, Player } from './types';
import { GAME_CONFIG } from './physics';

export function createPlayerAABB(player: Player): AABB {
  return {
    x: player.position.x,
    y: player.position.y,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
  };
}

export function createPlatformAABB(platform: BookPlatform): AABB {
  // Only the top surface of the book is collidable
  return {
    x: platform.x,
    y: platform.y,
    width: platform.width,
    height: 10, // Thin collision zone on top
  };
}

export function aabbIntersects(a: AABB, b: AABB): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function checkPlatformCollision(
  player: Player,
  platform: BookPlatform,
  previousY: number
): boolean {
  const playerAABB = createPlayerAABB(player);
  const platformTop = platform.y;
  const playerBottom = player.position.y + GAME_CONFIG.PLAYER_HEIGHT;
  const previousPlayerBottom = previousY + GAME_CONFIG.PLAYER_HEIGHT;

  // Check if player is within horizontal bounds of platform
  const horizontalOverlap =
    player.position.x + GAME_CONFIG.PLAYER_WIDTH > platform.x &&
    player.position.x < platform.x + platform.width;

  // Check if player is falling through the top of the platform
  const fallingThrough =
    previousPlayerBottom <= platformTop &&
    playerBottom >= platformTop;

  // Check if player is standing on platform
  const standingOn =
    playerBottom >= platformTop &&
    playerBottom <= platformTop + 15 &&
    player.velocity.y >= 0;

  return horizontalOverlap && (fallingThrough || standingOn);
}

export function resolvePlatformCollision(
  player: Player,
  platform: BookPlatform
): Player {
  return {
    ...player,
    position: {
      ...player.position,
      y: platform.y - GAME_CONFIG.PLAYER_HEIGHT,
    },
    velocity: {
      ...player.velocity,
      y: 0,
    },
    isGrounded: true,
    isJumping: false,
  };
}

export function checkGroundCollision(
  player: Player,
  groundY: number
): boolean {
  const playerBottom = player.position.y + GAME_CONFIG.PLAYER_HEIGHT;
  return playerBottom >= groundY;
}

export function resolveGroundCollision(
  player: Player,
  groundY: number
): Player {
  return {
    ...player,
    position: {
      ...player.position,
      y: groundY - GAME_CONFIG.PLAYER_HEIGHT,
    },
    velocity: {
      ...player.velocity,
      y: 0,
    },
    isGrounded: true,
    isJumping: false,
  };
}

export function checkFlagpoleCollision(
  player: Player,
  flagpoleX: number
): boolean {
  const playerRight = player.position.x + GAME_CONFIG.PLAYER_WIDTH;
  return playerRight >= flagpoleX;
}

export function isPointInPlatform(
  x: number,
  y: number,
  platform: BookPlatform
): boolean {
  return (
    x >= platform.x &&
    x <= platform.x + platform.width &&
    y >= platform.y &&
    y <= platform.y + platform.height
  );
}
