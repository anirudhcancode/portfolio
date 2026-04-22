// Smooth active nav link highlighting
document.addEventListener('DOMContentLoaded', () => {
    const current = window.location.pathname.split('/').pop()
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === current) {
        link.classList.add('active')
      }
    })
  })
  
  // Contact form handler
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
  
  // Fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('.skill-card, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    observer.observe(el)
  })