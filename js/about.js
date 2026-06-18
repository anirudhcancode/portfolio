// ── Constellation effect for About page
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

  const dots = Array.from({ length: 60 }, () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      color,
      pulse: Math.random() * Math.PI * 2
    }
  })

  const MAX_DIST = 150

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const boost = isNavyMode() ? 1.6 : 1

    // Draw connecting lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x
        const dy = dots[i].y - dots[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MAX_DIST) {
          const lineOpacity = (1 - dist / MAX_DIST) * 0.15 * boost
          const { r, g, b } = dots[i].color
          ctx.beginPath()
          ctx.moveTo(dots[i].x, dots[i].y)
          ctx.lineTo(dots[j].x, dots[j].y)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // Draw dots
    dots.forEach(p => {
      p.pulse += 0.015
      const glowOpacity = p.opacity * boost * (0.7 + 0.3 * Math.sin(p.pulse))
      const { r, g, b } = p.color

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowOpacity})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(glowOpacity + 0.2, 0.9)})`
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