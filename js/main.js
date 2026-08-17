// ── Terminal hero entrance
// Types a command's text into an element, character by character, once.
function typeCommand(element, text, speed, callback) {
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
  const heroBtns = document.getElementById('hero-btns')
  const terminal = document.querySelector('.terminal')

  if (terminal) {
    const CHAR_SPEED = 38
    const PAUSE_BETWEEN_COMMANDS = 650
    const OUTPUT_REVEAL_DELAY = 150

    const commands = [
      { cmdId: 'cmd-1', outId: 'out-1', text: 'whoami' },
      { cmdId: 'cmd-2', outId: 'out-2', text: 'role --current' },
      { cmdId: 'cmd-3', outId: 'out-3', text: 'cat about.txt' },
      { cmdId: 'cmd-4', outId: 'out-4', text: 'status --current-work' },
      { cmdId: 'cmd-5', outId: 'out-5', text: 'status --seeking' },
      { cmdId: 'cmd-6', outId: 'out-6', text: 'availability' }
    ]

    function runCommand(index) {
      if (index >= commands.length) {
        // Sequence complete — reveal the idle prompt, then the buttons
        setTimeout(() => {
          const finalLine = document.getElementById('term-final-line')
          if (finalLine) fadeIn(finalLine, 400)
          setTimeout(() => fadeIn(heroBtns), 400)
        }, 300)
        return
      }

      const { cmdId, outId, text } = commands[index]
      const cmdEl = document.getElementById(cmdId)
      const outEl = document.getElementById(outId)

      typeCommand(cmdEl, text, CHAR_SPEED, () => {
        setTimeout(() => {
          outEl.classList.add('visible')
          setTimeout(() => runCommand(index + 1), PAUSE_BETWEEN_COMMANDS)
        }, OUTPUT_REVEAL_DELAY)
      })
    }

    setTimeout(() => runCommand(0), 500)
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
toggle.innerHTML = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>'
toggle.title = 'Toggle navy mode'
document.body.appendChild(toggle)

const savedTheme = localStorage.getItem('theme') || 'cosmic'
if (savedTheme === 'navy') {
  document.body.classList.add('light-mode')
  toggle.innerHTML = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>'
  toggle.title = 'Toggle cosmic mode'
}

toggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode')
  const isNavy = document.body.classList.contains('light-mode')
  toggle.innerHTML = isNavy ? '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>' : '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>'
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