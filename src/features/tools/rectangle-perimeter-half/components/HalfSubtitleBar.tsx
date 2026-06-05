import { getPrimaryLabel, getRevealDetail, getSubtitle } from '../content/subtitles'

type HalfSubtitleBarProps = {
  phase: number
  disabled: boolean
  onPrimary: () => void
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>
  revealDetailRef?: React.RefObject<HTMLParagraphElement | null>
}

export function HalfSubtitleBar({
  phase,
  disabled,
  onPrimary,
  subtitleRef,
  revealDetailRef,
}: HalfSubtitleBarProps) {
  const text = getSubtitle(phase)
  const revealDetail = getRevealDetail(phase)
  const primaryLabel = getPrimaryLabel(phase)
  const isMathSubtitle = Boolean(text?.match(/a \+ b|÷\s*2/))

  return (
    <div className="rpf-subtitle-bar">
      <div className="rpf-subtitle-bar__content" aria-live="polite">
        {phase === 0 ? (
          <p className="rpf-subtitle-bar__hint">准备好了吗？</p>
        ) : text ? (
          <p
            ref={subtitleRef}
            className={`rpf-subtitle-bar__text${isMathSubtitle ? ' rpf-subtitle-bar__text--math' : ''}`}
            key={`subtitle-${phase}`}
          >
            {text}
          </p>
        ) : null}
        {revealDetail && (
          <p ref={revealDetailRef} className="rpf-subtitle-bar__detail rpf-subtitle-bar__text--math">
            {revealDetail}
          </p>
        )}
      </div>
      <button
        type="button"
        className={`rpf-btn rpf-btn--primary rpf-subtitle-bar__btn${phase === 2 && !disabled ? ' rpf-subtitle-bar__btn--pulse' : ''}`}
        disabled={disabled}
        aria-label={primaryLabel === '继续' ? '继续下一步' : primaryLabel}
        onClick={onPrimary}
      >
        {primaryLabel}
      </button>
    </div>
  )
}
