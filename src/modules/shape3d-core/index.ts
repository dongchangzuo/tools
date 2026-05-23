export {
  applyDevicePixelRatio,
  createShapeCanvas,
  type ShapeCanvasPaintOptions,
} from './canvas'
export { strokeSilhouetteEdges, strokeVisibleFaceEdges } from './edges'
export {
  drawGroundShadow,
  faceShade,
  linearGradientForFace,
  normalize,
  shadeToColors,
} from './lighting'
export { paintShapeScene } from './paintScene'
export {
  faceDepth,
  ISOMETRIC_VIEW_DIR,
  isFaceVisible,
  projectIso,
  projectVec3,
  rotateY,
  type Vec2,
  type Vec3,
} from './project'
export {
  DEFAULT_SHAPE_PALETTE,
  type ShapeDrawOptions,
  type ShapePalette,
} from './types'
