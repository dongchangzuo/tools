import type { ShapeKind } from '../types'
import { DRAG_MIME } from '../types'
import { ShapeIcon } from './ShapeIcon.tsx'

const TOOL_SHAPES: ShapeKind[] = ['triangle', 'circle']

type ShapeToolboxProps = {
  disabled?: boolean
}

export function ShapeToolbox({ disabled }: ShapeToolboxProps) {
  const startDrag = (e: React.DragEvent, shape: ShapeKind) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData(DRAG_MIME, shape)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <section className="shape-toolbox" aria-label="图形工具框">
      <p className="shape-toolbox__label">拖动图形到右边方框</p>
      <div className="shape-toolbox__items">
        {TOOL_SHAPES.map((shape) => (
          <div
            key={shape}
            className={`toolbox-item${disabled ? ' toolbox-item--disabled' : ''}`}
            draggable={!disabled}
            onDragStart={(e) => startDrag(e, shape)}
            aria-label={shape === 'triangle' ? '三角形' : '圆形'}
          >
            <ShapeIcon kind={shape} size={56} />
          </div>
        ))}
      </div>
    </section>
  )
}
