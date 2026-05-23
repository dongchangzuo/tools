import { useCallback, useState } from 'react'
import { validateAnswer } from '../game/substitutionLogic'
import type { SlotsProblem } from '../game/substitutionLogic'
import type { CheckStatus, FailureReason, ShapeKind } from '../types'

export function useSubstitutionGame(problem: SlotsProblem) {
  const [slots, setSlots] = useState<(ShapeKind | null)[]>(() =>
    Array.from({ length: problem.slotCount }, () => null),
  )
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [failureReason, setFailureReason] = useState<FailureReason | null>(
    null,
  )

  const setSlot = useCallback((index: number, shape: ShapeKind) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = shape
      return next
    })
    if (status !== 'idle') {
      setStatus('idle')
      setFailureReason(null)
    }
  }, [status])

  const clearSlot = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
    if (status !== 'idle') {
      setStatus('idle')
      setFailureReason(null)
    }
  }, [status])

  const submit = useCallback(() => {
    const result = validateAnswer(problem, slots)
    if (result.ok) {
      setStatus('success')
      setFailureReason(null)
    } else {
      setStatus('failure')
      setFailureReason(result.reason)
    }
  }, [problem, slots])

  const retry = useCallback(() => {
    setStatus('idle')
    setFailureReason(null)
  }, [])

  const reset = useCallback(() => {
    setSlots(Array.from({ length: problem.slotCount }, () => null))
    setStatus('idle')
    setFailureReason(null)
  }, [problem.slotCount])

  const locked = status === 'success'

  return {
    problem,
    slots,
    status,
    failureReason,
    locked,
    setSlot,
    clearSlot,
    submit,
    retry,
    reset,
  }
}
