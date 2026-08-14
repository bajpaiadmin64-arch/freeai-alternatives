import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4173'
const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok, extra })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

try {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('freeai-contact-popup-seen', '1')
  })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))

  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })

  const h1 = await page.$eval('h1', (el) => el.textContent.trim())
  check('H1 headline', h1.includes('Stop Paying for AI'), h1.slice(0, 40))

  const cardCount = () =>
    page.$$eval('#alternatives article', (els) => els.length)
  const cards = await cardCount()
  check('Tool cards rendered (>= 55)', cards >= 55, `${cards} cards`)

  const title = await page.title()
  check('SEO title', title.includes('Free AI Alternatives'), title)

  const meta = await page.$eval('meta[name="description"]', (el) => el.content)
  check('Meta description', meta.length > 40)

  const cardText = await page.$eval('#alternatives article', (el) => el.textContent)
  check('Card shows free status', /Free Tier|Completely Free|Open Source/.test(cardText))
  check('Card has Use for Free CTA', cardText.includes('Use for Free'))
  check('Card has Details button', cardText.includes('Details'))

  const links = await page.$$eval('#alternatives article a[target="_blank"]', (els) => els.map((a) => a.href))
  check('Card CTAs open in new tab', links.length === cards, `${links.length} links`)
  check('All card links are https', links.every((l) => l.startsWith('https://')), links.filter((l) => !l.startsWith('https://')).length + ' non-https')
  const badDomains = links.filter((l) => /pirate|crack|gpt4free|unlock/i.test(l))
  check('No suspicious domains', badDomains.length === 0)

  // Search
  await page.type('#tool-search', 'deepseek')
  await new Promise((r) => setTimeout(r, 400))
  const afterSearch = await cardCount()
  check('Search filters to DeepSeek', afterSearch >= 1 && afterSearch <= 2, `${afterSearch} result(s)`)

  // Clear search, category filter
  await page.click('#tool-search')
  await page.keyboard.down('Control')
  await page.keyboard.press('KeyA')
  await page.keyboard.up('Control')
  await page.keyboard.press('Backspace')
  await new Promise((r) => setTimeout(r, 300))
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#categories button')]
    const target = btns.find((b) => b.textContent.trim() === 'Coding')
    target?.click()
  })
  await new Promise((r) => setTimeout(r, 500))
  const afterCat = await cardCount()
  check('Coding category filter', afterCat >= 6 && afterCat <= 12, `${afterCat} cards`)

  // Dark mode
  const beforeDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await page.click('button[aria-label="Switch to dark mode"], button[aria-label="Switch to light mode"]')
  await new Promise((r) => setTimeout(r, 200))
  const afterDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  check('Dark mode toggles', beforeDark !== afterDark)
  const saved = await page.evaluate(() => localStorage.getItem('freeai-theme'))
  check('Theme persisted in localStorage', saved === 'dark' || saved === 'light', saved)

  // Alternative finder
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#finder button')]
    const target = btns.find((b) => b.textContent.trim() === 'Perplexity')
    target?.click()
  })
  await new Promise((r) => setTimeout(r, 400))
  const finderNote = await page.$eval('#finder', (el) => el.textContent)
  check('Alternative finder works', finderNote.includes('Looking for a Perplexity alternative'))

  // Compare via card button
  const firstCompareBtn = await page.$('#alternatives article button[aria-pressed="false"]')
  if (firstCompareBtn) {
    await firstCompareBtn.click()
    await new Promise((r) => setTimeout(r, 400))
    const compareCells = await page.$$eval('#compare th', (els) => els.length)
    check('Compare table has 4 columns (1 label + 3 tools)', compareCells >= 4, `${compareCells} header cells`)
  } else {
    check('Compare button on card', false, 'no compare button found')
  }

  // UPI
  const qrHasPixels = await page.evaluate(() => {
    const c = document.querySelector('canvas')
    if (!c) return false
    const ctx = c.getContext('2d')
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let nonWhite = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 200) nonWhite++
    }
    return nonWhite > 1000
  })
  check('UPI QR canvas rendered', qrHasPixels)

  const upiButtons = await page.$$eval('#support a[href^="upi://"]', (els) => els.map((a) => a.href))
  check('4 donation buttons (₹10/20/50/100)', upiButtons.length === 4, upiButtons.map((u) => u.match(/am=(\d+)/)?.[1]).join(','))
  check('Donation links use correct UPI ID', upiButtons.every((u) => u.includes('pa=7706929484@axl')))

  // Contact
  const phone = await page.$eval('a[href^="tel:"]', (el) => el.getAttribute('href'))
  check('Phone is clickable', phone === 'tel:+917706929484', phone)
  const email = await page.$eval('a[href^="mailto:"]', (el) => el.getAttribute('href'))
  check('Email is clickable', email === 'mailto:utkarshbajpai068@gmail.com', email)

  // Footer
  const footer = await page.$eval('footer', (el) => el.textContent)
  check('Footer copyright', footer.includes('© 2026 FreeAI Alternatives'), footer.match(/©\s*2026[^—]*/)?.[0]?.slice(0, 40))

  // Disclaimer + no fake claims
  const bodyText = await page.$eval('body', (el) => el.textContent)
  check('Disclaimer present', bodyText.includes('not affiliated with OpenAI'))
  check('No fake claims', !/unlimited chatgpt|gpt-5 without limits|completely unlocked/i.test(bodyText))
  check('About section', bodyText.includes('We do not provide cracked, pirated or unauthorized access'))
  check('Student section', bodyText.includes('Free AI Tools for Students'))

  check('No console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)