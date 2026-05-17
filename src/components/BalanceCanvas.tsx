import { useEffect, useRef } from 'react'
import { drawRealisticBalance } from '../game/balanceDrawRealistic.ts'
import { BALANCE_HEIGHT, BALANCE_WIDTH, hitTestPan } from '../game/balanceGeometry.ts'
import { createGameLoop } from '../game/loop.ts'
import type { CheckStatus } from '../game/balanceLogic.ts'
import type { ActiveTray } from '../hooks/useBalanceGame.ts'

type BalanceCanvasProps = {
  tiltRad: number
  animTime: number
  checkStatus: CheckStatus
  imbalanceEpoch: number
  leftExpression: string
  rightExpression: string
  activeTray: ActiveTray
  onSelectTray: (side: ActiveTray) => void
}

export function BalanceCanvas({
  tiltRad,
  animTime,
  checkStatus,
  imbalanceEpoch,
  leftExpression,
  rightExpression,
  activeTray,
  onSelectTray,
}: BalanceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevCheckStatusRef = useRef<CheckStatus>(checkStatus)
  const prevImbalanceEpochRef = useRef(imbalanceEpoch)
  const stateRef = useRef({
    tiltRad,
    animTime,
    checkStatus,
    leftExpression,
    rightExpression,
    activeTray,
    flashPhase: 0,
  })

  const prevStatus = prevCheckStatusRef.current
  if (checkStatus === 'imbalance' && prevStatus !== 'imbalance') {
    stateRef.current.flashPhase = 0
  }
  if (checkStatus !== 'imbalance' && prevStatus === 'imbalance') {
    stateRef.current.flashPhase = 0
  }
  if (
    checkStatus === 'imbalance' &&
    imbalanceEpoch !== prevImbalanceEpochRef.current
  ) {
    stateRef.current.flashPhase = 0
  }
  prevCheckStatusRef.current = checkStatus
  prevImbalanceEpochRef.current = imbalanceEpoch

  stateRef.current = {
    tiltRad,
    animTime,
    checkStatus,
    leftExpression,
    rightExpression,
    activeTray,
    flashPhase: stateRef.current.flashPhase,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = createGameLoop({
      update(dt) {
        stateRef.current.flashPhase += dt
      },
      draw() {
        const s = stateRef.current
        drawRealisticBalance(ctx, {
          tiltRad: s.tiltRad,
          checkStatus: s.checkStatus,
          leftExpression: s.leftExpression,
          rightExpression: s.rightExpression,
          activeTray: s.activeTray,
          flashPhase: s.flashPhase,
          animTime: s.animTime,
        })
      },
    })

    loop.start()
    return () => loop.stop()
  }, [])

  const handlePointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = BALANCE_WIDTH / rect.width
    const scaleY = BALANCE_HEIGHT / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    const side = hitTestPan(x, y, stateRef.current.tiltRad)
    if (side) onSelectTray(side)
  }

  return (
    <canvas
      ref={canvasRef}
      className="balance-canvas"
      width={BALANCE_WIDTH}
      height={BALANCE_HEIGHT}
      aria-label="等式天平，点击左或右托盘选择输入侧"
      onPointerDown={(e) => {
        handlePointer(e.clientX, e.clientY)
      }}
    />
  )
}
