export type ShapePalette = {
  faceLight: string
  faceMid: string
  faceDark: string
  faceDeep: string
  highlight: string
  shadow: string
  edge: string
}

export type ShapeDrawOptions = {
  cx: number
  cy: number
  size: number
  rotationY?: number
  palette?: Partial<ShapePalette>
}

export const DEFAULT_SHAPE_PALETTE: ShapePalette = {
  faceLight: '#7eb8e8',
  faceMid: '#4a90c4',
  faceDark: '#2d5f8a',
  faceDeep: '#1a3d5c',
  highlight: 'rgba(255, 255, 255, 0.65)',
  shadow: 'rgba(20, 30, 45, 0.25)',
  edge: 'rgba(25, 40, 60, 0.45)',
}
