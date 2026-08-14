import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4173'
const out = process.env.TEMP ? `${process.env.TEMP}/opencode` : '.'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

const page = await browser.newPage()

await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.screenshot({ path: `${out}/shot-desktop-top.png` })

await page.evaluate(() => document.getElementById('alternatives').scrollIntoView())
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: `${out}/shot-desktop-grid.png` })

await page.evaluate(() => document.getElementById('support').scrollIntoView())
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: `${out}/shot-desktop-support.png` })

await page.setViewport({ width: 390, height: 844 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.screenshot({ path: `${out}/shot-mobile-top.png` })

await page.click('button[aria-label="Toggle menu"]')
await new Promise((r) => setTimeout(r, 300))
await page.screenshot({ path: `${out}/shot-mobile-menu.png` })

await browser.close()
console.log('screenshots saved to ' + out)
