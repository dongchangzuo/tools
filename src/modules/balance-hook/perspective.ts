/**
 * 观者位于天平正前方，视线与水平面夹角约 45°（俯视角）。
 * 世界系：X 左右，Y 向下（与画布一致），Z 朝观者。
 */
export const VIEW_ELEVATION = Math.PI / 4
export const VIEW_SIN = Math.sin(VIEW_ELEVATION)
export const VIEW_COS = Math.cos(VIEW_ELEVATION)

export function projectEllipseRy(radiusX: number): number {
  return radiusX * VIEW_SIN
}

export function depthToScreenY(depth: number): number {
  return depth * VIEW_SIN
}
