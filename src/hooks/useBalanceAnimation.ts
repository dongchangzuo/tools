import { useEffect, useRef, useState } from 'react'

const LERP_FACTOR = 0.08

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}

export function useBalanceAnimation(targetTiltRad: number) {
  const currentTiltRadRef = useRef(0)
  const targetTiltRef = useRef(targetTiltRad)
  const [, setFrame] = useState(0)

  targetTiltRef.current = targetTiltRad

  const resetAnimation = () => {
    currentTiltRadRef.current = 0
    setFrame((n) => n + 1)
  }

  useEffect(() => {
    let rafId = 0

    const tick = () => {
      currentTiltRadRef.current = lerp(
        currentTiltRadRef.current,
        targetTiltRef.current,
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
    resetAnimation,
  }
}
