import type { ShapeKind } from '../types'
import { DRAG_MIME } from '../types'
import { ShapeIcon } from './ShapeIcon.tsx'

type DropSlotProps = {
  index: number
  value: ShapeKind | null
  disabled?: boolean
  onDrop: (index: number, shape: ShapeKind) => void
  onClear: (index: number) => void
}

export function DropSlot({
  index,
  value,
  disabled,
  onDrop,
  onClear,
}: DropSlotProps) {
  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    const shape = e.dataTransfer.getData(DRAG_MIME) as ShapeKind
    if (shape === 'triangle' || shape === 'circle') {
      onDrop(index, shape)
    }
  }

  return (
    <button
      type="button"
      className={`drop-slot${value ? ' drop-slot--filled' : ''}${disabled ? ' drop-slot--disabled' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && value) onClear(index)
      }}
      aria-label={value ? `槽位 ${index + 1}，已放入图形，点击清空` : `槽位 ${index + 1}，拖入图形`}
      disabled={disabled && !value}
    >
      {value ? <ShapeIcon kind={value} size={52} /> : <ShapeIcon kind="slot" size={52} />}
    </button>
  )
}
