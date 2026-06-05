import { LESSON_PERIMETER_CM, ropeLengthCm } from '../math/halfPerimeter'

type HalfSummaryTableProps = {
  phase: number
}

type SummaryRow = {
  key: string
  label: string
  expression: string
  tone: 'red' | 'green'
}

function getSummaryRows(phase: number): SummaryRow[] {
  const revealCm = phase >= 7
  const expression = revealCm ? `a + b = ${ropeLengthCm(LESSON_PERIMETER_CM)} 厘米` : 'a + b'
  const rows: SummaryRow[] = []

  if (phase >= 3) {
    rows.push({ key: 'red', label: '红色的长度', expression, tone: 'red' })
  }

  if (phase >= 5) {
    rows.push({ key: 'green', label: '绿色的长度', expression, tone: 'green' })
  }

  return rows
}

export function HalfSummaryTable({ phase }: HalfSummaryTableProps) {
  const rows = getSummaryRows(phase)
  if (rows.length === 0) return null

  return (
    <div className="rpf-summary">
      <table className="rpf-summary__table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={`rpf-summary__row rpf-summary__row--${row.tone}`}>
              <th scope="row" className="rpf-summary__label">
                {row.label}
              </th>
              <td className="rpf-summary__value">{row.expression}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
