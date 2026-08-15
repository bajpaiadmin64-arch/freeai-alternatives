import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:4173'
const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

try {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('freeai-contact-popup-seen', '1'))
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))
  await page.goto(BASE, { waitUntil: 'networkidle0' })

  const measure = () => page.evaluate(() => {
    const orbit = document.querySelector('#orbit [aria-label="AI tool orbit"]')
    const o = orbit.getBoundingClientRect()
    const hub = document.querySelector('#orbit [data-no-drag] button')
    const h = hub.getBoundingClientRect()
    const nodes = [...document.querySelectorAll('#orbit [data-tool-id]')].map((n) => {
      const r = n.getBoundingClientRect()
      return {
        id: n.getAttribute('data-tool-id'),
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        w: n.offsetWidth,
        h: n.offsetHeight,
        opacity: Number(getComputedStyle(n).opacity),
        scale: /scale\(([\d.]+)\)/.exec(n.style.transform)?.[1] ? parseFloat(/scale\(([\d.]+)\)/.exec(n.style.transform)[1]) : 1,
      }
    })
    return {
      cx: o.left + o.width / 2,
      cy: o.top + o.height / 2,
      hubCx: h.left + h.width / 2,
      hubCy: h.top + h.height / 2,
      nodes,
    }
  })

  // --- desktop: all tools (60) ---
  let m = await measure()

  const hubOffset = Math.hypot(m.hubCx - m.cx, m.hubCy - m.cy)
  check('Hub button exactly at orbit center (<= 0.5px)', hubOffset <= 0.5, `${round(hubOffset)}px`)

  const radii = m.nodes.map((n) => Math.hypot(n.x - m.cx, n.y - m.cy))
  const rMin = Math.min(...radii)
  const rMax = Math.max(...radii)
  const rMean = radii.reduce((a, b) => a + b, 0) / radii.length
  check('All tools on one circle (equal radial distance, <= 0.5px spread)', rMax - rMin <= 0.5, `R=${round(rMean)}px spread=${round(rMax - rMin, 2)}px`)

  const angles = m.nodes.map((n) => {
    let a = (Math.atan2(n.y - m.cy, n.x - m.cx) * 180) / Math.PI + 90
    return ((a % 360) + 360) % 360
  }).sort((a, b) => a - b)
  const gaps = angles.slice(1).map((a, i) => a - angles[i]).concat([angles[0] + 360 - angles[angles.length - 1]])
  const gMean = gaps.reduce((a, b) => a + b, 0) / gaps.length
  const gDev = Math.max(...gaps) - Math.min(...gaps)
  check('Equal angular spacing (360/N)', gaps.length >= 6 && gDev <= 0.5, `${round(gMean)}deg avg, spread ${round(gDev, 2)}deg`)

  const sizes = new Set(m.nodes.map((n) => `${n.w}x${n.h}`))
  check('Identical tool container sizes', sizes.size === 1, [...sizes][0])

  // no visual overlap: center distance >= half visual width sum (icon scale applies to whole node)
  let overlap = 0
  for (let i = 0; i < m.nodes.length; i++) {
    for (let j = i + 1; j < m.nodes.length; j++) {
      const a = m.nodes[i]
      const b = m.nodes[j]
      if (a.opacity < 0.02 || b.opacity < 0.02) continue
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const need = (a.w * a.scale + b.w * b.scale) / 2
      if (d < need) overlap++
    }
  }
  check('No overlapping tools', overlap === 0, `${overlap} overlaps`)

  // rigid rotation: drag, then re-measure radius/spacing unchanged, hub fixed
  const before = await page.evaluate(() => Number(document.querySelector('#orbit [aria-label="AI tool orbit"]').getAttribute('data-rotation')))
  await page.evaluate(async () => {
    const s = document.querySelector('#orbit [aria-label="AI tool orbit"]')
    const rect = s.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    s.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx + 90, clientY: cy, pointerId: 1, bubbles: true }))
    s.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 100, clientY: cy, pointerId: 1, bubbles: true }))
    s.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 160, clientY: cy, pointerId: 1, bubbles: true }))
    s.dispatchEvent(new PointerEvent('pointerup', { clientX: cx - 160, clientY: cy, pointerId: 1, bubbles: true }))
    await new Promise((r) => setTimeout(r, 400))
  })
  const after = await page.evaluate(() => Number(document.querySelector('#orbit [aria-label="AI tool orbit"]').getAttribute('data-rotation')))
  check('Drag rotates the orbit', after !== before, `rotation ${before} -> ${after}`)

  m = await measure()
  const radii2 = m.nodes.map((n) => Math.hypot(n.x - m.cx, n.y - m.cy))
  const r2Mean = radii2.reduce((a, b) => a + b, 0) / radii2.length
  check('Rotation keeps radius identical (<= 0.5px)', Math.abs(r2Mean - rMean) <= 0.5, `R=${round(r2Mean)}px`)
  const hubOffset2 = Math.hypot(m.hubCx - m.cx, m.hubCy - m.cy)
  check('Center button still exactly centered after rotation', hubOffset2 <= 0.5, `${round(hubOffset2)}px`)

  // --- category: image (8 tools, full circle 45deg) ---
  await page.evaluate(() => {
    const s = document.getElementById('orbit')
    ;[...s.querySelectorAll('[data-no-drag] button')].find((b) => b.textContent.includes('AI Tools')).click()
  })
  await new Promise((r) => setTimeout(r, 300))
  await page.evaluate(() => {
    const s = document.getElementById('orbit')
    ;[...s.querySelectorAll('[data-no-drag] button')].find((b) => b.textContent.includes('Image') && !b.textContent.includes('AI Tools')).click()
  })
  await new Promise((r) => setTimeout(r, 600))
  m = await measure()
  check('Image category (8 tools) centered', Math.hypot(m.hubCx - m.cx, m.hubCy - m.cy) <= 0.5)
  const gapsI = m.nodes.map((n) => {
    let a = (Math.atan2(n.y - m.cy, n.x - m.cx) * 180) / Math.PI + 90
    return ((a % 360) + 360) % 360
  }).sort((a, b) => a - b)
  const gapsISp = gapsI.slice(1).map((a, i) => a - gapsI[i]).concat([gapsI[0] + 360 - gapsI[gapsI.length - 1]])
  check('Image category: 8 tools at exactly 45deg', m.nodes.length === 8 && Math.max(...gapsISp) - Math.min(...gapsISp) <= 0.5, `${round(gapsISp[0])}deg`)
  const radiiI = m.nodes.map((n) => Math.hypot(n.x - m.cx, n.y - m.cy))
  check('Image category: same radius', Math.max(...radiiI) - Math.min(...radiiI) <= 0.5)

  // --- mobile ---
  await page.setViewport({ width: 375, height: 667 })
  await new Promise((r) => setTimeout(r, 600))
  m = await measure()
  check('Mobile: hub centered', Math.hypot(m.hubCx - m.cx, m.hubCy - m.cy) <= 0.5, `${round(Math.hypot(m.hubCx - m.cx, m.hubCy - m.cy))}px`)
  const radiiM = m.nodes.map((n) => Math.hypot(n.x - m.cx, n.y - m.cy))
  check('Mobile: one circle (equal radius)', Math.max(...radiiM) - Math.min(...radiiM) <= 0.5, `${m.nodes.length} nodes R=${round(radiiM[0])}px`)
  const sizesM = new Set(m.nodes.map((n) => `${n.w}x${n.h}`))
  check('Mobile: identical container sizes', sizesM.size === 1, [...sizesM][0])

  check('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} geometry checks passed`)
process.exit(failed.length ? 1 : 0)