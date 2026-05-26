import { useState } from 'react'
import {
  BALANCE_HEIGHT,
  BALANCE_WIDTH,
  HookBalanceCanvas,
} from '../../../modules/balance-hook'

export function BalanceHookTestPage() {
  const [tiltRad, setTiltRad] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="balance-hook-test-page">
      <header className="balance-hook-test-page__header">
        <h1>挂钩天平组件测试</h1>
        <p className="balance-hook-test-page__subtitle">
          3D · 正前方 45° 俯视 · 黄铜秤盘 · 点击秤盘可选中
        </p>
      </header>

      <div className="balance-hook-test-page__controls">
        <button type="button" onClick={() => setTiltRad(0)}>
          水平
        </button>
        <button type="button" onClick={() => setTiltRad(-0.12)}>
          左倾
        </button>
        <button type="button" onClick={() => setTiltRad(0.12)}>
          右倾
        </button>
      </div>

      <div className="balance-hook-test-page__stage">
        <div
          className="balance-hook-test-page__canvas-wrap"
          style={{ width: BALANCE_WIDTH, height: BALANCE_HEIGHT }}
        >
          <HookBalanceCanvas
            width={BALANCE_WIDTH}
            height={BALANCE_HEIGHT}
            tiltRad={tiltRad}
            onSelectSide={setSelected}
          />
        </div>
        {selected && (
          <p className="balance-hook-test-page__status">
            已选：{selected === 'left' ? '左' : '右'}秤盘
          </p>
        )}
      </div>
    </div>
  )
}
