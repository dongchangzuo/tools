export type Vec2 = {
  x: number
  y: number
}

export type GameState = {
  player: Vec2
  velocity: Vec2
  fps: number
}

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
