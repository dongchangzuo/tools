import '../shape3d-core/shape3d.css'
import { createShapeCanvas } from '../shape3d-core'
import {
  CYLINDER_CANVAS_HEIGHT,
  CYLINDER_CANVAS_WIDTH,
  CYLINDER_DEFAULT_SIZE,
} from './geometry'
import { paintCylinderScene } from './drawCylinder'

export const CylinderCanvas = createShapeCanvas({
  defaultWidth: CYLINDER_CANVAS_WIDTH,
  defaultHeight: CYLINDER_CANVAS_HEIGHT,
  defaultSize: CYLINDER_DEFAULT_SIZE,
  className: 'shape3d-canvas',
  defaultAriaLabel: '圆柱体',
  paintScene: paintCylinderScene,
})
