import { getPrimaryLabel, getRevealDetail, getSubtitle } from '../content/subtitles'

type SubtitleBarProps = {
  phase: number
  disabled: boolean
  onPrimary: () => void
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>
  revealDetailRef?: React.RefObject<HTMLParagraphElement | null>
}

export function SubtitleBar({
  phase,
  disabled,
  onPrimary,
  subtitleRef,
  revealDetailRef,
}: SubtitleBarProps) {
  const text = getSubtitle(phase)
  const revealDetail = getRevealDetail(phase)
  const primaryLabel = getPrimaryLabel(phase)
  const isMathSubtitle = text?.includes('a + b') ?? false

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
          <p ref={revealDetailRef} className="rpf-subtitle-bar__detail">
            {revealDetail}
          </p>
        )}
      </div>
      <button
        type="button"
        className={`rpf-btn rpf-btn--primary rpf-subtitle-bar__btn${phase === 1 && !disabled ? ' rpf-subtitle-bar__btn--pulse' : ''}`}
        disabled={disabled}
        aria-label={primaryLabel === '继续' ? '继续下一步' : primaryLabel}
        onClick={onPrimary}
      >
        {primaryLabel}
      </button>
    </div>
  )
}
