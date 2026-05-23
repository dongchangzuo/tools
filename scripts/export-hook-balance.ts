/**
 * 导出 art/hook-balance-oblique.png（与运行时同一套 3D 绘制）
 * 需要: npm install -D canvas tsx
 */
import { createCanvas } from '@napi-rs/canvas'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BALANCE_HEIGHT, BALANCE_WIDTH } from '../src/modules/balance-hook/geometry'
import { paintHookBalanceScene } from '../src/modules/balance-hook/draw/compose'

const __dir = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dir, '../art/hook-balance-oblique.png')

const canvas = createCanvas(BALANCE_WIDTH, BALANCE_HEIGHT)
const ctx = canvas.getContext('2d')

paintHookBalanceScene(ctx, {
  width: BALANCE_WIDTH,
  height: BALANCE_HEIGHT,
  background: '#e8ecf2',
  tiltRad: 0,
  animTime: 0,
})

ctx.fillStyle = 'rgba(55, 65, 75, 0.32)'
ctx.font = '300 11px system-ui, sans-serif'
ctx.textAlign = 'left'
ctx.textBaseline = 'bottom'
ctx.fillText('Oblique Suspension', 18, BALANCE_HEIGHT - 14)

writeFileSync(outPath, canvas.toBuffer('image/png'))
console.log(`Wrote ${outPath}`)
