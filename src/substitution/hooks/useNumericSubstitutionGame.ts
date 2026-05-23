import { useCallback, useState } from 'react'
import {
  validateNumericAnswer,
} from '../game/substitutionLogic'
import type { NumericProblem } from '../game/substitutionLogic'
import type { CheckStatus, FailureReason } from '../types'

const MAX_ANSWER_LENGTH = 3

export function useNumericSubstitutionGame(problem: NumericProblem) {
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [failureReason, setFailureReason] = useState<FailureReason | null>(
    null,
  )

  const appendDigit = useCallback(
    (digit: string) => {
      setAnswer((prev) => {
        if (prev.length >= MAX_ANSWER_LENGTH) {
          return prev
        }
        return prev + digit
      })
      if (status !== 'idle') {
        setStatus('idle')
        setFailureReason(null)
      }
    },
    [status],
  )

  const deleteDigit = useCallback(() => {
    setAnswer((prev) => prev.slice(0, -1))
    if (status !== 'idle') {
      setStatus('idle')
      setFailureReason(null)
    }
  }, [status])

  const submit = useCallback(() => {
    const result = validateNumericAnswer(problem, answer)
    if (result.ok) {
      setStatus('success')
      setFailureReason(null)
    } else {
      setStatus('failure')
      setFailureReason(result.reason)
    }
  }, [problem, answer])

  const retry = useCallback(() => {
    setStatus('idle')
    setFailureReason(null)
  }, [])

  const reset = useCallback(() => {
    setAnswer('')
    setStatus('idle')
    setFailureReason(null)
  }, [])

  const locked = status === 'success'

  return {
    problem,
    answer,
    status,
    failureReason,
    locked,
    appendDigit,
    deleteDigit,
    submit,
    retry,
    reset,
  }
}
