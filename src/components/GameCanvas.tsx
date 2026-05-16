import { useEffect, useRef } from 'react'
import { createGameLoop } from '../game/loop'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type GameState,
} from '../game/types'

const PLAYER_SIZE = 48
const PLAYER_SPEED = 220

function createInitialState(): GameState {
  return {
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
      y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2,
    },
    velocity: { x: PLAYER_SPEED, y: PLAYER_SPEED * 0.75 },
    fps: 0,
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(createInitialState())
  const fpsSamplesRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = stateRef.current

    const loop = createGameLoop({
      update(dt) {
        state.player.x += state.velocity.x * dt
        state.player.y += state.velocity.y * dt

        if (
          state.player.x <= 0 ||
          state.player.x + PLAYER_SIZE >= CANVAS_WIDTH
        ) {
          state.velocity.x *= -1
          state.player.x = Math.max(
            0,
            Math.min(state.player.x, CANVAS_WIDTH - PLAYER_SIZE),
          )
        }

        if (
          state.player.y <= 0 ||
          state.player.y + PLAYER_SIZE >= CANVAS_HEIGHT
        ) {
          state.velocity.y *= -1
          state.player.y = Math.max(
            0,
            Math.min(state.player.y, CANVAS_HEIGHT - PLAYER_SIZE),
          )
        }

        if (dt > 0) {
          const fps = 1 / dt
          const samples = fpsSamplesRef.current
          samples.push(fps)
          if (samples.length > 30) samples.shift()
          state.fps =
            samples.reduce((sum, value) => sum + value, 0) / samples.length
        }
      },
      draw() {
        ctx.fillStyle = '#0f1117'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        ctx.fillStyle = '#5eead4'
        ctx.fillRect(
          state.player.x,
          state.player.y,
          PLAYER_SIZE,
          PLAYER_SIZE,
        )

        ctx.fillStyle = '#e2e8f0'
        ctx.font = '16px system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(`FPS: ${state.fps.toFixed(0)}`, 12, 12)
      },
    })

    loop.start()
    return () => loop.stop()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  )
}
