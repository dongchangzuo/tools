import type { RectanglePair } from '../math/pairsFromPerimeter'

type SolutionListProps = {
  pairs: RectanglePair[]
  activeIndex: number
  demoIndex: number
  demoPlaying: boolean
  onSelect: (index: number) => void
  onPlayDemo: () => void
  onStopDemo: () => void
}

export function SolutionList({
  pairs,
  activeIndex,
  demoIndex,
  demoPlaying,
  onSelect,
  onPlayDemo,
  onStopDemo,
}: SolutionListProps) {
  return (
    <aside className="rp-solutions" aria-label="所有可能的长和宽">
      <div className="rp-solutions__header">
        <h2 className="rp-solutions__title">所有可能</h2>
        <p className="rp-solutions__count">共 {pairs.length} 种</p>
      </div>

      <div className="rp-solutions__list" role="listbox" aria-label="长和宽的组合">
        {pairs.map((pair, index) => {
          const isActive = activeIndex === index
          const isDemo = demoPlaying && demoIndex === index

          return (
            <button
              key={pair.length}
              type="button"
              role="option"
              aria-selected={isActive}
              aria-current={isActive ? 'true' : undefined}
              className={`rp-solution${isActive ? ' rp-solution--active' : ''}${isDemo ? ' rp-solution--demo' : ''}`}
              onClick={() => onSelect(index)}
            >
              <span className="rp-solution__label">
                长 {pair.length}，宽 {pair.width}
              </span>
              {isActive && (
                <span className="rp-solution__badge" aria-hidden="true">
                  当前
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rp-solutions__actions">
        {demoPlaying ? (
          <button type="button" className="rp-btn rp-btn--ghost" onClick={onStopDemo}>
            停止演示
          </button>
        ) : (
          <button type="button" className="rp-btn rp-btn--primary" onClick={onPlayDemo}>
            逐个演示
          </button>
        )}
      </div>
    </aside>
  )
}
