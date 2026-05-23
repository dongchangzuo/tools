import '../shape3d-core/shape3d.css'
import { createShapeCanvas } from '../shape3d-core'
import { PYRAMID_CANVAS_HEIGHT, PYRAMID_CANVAS_WIDTH, PYRAMID_DEFAULT_SIZE } from './geometry'
import { paintPyramidScene } from './drawPyramid'

export const PyramidCanvas = createShapeCanvas({
  defaultWidth: PYRAMID_CANVAS_WIDTH,
  defaultHeight: PYRAMID_CANVAS_HEIGHT,
  defaultSize: PYRAMID_DEFAULT_SIZE,
  className: 'shape3d-canvas',
  defaultAriaLabel: '三棱锥',
  paintScene: paintPyramidScene,
})
