import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4173'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
const results = []
const check = (name, ok, extra = '') => {
  results.push(ok)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

// Mobile
await page.setViewport({ width: 390, height: 844 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
check('No horizontal overflow @390px', overflow <= 1, `overflow: ${overflow}px`)

const menuVisible = await page.$eval('button[aria-label="Toggle menu"]', (el) => getComputedStyle(el).display !== 'none')
check('Hamburger visible on mobile', menuVisible)
await page.click('button[aria-label="Toggle menu"]')
await new Promise((r) => setTimeout(r, 250))
const menuLinks = await page.evaluate(() => document.querySelectorAll('header nav a').length)
check('Mobile menu shows nav links', menuLinks >= 6, `${menuLinks} links`)
await page.click('button[aria-label="Toggle menu"]')

// Compare table scrollable on mobile
const compareScrollable = await page.evaluate(() => {
  const el = document.querySelector('#compare .overflow-x-auto')
  return el ? el.scrollWidth > el.clientWidth : false
})
check('Compare table scrolls horizontally on mobile', compareScrollable)

// QR visible on mobile
const qrOnScreen = await page.evaluate(() => {
  const c = document.querySelector('#support canvas')
  if (!c) return false
  const r = c.getBoundingClientRect()
  return r.width > 0 && r.height > 0
})
check('QR canvas present on mobile', qrOnScreen)

// Desktop
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
const dOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
check('No horizontal overflow @1440px', dOverflow <= 1, `overflow: ${dOverflow}px`)

// All required section anchors exist
for (const id of ['home', 'search', 'categories', 'featured', 'finder', 'alternatives', 'compare', 'students', 'open-source', 'support', 'about', 'contact']) {
  const exists = await page.$(`#${id}`)
  check(`Section #${id}`, !!exists)
}

// Featured cards count
const featuredCount = await page.$$eval('#featured a', (els) => els.length)
check('Featured has 8 picks', featuredCount === 8, `${featuredCount}`)

// Student grid + CTA
const studentCount = await page.$$eval('#students article', (els) => els.length)
check('Student section has tools', studentCount >= 10, `${studentCount} cards`)

// Open source section cards
const osCount = await page.$$eval('#open-source article', (els) => els.length)
check('Open source section has tools', osCount >= 8, `${osCount} cards`)

// Details expansion
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('#alternatives article button')].find((b) => b.textContent.includes('Details'))
  btn?.click()
})
await new Promise((r) => setTimeout(r, 300))
const detailsShown = await page.evaluate(() => document.body.textContent.includes('Last checked: 2026-08-13'))
check('Card Details expands with last-checked date', detailsShown)

await browser.close()
const failed = results.filter((r) => !r).length
console.log(`\n${results.length - failed}/${results.length} layout checks passed`)
process.exit(failed ? 1 : 0)
