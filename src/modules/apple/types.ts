export type ApplePalette = {
  bodyLight: string
  bodyMid: string
  bodyDark: string
  bodyDeep: string
  highlight: string
  stem: string
  stemDark: string
  leafLight: string
  leafDark: string
  shadow: string
  freckleLight: string
  freckleDark: string
  calyxDark: string
  calyxMid: string
  waxSheen: string
}

export type DrawAppleOptions = {
  /** 苹果中心 x（画布坐标） */
  cx: number
  /** 苹果中心 y（画布坐标，略低于几何中心以留出果蒂） */
  cy: number
  /** 苹果大致半径（决定整体尺寸） */
  radius: number
  /** 整体旋转（弧度），默认 0 */
  rotation?: number
  /** 配色，不传则用默认红苹果 */
  palette?: Partial<ApplePalette>
}

export const DEFAULT_APPLE_PALETTE: ApplePalette = {
  bodyLight: '#ff5c4d',
  bodyMid: '#c41e3a',
  bodyDark: '#8b1530',
  bodyDeep: '#5c0a18',
  highlight: 'rgba(255, 255, 255, 0.72)',
  stem: '#6d4c2e',
  stemDark: '#3a2410',
  leafLight: '#6aae6a',
  leafDark: '#2d5a34',
  shadow: 'rgba(25, 15, 20, 0.28)',
  freckleLight: '#d4a574',
  freckleDark: '#8b4513',
  calyxDark: '#2a1810',
  calyxMid: '#4a3020',
  waxSheen: 'rgba(255, 220, 200, 0.18)',
}
