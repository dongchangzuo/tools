import '../shape3d-core/shape3d.css'
import { createShapeCanvas } from '../shape3d-core'
import { CUBE_CANVAS_HEIGHT, CUBE_CANVAS_WIDTH, CUBE_DEFAULT_SIZE } from './geometry'
import { paintCubeScene } from './drawCube'

export const CubeCanvas = createShapeCanvas({
  defaultWidth: CUBE_CANVAS_WIDTH,
  defaultHeight: CUBE_CANVAS_HEIGHT,
  defaultSize: CUBE_DEFAULT_SIZE,
  className: 'shape3d-canvas',
  defaultAriaLabel: '正方体',
  paintScene: paintCubeScene,
})
