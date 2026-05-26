export type GameLoopCallbacks = {
  update: (dt: number) => void
  draw: () => void
}

export type GameLoop = {
  start: () => void
  stop: () => void
}

export function createGameLoop({ update, draw }: GameLoopCallbacks): GameLoop {
  let rafId = 0
  let lastTime = 0
  let running = false

  const frame = (now: number) => {
    if (!running) return

    const dt = lastTime === 0 ? 0 : Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    update(dt)
    draw()

    rafId = requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      lastTime = 0
      rafId = requestAnimationFrame(frame)
    },
    stop() {
      running = false
      cancelAnimationFrame(rafId)
    },
  }
}
