import { Link } from 'react-router-dom'

type HalfLessonControlsProps = {
  showBack: boolean
  showSkip: boolean
  showExploreLink: boolean
  disabled: boolean
  onBack: () => void
  onSkip: () => void
}

export function HalfLessonControls({
  showBack,
  showSkip,
  showExploreLink,
  disabled,
  onBack,
  onSkip,
}: HalfLessonControlsProps) {
  if (!showBack && !showSkip && !showExploreLink) return null

  return (
    <div className="rpf-lesson-controls">
      {showBack && (
        <button type="button" className="rpf-btn rpf-btn--ghost" disabled={disabled} onClick={onBack}>
          上一步
        </button>
      )}
      {showSkip && (
        <button type="button" className="rpf-btn rpf-btn--ghost" disabled={disabled} onClick={onSkip}>
          直接看答案
        </button>
      )}
      {showExploreLink && (
        <Link className="rpf-link" to="/tools/rectangle-perimeter">
          去试试：周长 16 厘米有几种长宽？
        </Link>
      )}
    </div>
  )
}
