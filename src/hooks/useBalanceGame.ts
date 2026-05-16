import { useCallback, useState } from 'react'
import {
  checkExpressions,
  ZERO_PAN_OFFSETS,
  type CheckStatus,
  type PanOffsets,
} from '../game/balanceLogic.ts'
import { useBalanceAnimation } from './useBalanceAnimation.ts'

const ALLOWED_INPUT = /^[0-9+\-*/()[\]{}.\s]*$/

export function useBalanceGame() {
  const [leftExpression, setLeftExpression] = useState('')
  const [rightExpression, setRightExpression] = useState('')
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle')
  const [message, setMessage] = useState('')
  const [leftValue, setLeftValue] = useState<number | null>(null)
  const [rightValue, setRightValue] = useState<number | null>(null)
  const [targetTiltRad, setTargetTiltRad] = useState(0)
  const [targetPanOffsets, setTargetPanOffsets] =
    useState<PanOffsets>(ZERO_PAN_OFFSETS)

  const { currentTiltRad, currentPanOffsets, resetAnimation } =
    useBalanceAnimation(targetTiltRad, targetPanOffsets)

  const filterExpression = useCallback((value: string) => {
    if (!ALLOWED_INPUT.test(value)) return null
    return value
  }, [])

  const handleLeftChange = useCallback(
    (value: string) => {
      const filtered = filterExpression(value)
      if (filtered === null) return
      setLeftExpression(filtered)
      setCheckStatus('idle')
      setMessage('')
      setTargetTiltRad(0)
      setTargetPanOffsets(ZERO_PAN_OFFSETS)
    },
    [filterExpression],
  )

  const handleRightChange = useCallback(
    (value: string) => {
      const filtered = filterExpression(value)
      if (filtered === null) return
      setRightExpression(filtered)
      setCheckStatus('idle')
      setMessage('')
      setTargetTiltRad(0)
      setTargetPanOffsets(ZERO_PAN_OFFSETS)
    },
    [filterExpression],
  )

  const handleCheck = useCallback(() => {
    const result = checkExpressions(leftExpression, rightExpression)

    if (result.status === 'error') {
      setCheckStatus('error')
      setMessage(result.message)
      setLeftValue(null)
      setRightValue(null)
      setTargetTiltRad(0)
      setTargetPanOffsets(ZERO_PAN_OFFSETS)
      return
    }

    setLeftValue(result.leftValue)
    setRightValue(result.rightValue)
    setTargetTiltRad(result.targetTiltRad)
    setTargetPanOffsets(result.panOffsets)
    setMessage(result.message)
    setCheckStatus(result.status)
  }, [leftExpression, rightExpression])

  const handleReset = useCallback(() => {
    setLeftExpression('')
    setRightExpression('')
    setCheckStatus('idle')
    setMessage('')
    setLeftValue(null)
    setRightValue(null)
    setTargetTiltRad(0)
    setTargetPanOffsets(ZERO_PAN_OFFSETS)
    resetAnimation()
  }, [resetAnimation])

  return {
    leftExpression,
    rightExpression,
    checkStatus,
    message,
    leftValue,
    rightValue,
    currentTiltRad,
    currentPanOffsets,
    handleLeftChange,
    handleRightChange,
    handleCheck,
    handleReset,
  }
}
