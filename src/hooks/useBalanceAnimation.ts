import { useEffect, useRef, useState } from 'react'

const STIFFNESS = 48
const DAMPING = 0.78

export function useBalanceAnimation(targetTiltRad: number) {
  const thetaRef = useRef(0)
  const omegaRef = useRef(0)
  const targetTiltRef = useRef(targetTiltRad)
  const animTimeRef = useRef(0)
  const [, setFrame] = useState(0)

  targetTiltRef.current = targetTiltRad

  const resetAnimation = () => {
    thetaRef.current = 0
    omegaRef.current = 0
    animTimeRef.current = 0
    setFrame((n) => n + 1)
  }

  useEffect(() => {
    let rafId = 0
    let lastTime = 0

    const tick = (now: number) => {
      const dt = lastTime === 0 ? 0 : Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (dt > 0) {
        animTimeRef.current += dt
        const target = targetTiltRef.current
        const theta = thetaRef.current
        const omega = omegaRef.current
        const accel = (target - theta) * STIFFNESS
        const newOmega = (omega + accel * dt) * Math.pow(DAMPING, dt * 60)
        const newTheta = theta + newOmega * dt
        thetaRef.current = newTheta
        omegaRef.current = newOmega
      }

      setFrame((n) => n + 1)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return {
    currentTiltRad: thetaRef.current,
    animTime: animTimeRef.current,
    resetAnimation,
  }
}
