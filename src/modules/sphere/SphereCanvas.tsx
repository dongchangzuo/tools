import '../shape3d-core/shape3d.css'
import { createShapeCanvas } from '../shape3d-core'
import { SPHERE_CANVAS_HEIGHT, SPHERE_CANVAS_WIDTH, SPHERE_DEFAULT_SIZE } from './geometry'
import { paintSphereScene } from './drawSphere'

export const SphereCanvas = createShapeCanvas({
  defaultWidth: SPHERE_CANVAS_WIDTH,
  defaultHeight: SPHERE_CANVAS_HEIGHT,
  defaultSize: SPHERE_DEFAULT_SIZE,
  className: 'shape3d-canvas',
  defaultAriaLabel: '球体',
  paintScene: paintSphereScene,
})
