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

document.addEventListener('DOMContentLoaded', () => {
  const heroName = document.getElementById('hero-name')
  const typedTitle = document.getElementById('typed-title')
  const heroTag = document.getElementById('hero-tag')
  const heroSub = document.getElementById('hero-sub')
  const heroBtns = document.getElementById('hero-btns')

  if (heroName && typedTitle) {
    // Step 1 — fade in tag
    setTimeout(() => {
      fadeIn(heroTag, 400)
    }, 200)

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

// ── Dark / Light mode toggle
const toggle = document.createElement('button')
toggle.className = 'theme-toggle'
toggle.innerHTML = '☀️'
toggle.title = 'Toggle light/dark mode'
document.body.appendChild(toggle)

const savedTheme = localStorage.getItem('theme') || 'dark'
if (savedTheme === 'light') {
  document.body.classList.add('light-mode')
  toggle.innerHTML = '🌙'
}

toggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode')
  const isLight = document.body.classList.contains('light-mode')
  toggle.innerHTML = isLight ? '🌙' : '☀️'
  localStorage.setItem('theme', isLight ? 'light' : 'dark')
})

// ── Animate progress bars on load
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width + '%'
    }, 2000)
  })
})

// ── Particle background
const canvas = document.getElementById('particles')
if (canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.1
  }))

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`
      ctx.fill()
      p.x += p.dx
      p.y += p.dy
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1
    })
    requestAnimationFrame(drawParticles)
  }

  drawParticles()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}