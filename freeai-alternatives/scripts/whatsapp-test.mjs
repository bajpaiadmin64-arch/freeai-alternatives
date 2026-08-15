import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4173'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

let passed = 0
let failed = 0

function check(name, ok, detail = '') {
  if (ok) {
    passed++
    console.log(`PASS  ${name}${detail ? `  — ${detail}` : ''}`)
  } else {
    failed++
    console.log(`FAIL  ${name}${detail ? `  — ${detail}` : ''}`)
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 2400, deviceScaleFactor: 1 })
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem('freeai-contact-popup-seen', '1')
})
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
await page.goto(BASE, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))

const btn = await page.evaluate(() => {
  const el = document.querySelector('a[aria-label="Chat on WhatsApp for support"]')
  if (!el) return null
  const cs = getComputedStyle(el)
  const rect = el.getBoundingClientRect()
  return {
    href: el.getAttribute('href'),
    target: el.getAttribute('target'),
    rel: el.getAttribute('rel'),
    title: el.getAttribute('title'),
    position: cs.position,
    zIndex: cs.zIndex,
    bottom: cs.bottom,
    right: cs.right,
    label: el.textContent.trim().replace(/\s+/g, ' '),
    rectRight: Math.round(rect.right),
    viewport: window.innerWidth,
  }
})

check('WhatsApp button present', !!btn)
if (btn) {
  check('WhatsApp href uses wa.me number', btn.href === 'https://wa.me/917706929484', btn.href)
  check('Opens in new tab safely', btn.target === '_blank' && btn.rel === 'noopener noreferrer', `target=${btn.target} rel=${btn.rel}`)
  check('Fixed position (stays on scroll)', btn.position === 'fixed', btn.position)
  check('Bottom-right placement', btn.bottom.includes('20px') || btn.bottom.includes('24px') || btn.bottom.includes('16px'), `bottom=${btn.bottom} right=${btn.right}`)
  check('Button fully inside viewport', btn.rectRight <= btn.viewport, `${btn.rectRight}px of ${btn.viewport}px`)
  check('Label reads WhatsApp Support', btn.label.includes('WhatsApp Support'), btn.label)
  check('Stacks below contact popup (z-70)', Number(btn.zIndex) < 70, `z=${btn.zIndex}`)
}

const logo = await page.evaluate(() => {
  const headerLogo = document.querySelector('header a[href="#home"] svg, header svg')
  const favicon = document.querySelector('link[rel="icon"]')
  const themeColor = document.querySelector('meta[name="theme-color"]')
  return {
    hasSvg: !!headerLogo,
    circles: headerLogo ? headerLogo.querySelectorAll('circle').length : 0,
    faviconHref: favicon ? favicon.getAttribute('href') : null,
    themeColor: themeColor ? themeColor.getAttribute('content') : null,
  }
})

check('Header logo renders new SVG mark', logo.hasSvg && logo.circles >= 5, `${logo.circles} circles (hub + ring nodes)`)
check('Favicon linked', !!logo.faviconHref, logo.faviconHref)
check('theme-color is primary teal', logo.themeColor === '#006078', logo.themeColor)

const faviconOk = await page.evaluate(async () => {
  const res = await fetch('/favicon.svg')
  const text = await res.text()
  return { status: res.status, teal: text.includes('#006078'), coral: text.includes('#E07A5F') }
})
check('Favicon loads (200)', faviconOk.status === 200, `status=${faviconOk.status}`)
check('Favicon uses new palette', faviconOk.teal && faviconOk.coral, 'teal tile + coral node')

const footer = await page.evaluate(() => {
  const el = document.querySelector('footer')
  const cs = getComputedStyle(el)
  const link = el.querySelector('a')
  const linkColor = getComputedStyle(link).color
  return { bg: cs.backgroundColor, linkColor }
})
check('Footer uses deep slate teal', footer.bg === 'rgb(58, 82, 83)', footer.bg)
check('Footer links light text on dark', footer.linkColor !== 'rgb(0, 0, 0)', footer.linkColor)

await page.setViewport({ width: 375, height: 2400, deviceScaleFactor: 1 })
await new Promise((r) => setTimeout(r, 600))
const mobile = await page.evaluate(() => {
  const w = window.innerWidth
  const el = document.querySelector('a[aria-label="Chat on WhatsApp for support"]')
  const r = el.getBoundingClientRect()
  return { w, left: Math.round(r.left), right: Math.round(r.right), overflow: document.documentElement.scrollWidth - w }
})
check('Mobile 375px: button fits, no overflow', mobile.left >= 0 && mobile.right <= mobile.w && mobile.overflow <= 0, `right=${mobile.right}px overflow=${mobile.overflow}px`)

await page.evaluate(() => document.querySelector('a[aria-label="Chat on WhatsApp for support"]')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 600))
const stillVisible = await page.evaluate(() => {
  const el = document.querySelector('a[aria-label="Chat on WhatsApp for support"]')
  const r = el.getBoundingClientRect()
  return r.top >= 0 && r.bottom <= window.innerHeight
})
check('Button stays on screen while scrolled', stillVisible)

check('No console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))

console.log(`\n${passed}/${passed + failed} whatsapp/logo checks passed`)
await browser.close()
process.exit(failed > 0 ? 1 : 0)