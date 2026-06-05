import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animateLength, killTween } from '../animation/animateSnap'
import { buildDemoTimeline } from '../animation/buildDemoTimeline'
import { pairsFromPerimeter } from '../math/pairsFromPerimeter'
import { clampLength, lengthFromPointerX, snapLength } from '../math/snapLength'
import { validatePerimeter } from '../math/validatePerimeter'

type UsePerimeterExplorerOptions = {
  initialPerimeter?: number
  reducedMotion?: boolean
}

export function usePerimeterExplorer({
  initialPerimeter = 20,
  reducedMotion = false,
}: UsePerimeterExplorerOptions = {}) {
  const [perimeter, setPerimeterState] = useState(initialPerimeter)
  const [length, setLengthState] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [demoPlaying, setDemoPlaying] = useState(false)
  const [demoIndex, setDemoIndex] = useState(0)

  const demoTimelineRef = useRef<ReturnType<typeof buildDemoTimeline> | null>(null)
  const snapTweenRef = useRef<ReturnType<typeof animateLength> | null>(null)
  const lengthRef = useRef(length)

  useEffect(() => {
    lengthRef.current = length
  }, [length])

  const validation = useMemo(() => validatePerimeter(perimeter), [perimeter])
  const half = validation.valid ? validation.half : 0
  const pairs = useMemo(() => pairsFromPerimeter(perimeter), [perimeter])
  const verticalWidth = half > 0 ? half - length : 0

  const activeIndex = useMemo(() => {
    const rounded = snapLength(length, half)
    return pairs.findIndex((pair) => pair.length === rounded)
  }, [length, pairs, half])

  const stopDemo = useCallback(() => {
    demoTimelineRef.current?.kill()
    demoTimelineRef.current = null
    setDemoPlaying(false)
  }, [])

  const setLength = useCallback(
    (next: number, animate = false) => {
      const clamped = clampLength(next, half)
      if (!animate || reducedMotion) {
        killTween(snapTweenRef.current)
        setLengthState(clamped)
        return
      }

      killTween(snapTweenRef.current)
      snapTweenRef.current = animateLength({
        from: lengthRef.current,
        to: clamped,
        reducedMotion,
        onUpdate: (value) => setLengthState(value),
        onComplete: () => {
          setLengthState(clamped)
          snapTweenRef.current = null
        },
      })
    },
    [half, reducedMotion],
  )

  const setPerimeter = useCallback(
    (next: number) => {
      const result = validatePerimeter(next)
      if (!result.valid) return

      stopDemo()
      killTween(snapTweenRef.current)
      setPerimeterState(next)
      setLengthState(1)
      setDemoIndex(0)
    },
    [stopDemo],
  )

  const beginDrag = useCallback(() => {
    stopDemo()
    killTween(snapTweenRef.current)
    setIsDragging(true)
  }, [stopDemo])

  const updateLengthFromPointer = useCallback(
    (pointerX: number, originX: number, cellSize: number) => {
      const next = lengthFromPointerX(pointerX, originX, cellSize, half)
      setLengthState(next)
    },
    [half],
  )

  const endDrag = useCallback(() => {
    setIsDragging(false)
    const snapped = snapLength(lengthRef.current, half)
    setLength(snapped, true)
  }, [half, setLength])

  const goToPair = useCallback(
    (index: number, animate = true) => {
      const pair = pairs[index]
      if (!pair) return
      stopDemo()
      setDemoIndex(index)
      setLength(pair.length, animate)
    },
    [pairs, setLength, stopDemo],
  )

  const playDemo = useCallback(() => {
    if (pairs.length === 0) return

    stopDemo()
    killTween(snapTweenRef.current)
    setDemoPlaying(true)
    setDemoIndex(0)

    demoTimelineRef.current = buildDemoTimeline({
      pairs,
      getLength: () => lengthRef.current,
      setLength: (value) => setLengthState(value),
      onStep: (index) => setDemoIndex(index),
      reducedMotion,
      onComplete: () => {
        demoTimelineRef.current = null
        setDemoPlaying(false)
        const last = pairs[pairs.length - 1]
        if (last) setLengthState(last.length)
      },
    })
  }, [pairs, reducedMotion, stopDemo])

  const nudgeLength = useCallback(
    (delta: number) => {
      stopDemo()
      const snapped = snapLength(lengthRef.current, half)
      setLength(snapped + delta, true)
    },
    [half, setLength, stopDemo],
  )

  useEffect(() => {
    return () => {
      stopDemo()
      killTween(snapTweenRef.current)
    }
  }, [stopDemo])

  return {
    perimeter,
    half,
    length,
    verticalWidth,
    pairs,
    activeIndex,
    demoIndex,
    isDragging,
    demoPlaying,
    validation,
    setPerimeter,
    beginDrag,
    updateLengthFromPointer,
    endDrag,
    goToPair,
    playDemo,
    stopDemo,
    nudgeLength,
  }
}

export function computeCellSize(half: number, maxPixels: number, padding = 48): number {
  const maxUnits = Math.max(half - 1, 1)
  const available = Math.max(maxPixels - padding * 2, 80)
  return Math.min(40, Math.floor(available / maxUnits))
}
