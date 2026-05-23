export type HookSide = 'left' | 'right'

export type EqualsVariant = 'hidden' | 'idle' | 'success' | 'imbalance'

export type HookBalancePalette = {
  envTop: string
  envMid: string
  envBottom: string
  metalHighlight: string
  metalMid: string
  metalShadow: string
  equalsIdle: string
  equalsSuccess: string
  equalsImbalance: string
}

export const DEFAULT_HOOK_BALANCE_PALETTE: HookBalancePalette = {
  envTop: '#f0f4f8',
  envMid: '#e4eaf0',
  envBottom: '#d8e0e8',
  metalHighlight: '#d8dee6',
  metalMid: '#9aa5b0',
  metalShadow: '#4a525a',
  equalsIdle: '#c9a227',
  equalsSuccess: '#22c55e',
  equalsImbalance: '#ef4444',
}

export type HookAnchor = { x: number; y: number; side: HookSide }

export type HookBalanceLayout = {
  width: number
  height: number
  left: HookAnchor
  right: HookAnchor
}

export type PaintSideCallback = (
  ctx: CanvasRenderingContext2D,
  side: HookSide,
  anchor: HookAnchor,
) => void

export type DrawHookBalanceOptions = {
  tiltRad?: number
  equalsVariant?: EqualsVariant
  flashPhase?: number
  animTime?: number
  onPaintSide?: PaintSideCallback
}
