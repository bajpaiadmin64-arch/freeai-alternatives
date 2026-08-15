import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

try {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('freeai-contact-popup-seen', '1'))
  const broken = []
  const consoleErrors = []
  page.on('requestfailed', (r) => broken.push(r.url()))
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  await page.goto(BASE, { waitUntil: 'networkidle0' })

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 150))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, 900))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 300))
  })

  const data = await page.evaluate(() => {
    const grid = document.querySelector('#alternatives')
    const allCards = grid ? [...grid.querySelectorAll('article.card')] : []
    const seen = new Set()
    const imgs = allCards.map((c) => {
      const name = c.querySelector('h3')?.textContent.trim()
      const img = c.querySelector('img')
      if (name && !seen.has(name)) {
        seen.add(name)
        return { name, src: img ? img.getAttribute('src') : null, loaded: img ? img.naturalWidth > 0 : false }
      }
      return null
    }).filter(Boolean)
    return {
      count: seen.size,
      iconCount: imgs.filter((i) => i.src).length,
      brokenCount: imgs.filter((i) => i.src && !i.loaded).length,
      brokenNames: imgs.filter((i) => i.src && !i.loaded).map((i) => i.name).join(', '),
    }
  })

  check(`All tool cards render an icon image (${data.iconCount}/${data.count})`, data.iconCount === data.count)
  check('No card shows a broken icon after scrolling', data.brokenCount === 0, data.brokenNames)
  check('No failed network requests for local icons', !broken.some((u) => u.includes('/icons/')), broken.filter((u) => u.includes('/icons/')).join(', '))

  const floating = await page.evaluate(() => {
    const home = document.querySelector('#home')
    if (!home) return { ok: false, reason: 'no #home' }
    const chips = [...home.querySelectorAll('span.tile')].filter((t) => t.querySelector('img'))
    const loaded = chips.every((t) => t.querySelector('img').naturalWidth > 0)
    const srcs = chips.map((t) => t.querySelector('img').getAttribute('src'))
    const hasGemini = srcs.some((s) => s.includes('gemini'))
    const hasDeepseek = srcs.some((s) => s.includes('deepseek'))
    return {
      ok: chips.length === 2 && loaded && hasGemini && hasDeepseek,
      count: chips.length,
      srcs,
    }
  })
  check('Floating chips: exactly 2, official Gemini + DeepSeek icons, loaded', floating.ok, floating.srcs.join(', '))

  const featured = await page.evaluate(() => {
    const f = document.querySelector('#featured')
    if (!f) return { ok: false, count: -1 }
    const imgs = [...f.querySelectorAll('img')]
    return { ok: imgs.length >= 4 && imgs.every((i) => i.naturalWidth > 0), count: imgs.length }
  })
  check('Featured section shows loaded icons', featured.ok, `count=${featured.count}`)

  const alt = await page.evaluate(() => {
    const a = document.querySelector('#finder')
    if (!a) return { ok: false, count: -1 }
    const imgs = [...a.querySelectorAll('img')]
    return { ok: imgs.length >= 4 && imgs.every((i) => i.naturalWidth > 0), count: imgs.length }
  })
  check('Alternative finder shows loaded icons', alt.ok, `count=${alt.count}`)

  const searchOk = await page.evaluate(async () => {
    const input = document.querySelector('#alternatives input[type="search"]')
    if (!input) return { ok: false, reason: 'no input' }
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(input, 'deepseek')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 600))
    const grid = document.querySelector('#alternatives')
    const names = [...grid.querySelectorAll('h3')].map((h) => h.textContent.trim())
    const img = grid.querySelector('article.card img')
    return { ok: names.length === 1 && names[0].toLowerCase().includes('deepseek') && img && img.naturalWidth > 0, names }
  })
  check('Search works and filtered card has loaded icon', searchOk.ok, searchOk.reason || searchOk.names.join(', '))

  await page.reload({ waitUntil: 'networkidle0' })
  await page.setViewport({ width: 375, height: 667 })
  await new Promise((r) => setTimeout(r, 600))
  const mobile = await page.evaluate(() => {
    const grid = document.querySelector('#alternatives')
    const cards = [...grid.querySelectorAll('article.card')].slice(0, 6)
    const tiles = cards.map((c) => {
      const tile = c.querySelector('span.tile')
      const img = c.querySelector('img')
      if (!tile || !img) return null
      const t = tile.getBoundingClientRect()
      const i = img.getBoundingClientRect()
      return i.width <= t.width && i.height <= t.height
    }).filter((x) => x !== null)
    const overflow = document.documentElement.scrollWidth - window.innerWidth
    return { ok: tiles.length === 6 && tiles.every(Boolean) && overflow <= 1, overflow }
  })
  check('Mobile 375px: icons fit inside tiles, no overflow', mobile.ok, `overflow=${mobile.overflow}px`)

  check('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} icon checks passed`)
process.exit(failed.length ? 1 : 0)