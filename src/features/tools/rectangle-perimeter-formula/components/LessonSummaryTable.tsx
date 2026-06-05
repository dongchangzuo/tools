type LessonSummaryTableProps = {
  phase: number
}

type SummaryRow = {
  key: string
  label: string
  expression: string
  tone: 'red' | 'green'
}

function getSummaryRows(phase: number): SummaryRow[] {
  const rows: SummaryRow[] = []

  if (phase >= 2) {
    rows.push({ key: 'red', label: '红色的长度', expression: 'a + b', tone: 'red' })
  }

  if (phase >= 4) {
    rows.push({ key: 'green', label: '绿色的长度', expression: 'a + b', tone: 'green' })
  }

  return rows
}

export function LessonSummaryTable({ phase }: LessonSummaryTableProps) {
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
