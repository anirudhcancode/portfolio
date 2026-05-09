// ── Shooting stars for projects page
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
    { r: 124, g: 58, b: 237 },
    { r: 255, g: 107, b: 53 },
    { r: 6, g: 214, b: 160 },
  ]

  // ── Subtle background particles
  const particles = Array.from({ length: 40 }, () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.05,
      glowSize: Math.random() * 6 + 3,
      color,
      pulse: Math.random() * Math.PI * 2
    }
  })

  // ── Shooting stars
  const shootingStars = []

  function createShootingStar() {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const side = Math.floor(Math.random() * 4)
    let x, y, angle

    if (side === 0) {
      x = Math.random() * canvas.width
      y = 0
      angle = Math.random() * 60 + 60
    } else if (side === 1) {
      x = canvas.width
      y = Math.random() * canvas.height
      angle = Math.random() * 60 + 150
    } else if (side === 2) {
      x = Math.random() * canvas.width
      y = canvas.height
      angle = Math.random() * 60 + 240
    } else {
      x = 0
      y = Math.random() * canvas.height
      angle = Math.random() * 60 + 330
    }

    const speed = Math.random() * 6 + 4
    const rad = (angle * Math.PI) / 180

    shootingStars.push({
      x,
      y,
      dx: Math.cos(rad) * speed,
      dy: Math.sin(rad) * speed,
      opacity: 1,
      color,
      width: Math.random() * 2 + 1,
      trail: []
    })
  }

  function scheduleShootingStar() {
    createShootingStar()
    setTimeout(scheduleShootingStar, Math.random() * 2000 + 2000)
  }
  scheduleShootingStar()

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background particles
    particles.forEach(p => {
      p.pulse += 0.02
      const glowOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))
      const { r, g, b } = p.color

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowOpacity})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${glowOpacity + 0.2})`
      ctx.fill()

      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1
    })

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i]
      const { r, g, b } = s.color

      s.trail.push({ x: s.x, y: s.y })
      if (s.trail.length > 20) s.trail.shift()

      for (let t = 0; t < s.trail.length - 1; t++) {
        const trailOpacity = (t / s.trail.length) * s.opacity * 0.6
        const trailWidth = (t / s.trail.length) * s.width

        ctx.beginPath()
        ctx.moveTo(s.trail[t].x, s.trail[t].y)
        ctx.lineTo(s.trail[t + 1].x, s.trail[t + 1].y)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${trailOpacity})`
        ctx.lineWidth = trailWidth
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      const headGradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6)
      headGradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`)
      headGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.8})`)
      headGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.arc(s.x, s.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = headGradient
      ctx.fill()

      s.x += s.dx
      s.y += s.dy
      s.opacity -= 0.012

      if (
        s.opacity <= 0 ||
        s.x < -100 || s.x > canvas.width + 100 ||
        s.y < -100 || s.y > canvas.height + 100
      ) {
        shootingStars.splice(i, 1)
      }
    }

    requestAnimationFrame(draw)
  }

  draw()
}