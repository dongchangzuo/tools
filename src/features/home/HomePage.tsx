import { useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { AppLayoutOutletContext } from '../../shared/ui/AppLayout'
import { useAuthSession } from '../auth/hooks/useAuthSession'
import './home.css'

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.06 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="home-hero__particles" aria-hidden="true" />
}

export function HomePage() {
  const navigate = useNavigate()
  const { openProfile } = useOutletContext<AppLayoutOutletContext>()
  const { accessToken } = useAuthSession()
  const isLoggedIn = Boolean(accessToken)

  return (
    <main className="home-page">
      <section className="home-hero">
        <HeroParticles />
        <div className="home-hero__glow home-hero__glow--left" aria-hidden="true" />
        <div className="home-hero__glow home-hero__glow--right" aria-hidden="true" />

        <div className="home-hero__content">
          <p className="home-hero__eyebrow">— 为探索者而建 —</p>

          <h1 className="home-hero__title">
            <span className="home-hero__title-line" style={{ animationDelay: '0s' }}>
              学如弓弩，
            </span>
            <span className="home-hero__title-line" style={{ animationDelay: '0.15s' }}>
              才如箭镞。
            </span>
          </h1>

          <p className="home-hero__desc" style={{ animationDelay: '0.35s' }}>
            每一道算式都是思维的体操，每一次推演都在雕刻直觉。
            <br />
            从算式的推演到几何的棱角 —— 你面前的不是题目，而是通往清晰思考的阶梯。
          </p>

          <div className="home-hero__actions" style={{ animationDelay: '0.5s' }}>
            {isLoggedIn ? (
              <button
                type="button"
                className="home-hero__btn home-hero__btn--primary"
                onClick={openProfile}
              >
                开始探索
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="home-hero__btn home-hero__btn--primary"
                  onClick={() => navigate('/register')}
                >
                  立即启程
                </button>
                <button
                  type="button"
                  className="home-hero__btn home-hero__btn--ghost"
                  onClick={() => navigate('/login')}
                >
                  已有账号
                </button>
              </>
            )}
          </div>

          <p className="home-hero__tagline">
            识以领之，方能中鹄。
          </p>
        </div>

        <div className="home-hero__scroll" aria-hidden="true">
          <span className="home-hero__scroll-dot" />
        </div>
      </section>
    </main>
  )
}
