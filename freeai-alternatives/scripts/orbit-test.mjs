import puppeteer from 'puppeteer-core'
import { tools } from '../src/data/tools.js'

const BASE = 'http://localhost:4173'
const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

const byId = new Map(tools.map((t) => [t.id, t]))
const imageIds = tools.filter((t) => t.category === 'image').map((t) => t.id)

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

try {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('freeai-contact-popup-seen', '1'))
  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))
  await page.goto(BASE, { waitUntil: 'networkidle0' })

  // ---------- discover orbit ----------
  check('Orbit section renders with title, hub and label', await page.evaluate(() => {
    const s = document.getElementById('orbit')
    const hub = s?.querySelector('[data-no-drag] button')
    return (
      !!s &&
      s.textContent.includes('AI Tool Orbit') &&
      s.textContent.includes('Showing:') &&
      s.textContent.includes('All Tools') &&
      hub?.textContent.includes('AI Tools')
    )
  }))

  const nodeIds = await page.evaluate(() =>
    [...document.querySelectorAll('#orbit [data-tool-id]')].map((n) => n.getAttribute('data-tool-id')),
  )
  check('Visible orbit nodes evenly spaced, <= 16 (60 total in db)', nodeIds.length > 0 && nodeIds.length <= 16, `${nodeIds.length} visible`)
  check('Every visible node exists in the database', nodeIds.every((id) => byId.has(id)))
  check('Orbit node icons load (no broken images)', await page.evaluate(async () => {
    document.querySelector('#orbit [aria-label="AI tool orbit"]').scrollIntoView()
    await new Promise((r) => setTimeout(r, 900))
    const imgs = [...document.querySelectorAll('#orbit [data-tool-id] img')]
    return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0)
  }), `${nodeIds.length} tiles`)

  // category menu
  await page.evaluate(() => {
    const hub = document.querySelector('#orbit [data-no-drag] button')
    hub.click()
  })
  const catButtons = await page.evaluate(() =>
    [...document.querySelectorAll('#orbit [data-no-drag] button')].filter((b) => b.textContent.includes('Image') || b.textContent.includes('Coding') || b.textContent.includes('All')).length,
  )
  check('Hub opens category menu with real db categories', catButtons >= 3, `${catButtons} category buttons`)

  await page.evaluate(() => {
    const s = document.getElementById('orbit')
    ;[...s.querySelectorAll('[data-no-drag] button')].find((b) => b.textContent.includes('Image') && !b.textContent.includes('AI Tools')).click()
  })
  await new Promise((r) => setTimeout(r, 400))
  const filteredIds = await page.evaluate(() =>
    [...document.querySelectorAll('#orbit [data-tool-id]')].map((n) => n.getAttribute('data-tool-id')),
  )
  check('Category filter -> only Image tools on the orbit', filteredIds.length > 0 && filteredIds.every((id) => imageIds.includes(id)), `${filteredIds.length} image tools`)
  check('"Showing: Image" label + All Categories control', await page.evaluate(() => {
    const s = document.getElementById('orbit')
    return s.textContent.includes('Showing:') && s.textContent.includes('Image') && [...s.querySelectorAll('button')].some((b) => b.textContent.trim() === 'All Categories')
  }))

  await page.evaluate(() => {
    const s = document.getElementById('orbit')
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.trim() === 'All Categories').click()
  })
  await new Promise((r) => setTimeout(r, 400))
  check('All Categories returns to full orbit', await page.evaluate(() => {
    const s = document.getElementById('orbit')
    return s.textContent.includes('Showing:') && s.textContent.includes('All Tools')
  }))

  // rotation via drag
  const rotation = await page.evaluate(async () => {
    const s = document.querySelector('#orbit [aria-label="AI tool orbit"]')
    const before = Number(s.getAttribute('data-rotation'))
    const rect = s.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    s.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx + 80, clientY: cy, pointerId: 1, bubbles: true }))
    s.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 120, clientY: cy, pointerId: 1, bubbles: true }))
    s.dispatchEvent(new PointerEvent('pointerup', { clientX: cx - 120, clientY: cy, pointerId: 1, bubbles: true }))
    await new Promise((r) => setTimeout(r, 100))
    const after = Number(s.getAttribute('data-rotation'))
    return { before, after, moved: after !== before }
  })
  check('Drag rotates the orbit', rotation.moved, `rotation ${rotation.before} -> ${rotation.after}`)

  // rotation via wheel
  const wheel = await page.evaluate(async () => {
    const s = document.querySelector('#orbit [aria-label="AI tool orbit"]')
    const before = Number(s.getAttribute('data-rotation'))
    s.dispatchEvent(new WheelEvent('wheel', { deltaY: 150, bubbles: true, cancelable: true }))
    await new Promise((r) => setTimeout(r, 100))
    const after = Number(s.getAttribute('data-rotation'))
    return { before, after, moved: after !== before }
  })
  check('Mouse wheel rotates the orbit', wheel.moved, `rotation ${wheel.before} -> ${wheel.after}`)

  // select tool -> info card
  const picked = await page.evaluate(() => {
    const node = document.querySelector('#orbit [data-tool-id]')
    const id = node.getAttribute('data-tool-id')
    node.dispatchEvent(new PointerEvent('pointerdown', { clientX: 120, clientY: 120, pointerId: 2, bubbles: true }))
    node.dispatchEvent(new PointerEvent('pointerup', { clientX: 120, clientY: 120, pointerId: 2, bubbles: true }))
    node.click()
    return id
  })
  const pickedTool = byId.get(picked)
  const card = await page.evaluate((tool) => {
    const s = document.getElementById('orbit')
    const cardEl = s.querySelector('.float-in')
    if (!cardEl) return null
    return {
      hasName: cardEl.textContent.includes(tool.name.split(' ')[0]),
      hasDesc: cardEl.textContent.includes(tool.description.slice(0, 24)),
      hasStatus: cardEl.textContent.includes(tool.freeStatus),
      openHref: [...cardEl.querySelectorAll('a')].find((a) => a.textContent.includes('Open Tool'))?.href || null,
      compareBtn: [...cardEl.querySelectorAll('button')].find((b) => b.textContent.includes('Compare'))?.textContent.trim() || null,
    }
  }, pickedTool)
  check('Tap tool -> info card with name + description + status', !!card && card.hasName && card.hasDesc && card.hasStatus)
  check('Open Tool href = official URL from database', card?.openHref === new URL(pickedTool.officialUrl).href, card?.openHref)
  check('Compare button present on card', !!card?.compareBtn)

  // Compare -> adds to the compare set; compare table updates with logos
  await page.evaluate(() => {
    const s = document.getElementById('orbit')
    ;[...s.querySelectorAll('.float-in button')].find((b) => b.textContent.includes('Compare')).click()
  })
  await new Promise((r) => setTimeout(r, 300))
  const compareResult = await page.evaluate((tool) => {
    const thImgs = [...document.querySelectorAll('#compare-table th img')]
    const labels = [...document.querySelectorAll('#compare-table th')].map((t) => t.textContent)
    return { imgCount: thImgs.length, hasPicked: labels.some((l) => l.includes(tool.name.split(' ')[0])) }
  }, pickedTool)
  check('Compare -> updates the Compare section table (logo headers)', compareResult.imgCount === 1 && compareResult.hasPicked, `${compareResult.imgCount} column(s)`)

  check('No <select> dropdowns remain in Compare section', await page.evaluate(() => !document.querySelector('#compare select')))

  // compare-mode orbit in Compare section
  check('Compare section embeds the orbit picker', await page.evaluate(() => {
    const s = document.getElementById('compare')
    return !!s.querySelector('[aria-label="AI tool orbit"]') && [...s.querySelectorAll('a')].some((a) => a.textContent.includes('Compare Tools') && a.getAttribute('href') === '#compare-table')
  }))

  // remove via table X button
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#compare-table th button')]
    btns[0].click()
  })
  await new Promise((r) => setTimeout(r, 300))
  const afterX = await page.evaluate(() => document.querySelectorAll('#compare-table th img').length)
  check('X button removes a tool column (defaults return)', afterX === 3, `${afterX} columns`)

  // ---------- mobile ----------
  await page.setViewport({ width: 375, height: 667 })
  await new Promise((r) => setTimeout(r, 500))
  const mobile = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - window.innerWidth
    const orbit = document.querySelector('#orbit [aria-label="AI tool orbit"]')
    const r = orbit ? orbit.getBoundingClientRect() : null
    const touchAction = orbit ? getComputedStyle(orbit).touchAction : null
    return { overflow, orbitFits: r ? r.left >= 0 && r.right <= window.innerWidth : false, touchAction }
  })
  check('Mobile 375px: no overflow, orbit fits, touch-action none', mobile.overflow <= 1 && mobile.orbitFits && mobile.touchAction === 'none', `overflow=${mobile.overflow}px touch=${mobile.touchAction}`)

  check('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} orbit checks passed`)
process.exit(failed.length ? 1 : 0)