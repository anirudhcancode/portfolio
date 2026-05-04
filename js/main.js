// ── Active nav link
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active')
    }
  })
})

// ── Typing animation on hero
const typingEl = document.querySelector('.typing-text')
if (typingEl) {
  const words = ['Data Engineer', 'AI/ML Developer', 'Data Analyst', 'NLP Engineer', 'Problem Solver']
  let wordIndex = 0
  let charIndex = 0
  let deleting = false

  function type() {
    const current = words[wordIndex]
    if (!deleting) {
      typingEl.textContent = current.substring(0, charIndex + 1)
      charIndex++
      if (charIndex === current.length) {
        deleting = true
        setTimeout(type, 1800)
        return
      }
    } else {
      typingEl.textContent = current.substring(0, charIndex - 1)
      charIndex--
      if (charIndex === 0) {
        deleting = false
        wordIndex = (wordIndex + 1) % words.length
      }
    }
    setTimeout(type, deleting ? 60 : 100)
  }
  type()
}

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

// ── Contact form handler
function handleSubmit() {
  const name = document.querySelector('input[type="text"]')?.value
  const email = document.querySelector('input[type="email"]')?.value
  const message = document.querySelector('textarea')?.value

  if (!name || !email || !message) {
    alert('Please fill in all fields.')
    return
  }

  const mailto = `mailto:anirudhravipudi@outlook.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`
  window.location.href = mailto
}

// ── Animate progress bars immediately on load
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width + '%'
    }, 500)
  })
})