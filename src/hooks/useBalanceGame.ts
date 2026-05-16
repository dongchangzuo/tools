import { useCallback, useState } from 'react'
import { checkExpressions, type CheckStatus } from '../game/balanceLogic.ts'
import { useBalanceAnimation } from './useBalanceAnimation.ts'

const ALLOWED_INPUT = /^[0-9+\-×÷()[\]{}.\s]*$/

export type ActiveTray = 'left' | 'right'

export function useBalanceGame() {
  const [leftExpression, setLeftExpression] = useState('')
  const [rightExpression, setRightExpression] = useState('')
  const [activeTray, setActiveTray] = useState<ActiveTray>('left')
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle')
  const [message, setMessage] = useState('')
  const [leftValue, setLeftValue] = useState<number | null>(null)
  const [rightValue, setRightValue] = useState<number | null>(null)
  const [targetTiltRad, setTargetTiltRad] = useState(0)
  const [imbalanceEpoch, setImbalanceEpoch] = useState(0)

  const { currentTiltRad, resetAnimation } = useBalanceAnimation(targetTiltRad)

  const filterExpression = useCallback((value: string) => {
    if (!ALLOWED_INPUT.test(value)) return null
    return value
  }, [])

  const applyExpression = useCallback(
    (side: ActiveTray, value: string) => {
      const filtered = filterExpression(value)
      if (filtered === null) return
      if (side === 'left') setLeftExpression(filtered)
      else setRightExpression(filtered)
      setCheckStatus('idle')
      setMessage('')
      setTargetTiltRad(0)
    },
    [filterExpression],
  )

  const insertKey = useCallback(
    (key: string) => {
      const current = activeTray === 'left' ? leftExpression : rightExpression
      applyExpression(activeTray, current + key)
    },
    [activeTray, leftExpression, rightExpression, applyExpression],
  )

  const deleteKey = useCallback(() => {
    const current = activeTray === 'left' ? leftExpression : rightExpression
    applyExpression(activeTray, current.slice(0, -1))
  }, [activeTray, leftExpression, rightExpression, applyExpression])

  const handleCheck = useCallback(() => {
    const result = checkExpressions(leftExpression, rightExpression)

    if (result.status === 'error') {
      setCheckStatus('error')
      setMessage(result.message)
      setLeftValue(null)
      setRightValue(null)
      setTargetTiltRad(0)
      return
    }

    setLeftValue(result.leftValue)
    setRightValue(result.rightValue)
    setTargetTiltRad(result.targetTiltRad)
    setMessage(result.message)
    setCheckStatus(result.status)
    if (result.status === 'imbalance') {
      setImbalanceEpoch((n) => n + 1)
    }
  }, [leftExpression, rightExpression])

  const handleReset = useCallback(() => {
    setLeftExpression('')
    setRightExpression('')
    setActiveTray('left')
    setCheckStatus('idle')
    setMessage('')
    setLeftValue(null)
    setRightValue(null)
    setTargetTiltRad(0)
    resetAnimation()
  }, [resetAnimation])

  return {
    leftExpression,
    rightExpression,
    activeTray,
    checkStatus,
    message,
    leftValue,
    rightValue,
    currentTiltRad,
    imbalanceEpoch,
    setActiveTray,
    insertKey,
    deleteKey,
    handleCheck,
    handleReset,
  }
}
