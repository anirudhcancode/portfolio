// ── Krypto: site-wide Q&A chatbot widget ──
// Self-injecting, like the theme-toggle/back-to-top buttons in main.js, so a
// single <script src="js/chatbot.js"> include is all any page needs.
(function () {
  const API_URL = 'https://portfolio-chatbot-api-production.up.railway.app/chat'
  const FETCH_TIMEOUT_MS = 45000 // generous timeout for slow connections

  const GREETING = "Woof! I'm Krypto, Anirudh's digital good boy 🐾 Ask me anything about his work — I promise not to fetch you anything boring."
  const TEASER_TEXT = "Psst — got questions? Ask me anything 🐾"
  const TEASER_DELAY_MS = 3000
  const TEASER_AUTO_DISMISS_MS = 7000

  const SESSION_KEY_TEASER_SHOWN = 'krypto_teaser_shown'
  const SESSION_KEY_PANEL_OPENED = 'krypto_panel_opened'

  function sessionGet(key) {
    try { return sessionStorage.getItem(key) === '1' } catch (e) { return false }
  }

  function sessionSet(key) {
    try { sessionStorage.setItem(key, '1') } catch (e) { /* private mode etc -- fine to skip */ }
  }

  const ICON_PAW = '<circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="16" r="2" /><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />'
  const ICON_X = '<line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />'
  const ICON_SEND = '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" />'

  function svg(inner, extraClass) {
    return `<svg class="icon${extraClass ? ' ' + extraClass : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
  }

  let history = []
  let hasGreeted = false
  let isLoading = false

  // ── Build DOM ──
  const launcher = document.createElement('button')
  launcher.className = 'krypto-launcher'
  launcher.setAttribute('aria-label', 'Open chat with Krypto')
  launcher.innerHTML = svg(ICON_PAW)

  const panel = document.createElement('div')
  panel.className = 'krypto-panel'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', 'Chat with Krypto')
  panel.innerHTML = `
    <div class="krypto-panel-header">
      ${svg(ICON_PAW)}
      <div class="krypto-panel-header-text">
        <div class="krypto-panel-title">Krypto</div>
        <div class="krypto-panel-subtitle">Anirudh's portfolio assistant</div>
      </div>
      <button class="krypto-panel-close" aria-label="Close chat">${svg(ICON_X)}</button>
    </div>
    <div class="krypto-messages"></div>
    <div class="krypto-input-row">
      <input class="krypto-input" type="text" placeholder="Ask about Anirudh's work..." maxlength="500" />
      <button class="krypto-send" aria-label="Send message">${svg(ICON_SEND)}</button>
    </div>
  `

  const teaser = document.createElement('div')
  teaser.className = 'krypto-teaser'
  teaser.textContent = TEASER_TEXT

  document.body.appendChild(launcher)
  document.body.appendChild(panel)
  document.body.appendChild(teaser)

  const messagesEl = panel.querySelector('.krypto-messages')
  const inputEl = panel.querySelector('.krypto-input')
  const sendBtn = panel.querySelector('.krypto-send')
  const closeBtn = panel.querySelector('.krypto-panel-close')

  function addMessage(text, kind) {
    const el = document.createElement('div')
    el.className = kind === 'user' ? 'krypto-msg krypto-msg-user'
      : kind === 'error' ? 'krypto-msg krypto-msg-error'
      : 'krypto-msg krypto-msg-bot'
    el.textContent = text
    messagesEl.appendChild(el)
    messagesEl.scrollTop = messagesEl.scrollHeight
    return el
  }

  function showTyping() {
    const el = document.createElement('div')
    el.className = 'krypto-typing'
    el.innerHTML = '<span></span><span></span><span></span>'
    messagesEl.appendChild(el)
    messagesEl.scrollTop = messagesEl.scrollHeight
    return el
  }

  function setLoading(loading) {
    isLoading = loading
    sendBtn.disabled = loading
    inputEl.disabled = loading
  }

  async function sendMessage() {
    const text = inputEl.value.trim()
    if (!text || isLoading) return

    addMessage(text, 'user')
    inputEl.value = ''
    setLoading(true)
    const typingEl = showTyping()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-10) }),
        signal: controller.signal
      })

      const data = await res.json().catch(() => null)

      typingEl.remove()

      if (!res.ok) {
        const friendly = (data && data.detail && typeof data.detail === 'string')
          ? data.detail
          : "Ruff, something went sideways on my end. Try again in a moment?"
        addMessage(friendly, 'error')
        setLoading(false)
        clearTimeout(timeoutId)
        return
      }

      const reply = data && data.reply ? data.reply : "Ruff, I lost my train of thought. Could you ask that again?"
      addMessage(reply, 'bot')
      history.push({ role: 'user', content: text })
      history.push({ role: 'assistant', content: reply })
    } catch (err) {
      typingEl.remove()
      const message = err && err.name === 'AbortError'
        ? "Taking a while to wake up over here — Krypto naps hard on the free tier. Try again in a few seconds?"
        : "Can't reach the doghouse right now — check your connection and try again."
      addMessage(message, 'error')
    }

    clearTimeout(timeoutId)
    setLoading(false)
  }

  function openPanel() {
    panel.classList.add('is-open')
    sessionSet(SESSION_KEY_PANEL_OPENED)
    dismissTeaser()
    if (!hasGreeted) {
      hasGreeted = true
      addMessage(GREETING, 'bot')
    }
    setTimeout(() => inputEl.focus(), 150)
  }

  function closePanel() {
    panel.classList.remove('is-open')
  }

  let teaserDismissTimer = null

  function showTeaser() {
    teaser.classList.add('is-visible')
    teaserDismissTimer = setTimeout(dismissTeaser, TEASER_AUTO_DISMISS_MS)
  }

  function dismissTeaser() {
    teaser.classList.remove('is-visible')
    if (teaserDismissTimer) {
      clearTimeout(teaserDismissTimer)
      teaserDismissTimer = null
    }
  }

  if (!sessionGet(SESSION_KEY_PANEL_OPENED) && !sessionGet(SESSION_KEY_TEASER_SHOWN)) {
    setTimeout(() => {
      if (sessionGet(SESSION_KEY_PANEL_OPENED)) return
      sessionSet(SESSION_KEY_TEASER_SHOWN)
      showTeaser()
    }, TEASER_DELAY_MS)
  }

  document.addEventListener('click', () => {
    if (teaser.classList.contains('is-visible')) {
      dismissTeaser()
    }
  })

  launcher.addEventListener('click', () => {
    if (panel.classList.contains('is-open')) {
      closePanel()
    } else {
      openPanel()
    }
  })

  closeBtn.addEventListener('click', closePanel)

  sendBtn.addEventListener('click', sendMessage)

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel()
    }
  })
})()
