import { CubeCanvas } from '../../../modules/cube'
import { CylinderCanvas } from '../../../modules/cylinder'
import { PyramidCanvas } from '../../../modules/pyramid'
import { SphereCanvas } from '../../../modules/sphere'

const SHAPES = [
  { title: '正方体', Canvas: CubeCanvas },
  { title: '三棱锥', Canvas: PyramidCanvas },
  { title: '圆柱体', Canvas: CylinderCanvas },
  { title: '球体', Canvas: SphereCanvas },
]

export function ShapesTestPage() {
  return (
    <div className="shapes-test-page">
      <header className="shapes-test-page__header">
        <h1>立体图形测试</h1>
        <p className="shapes-test-page__subtitle">3D 等轴测投影实时渲染</p>
      </header>
      <div className="shapes-test-grid">
        {SHAPES.map(({ title, Canvas }) => (
          <div key={title} className="shapes-test-card">
            <h2 className="shapes-test-card__title">{title}</h2>
            <div className="shapes-test-card__preview">
              <Canvas />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
