// ── Cinematic hero entrance
function typeText(element, text, speed, callback) {
  let i = 0
  element.textContent = ''
  const interval = setInterval(() => {
    element.textContent += text[i]
    i++
    if (i >= text.length) {
      clearInterval(interval)
      if (callback) callback()
    }
  }, speed)
}

function fadeIn(element, duration = 600) {
  element.style.transition = `opacity ${duration}ms ease`
  element.style.opacity = '1'
}

window.addEventListener('load', () => {
  const heroName = document.getElementById('hero-name')
  const typedTitle = document.getElementById('typed-title')
  const heroTag = document.getElementById('hero-tag')
  const heroSub = document.getElementById('hero-sub')
  const heroBtns = document.getElementById('hero-btns')

  if (heroName && typedTitle) {
    // Step 1 — fade in tag
    setTimeout(() => fadeIn(heroTag, 400), 200)

    // Step 2 — type name
    setTimeout(() => {
      typeText(heroName, 'Anirudh Ravipudi', 70, () => {
        // Step 3 — type title
        setTimeout(() => {
          typeText(typedTitle, 'Data Engineer & AI/ML Developer', 55, () => {
            // Step 4 — fade in desc and buttons
            setTimeout(() => {
              fadeIn(heroSub)
              setTimeout(() => fadeIn(heroBtns), 300)
            }, 400)
          })
        }, 300)
      })
    }, 600)
  }

  // ── Active nav link
  const current = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active')
    }
  })

  // ── Animate progress bars
  document.querySelectorAll('.progress-fill').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width + '%'
    }, 2500)
  })
})

// ── Fade in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.skill-card, .project-card, .timeline-item, .stat-item').forEach(el => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
  observer.observe(el)
})

// ── Back to top button
const backToTop = document.createElement('button')
backToTop.innerHTML = '↑'
backToTop.className = 'back-to-top'
document.body.appendChild(backToTop)

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible')
  } else {
    backToTop.classList.remove('visible')
  }
})

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ── Cosmic / Navy mode toggle
// NOTE: the CSS class is still named "light-mode" for backwards compatibility
// with existing stylesheets, but it now represents the deep-navy dark theme,
// since the site's default (no class) is the white/cosmic theme. The toggle
// logic and icons below reflect that — the icons/labels track what state
// you're SWITCHING TO, same as before.
const toggle = document.createElement('button')
toggle.className = 'theme-toggle'
toggle.innerHTML = '🌙'
toggle.title = 'Toggle navy mode'
document.body.appendChild(toggle)

const savedTheme = localStorage.getItem('theme') || 'cosmic'
if (savedTheme === 'navy') {
  document.body.classList.add('light-mode')
  toggle.innerHTML = '☀️'
  toggle.title = 'Toggle cosmic mode'
}

toggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode')
  const isNavy = document.body.classList.contains('light-mode')
  toggle.innerHTML = isNavy ? '☀️' : '🌙'
  toggle.title = isNavy ? 'Toggle cosmic mode' : 'Toggle navy mode'
  localStorage.setItem('theme', isNavy ? 'navy' : 'cosmic')
})

// ── Glowing particle background (home page only)
const isHomePage = window.location.pathname.endsWith('index.html') ||
                   window.location.pathname.endsWith('/')  ||
                   window.location.pathname.endsWith('/portfolio/')  ||
                   window.location.pathname.endsWith('/portfolio')

if (isHomePage) {
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

    const particles = Array.from({ length: 70 }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.35 + 0.1,
        glowSize: Math.random() * 7 + 4,
        color,
        pulse: Math.random() * Math.PI * 2
      }
    })

    function isNavyMode() {
      return document.body.classList.contains('light-mode')
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const boost = isNavyMode() ? 1.6 : 1

      particles.forEach(p => {
        p.pulse += 0.02
        const glowOpacity = p.opacity * boost * (0.6 + 0.4 * Math.sin(p.pulse))
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
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(glowOpacity + 0.2, 0.9)})`
        ctx.fill()

        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      requestAnimationFrame(drawParticles)
    }

    drawParticles()
  }
}