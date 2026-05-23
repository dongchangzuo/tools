import { useMemo, useState } from 'react'
import {
  AppleCanvas,
  APPLE_CANVAS_HEIGHT,
  APPLE_CANVAS_WIDTH,
  APPLE_DEFAULT_RADIUS,
  type ApplePalette,
} from '../modules/apple'

type PalettePreset = 'default' | 'green' | 'gold'

const PALETTE_PRESETS: Record<
  Exclude<PalettePreset, 'default'>,
  Partial<ApplePalette>
> = {
  green: {
    bodyLight: '#7dce9a',
    bodyMid: '#40916c',
    bodyDark: '#1b5e3a',
    bodyDeep: '#0d3320',
    freckleLight: '#a8c686',
    freckleDark: '#5a7040',
    stem: '#5c4a2a',
    stemDark: '#3d2914',
    leafLight: '#95d5b2',
    leafDark: '#2d6a4f',
  },
  gold: {
    bodyLight: '#ffd97a',
    bodyMid: '#e89b3c',
    bodyDark: '#b86b1a',
    bodyDeep: '#7a4510',
    freckleLight: '#e8c070',
    freckleDark: '#a06820',
    stem: '#6b4f2a',
    stemDark: '#3d2914',
    leafLight: '#95d5b2',
    leafDark: '#40916c',
  },
}

type BackgroundOption = '#ffffff' | 'transparent' | '#f8fafc' | '#1e293b'

const BACKGROUND_OPTIONS: { value: BackgroundOption; label: string }[] = [
  { value: '#ffffff', label: '纯白' },
  { value: 'transparent', label: '透明' },
  { value: '#f8fafc', label: '浅灰' },
  { value: '#1e293b', label: '深色' },
]

export function AppleTestPage() {
  const [width, setWidth] = useState(APPLE_CANVAS_WIDTH)
  const [height, setHeight] = useState(APPLE_CANVAS_HEIGHT)
  const [radius, setRadius] = useState(APPLE_DEFAULT_RADIUS)
  const [rotationDeg, setRotationDeg] = useState(0)
  const [background, setBackground] = useState<BackgroundOption>('#ffffff')
  const [palettePreset, setPalettePreset] = useState<PalettePreset>('default')

  const rotationRad = (rotationDeg * Math.PI) / 180

  const palette = useMemo(() => {
    if (palettePreset === 'default') return undefined
    return PALETTE_PRESETS[palettePreset]
  }, [palettePreset])

  const summary = [
    `画布 ${width} × ${height}`,
    `半径 ${radius}`,
    `旋转 ${rotationDeg}°`,
    `背景 ${background}`,
    `配色 ${palettePreset === 'default' ? '默认红苹果' : palettePreset === 'green' ? '青苹果' : '金苹果'}`,
  ].join(' · ')

  return (
    <div className="apple-test-page">
      <header className="apple-test-page__header">
        <h1>Apple 组件测试</h1>
        <p className="apple-test-page__subtitle">开发用 · 调试 Canvas 苹果绘制参数</p>
      </header>

      <div className="apple-test-page__layout">
        <div className="apple-test-page__previews">
        <section className="apple-test-panel" aria-label="可调参数预览">
          <h2 className="apple-test-panel__title">可调实例</h2>
          <div
            className="apple-test-preview"
            style={{
              background:
                background === 'transparent'
                  ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #f8fafc 0% 50%) 50% / 16px 16px'
                  : background,
            }}
          >
            <AppleCanvas
              width={width}
              height={height}
              radius={radius}
              rotation={rotationRad}
              background={background}
              palette={palette}
            />
          </div>
          <p className="apple-test-summary">{summary}</p>
        </section>

        <section className="apple-test-panel" aria-label="默认尺寸预览">
          <h2 className="apple-test-panel__title">默认尺寸 ({APPLE_CANVAS_WIDTH}×{APPLE_CANVAS_HEIGHT})</h2>
          <div className="apple-test-preview apple-test-preview--muted">
            <AppleCanvas background="#ffffff" />
          </div>
        </section>
        </div>

        <aside className="apple-test-controls" aria-label="参数控制">
          <label className="apple-test-control">
            <span>宽度 {width}px</span>
            <input
              type="range"
              min={144}
              max={360}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>

          <label className="apple-test-control">
            <span>高度 {height}px</span>
            <input
              type="range"
              min={168}
              max={400}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>

          <label className="apple-test-control">
            <span>半径 {radius}</span>
            <input
              type="range"
              min={42}
              max={108}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </label>

          <label className="apple-test-control">
            <span>旋转 {rotationDeg}°</span>
            <input
              type="range"
              min={0}
              max={360}
              value={rotationDeg}
              onChange={(e) => setRotationDeg(Number(e.target.value))}
            />
          </label>

          <label className="apple-test-control">
            <span>背景</span>
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value as BackgroundOption)}
            >
              {BACKGROUND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="apple-test-fieldset">
            <legend>配色预设</legend>
            <div className="apple-test-preset-group">
              {(
                [
                  ['default', '默认红苹果'],
                  ['green', '青苹果'],
                  ['gold', '金苹果'],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="apple-test-preset">
                  <input
                    type="radio"
                    name="palette"
                    checked={palettePreset === id}
                    onChange={() => setPalettePreset(id)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            className="apple-test-reset"
            onClick={() => {
              setWidth(APPLE_CANVAS_WIDTH)
              setHeight(APPLE_CANVAS_HEIGHT)
              setRadius(APPLE_DEFAULT_RADIUS)
              setRotationDeg(0)
              setBackground('#ffffff')
              setPalettePreset('default')
            }}
          >
            恢复默认
          </button>
        </aside>
      </div>
    </div>
  )
}
