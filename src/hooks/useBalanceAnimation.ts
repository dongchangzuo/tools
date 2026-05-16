import { useEffect, useRef, useState } from 'react'
import type { PanOffsets } from '../game/balanceLogic.ts'
import { ZERO_PAN_OFFSETS } from '../game/balanceLogic.ts'

const LERP_FACTOR = 0.08

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}

function lerpOffsets(current: PanOffsets, target: PanOffsets, factor: number): PanOffsets {
  return {
    left: lerp(current.left, target.left, factor),
    right: lerp(current.right, target.right, factor),
  }
}

export function useBalanceAnimation(
  targetTiltRad: number,
  targetPanOffsets: PanOffsets,
) {
  const currentTiltRadRef = useRef(0)
  const currentPanOffsetsRef = useRef<PanOffsets>(ZERO_PAN_OFFSETS)
  const targetTiltRef = useRef(targetTiltRad)
  const targetPanRef = useRef(targetPanOffsets)
  const [, setFrame] = useState(0)

  targetTiltRef.current = targetTiltRad
  targetPanRef.current = targetPanOffsets

  const resetAnimation = () => {
    currentTiltRadRef.current = 0
    currentPanOffsetsRef.current = ZERO_PAN_OFFSETS
    setFrame((n) => n + 1)
  }

  useEffect(() => {
    let rafId = 0

    const tick = () => {
      const prevTilt = currentTiltRadRef.current
      const prevPan = currentPanOffsetsRef.current

      currentTiltRadRef.current = lerp(
        prevTilt,
        targetTiltRef.current,
        LERP_FACTOR,
      )
      currentPanOffsetsRef.current = lerpOffsets(
        prevPan,
        targetPanRef.current,
        LERP_FACTOR,
      )

      setFrame((n) => n + 1)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return {
    currentTiltRad: currentTiltRadRef.current,
    currentPanOffsets: currentPanOffsetsRef.current,
    resetAnimation,
  }
}
