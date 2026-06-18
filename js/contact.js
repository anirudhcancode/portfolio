// ── Breathing dots for Contact page
const canvas = document.getElementById('particles')
if (canvas) {
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const colors = [
    { r: 37, g: 99, b: 235 },
    { r: 220, g: 38, b: 38 },
    { r: 212, g: 160, b: 23 },
  ]

  function isNavyMode() {
    return document.body.classList.contains('light-mode')
  }

  const dots = Array.from({ length: 35 }, () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseR: Math.random() * 2 + 1,
      opacity: Math.random() * 0.2 + 0.05,
      color,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
    }
  })

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const boost = isNavyMode() ? 1.6 : 1

    dots.forEach(p => {
      p.pulse += p.pulseSpeed
      const scale = 1 + 0.6 * Math.sin(p.pulse)
      const r = p.baseR * scale
      const glowSize = r * 5
      const glowOpacity = p.opacity * boost * (0.5 + 0.5 * Math.sin(p.pulse))
      const { r: cr, g, b } = p.color

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
      gradient.addColorStop(0, `rgba(${cr}, ${g}, ${b}, ${glowOpacity})`)
      gradient.addColorStop(1, `rgba(${cr}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${cr}, ${g}, ${b}, ${Math.min(glowOpacity + 0.1, 0.9)})`
      ctx.fill()

      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1
    })

    requestAnimationFrame(draw)
  }

  draw()
}