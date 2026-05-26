import { useEffect, useRef } from 'react'
import { drawRealisticBalance } from '../game/balanceDrawRealistic.ts'
import { BALANCE_HEIGHT, BALANCE_WIDTH, hitTestPan } from '../game/balanceGeometry.ts'
import { createGameLoop } from '../game/loop.ts'
import type { CheckStatus } from '../game/balanceLogic.ts'
import type { ActiveTray } from '../hooks/useBalanceGame.ts'

type BalanceCanvasProps = {
  tiltRad: number
  checkStatus: CheckStatus
  leftExpression: string
  rightExpression: string
  activeTray: ActiveTray
  animTime: number
  imbalanceEpoch: number
  onSelectTray: (tray: ActiveTray) => void
}

export function BalanceCanvas({
  tiltRad,
  checkStatus,
  leftExpression,
  rightExpression,
  activeTray,
  animTime,
  imbalanceEpoch,
  onSelectTray,
}: BalanceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = createGameLoop({
      update(dt) {
        flashRef.current += dt
      },
      draw() {
        ctx.clearRect(0, 0, BALANCE_WIDTH, BALANCE_HEIGHT)
        drawRealisticBalance(ctx, {
          tiltRad,
          checkStatus,
          leftExpression,
          rightExpression,
          activeTray,
          flashPhase: flashRef.current,
          animTime,
        })
      },
    })
    loop.start()

    return () => loop.stop()
  }, [tiltRad, checkStatus, leftExpression, rightExpression, activeTray, animTime, imbalanceEpoch])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = BALANCE_WIDTH / rect.width
    const scaleY = BALANCE_HEIGHT / rect.height
    const mx = (event.clientX - rect.left) * scaleX
    const my = (event.clientY - rect.top) * scaleY
    const hit = hitTestPan(mx, my, tiltRad)
    if (hit) onSelectTray(hit)
  }

  return (
    <canvas
      ref={canvasRef}
      className="balance-canvas"
      width={BALANCE_WIDTH}
      height={BALANCE_HEIGHT}
      onClick={handleClick}
      aria-label="数学等式天平，点击左右托盘选择输入位置"
      role="img"
    />
  )
}
