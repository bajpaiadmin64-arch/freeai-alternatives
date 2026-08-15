import puppeteer from 'puppeteer-core'
import { analyzeRequest } from '../src/utils/workflowEngine.js'
import { tools } from '../src/data/tools.js'

const BASE = 'http://localhost:4173'
const results = []
const check = (name, ok, extra = '') => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

const dbById = new Map(tools.map((t) => [t.id, t]))

// ---------- Part A: engine unit tests ----------
{
  const r = analyzeRequest('I want to make a YouTube video from an idea. I need a script, voiceover, subtitles and a thumbnail.')
  check('YouTube request -> workflow found', r.ok)
  if (r.ok) {
    check('YouTube workflow has >= 4 steps', r.steps.length >= 4, `${r.steps.length} steps`)
    const labels = r.steps.map((s) => s.label).join(' | ')
    check('YouTube workflow covers script/voiceover/subtitles/thumbnail', ['Script', 'Voiceover', 'Subtitles', 'Thumbnail'].every((w) => labels.includes(w)), labels)
    check('Best match is the video tool (primary requirement)', r.best.tool.id === 'invideo', r.best.tool.name)
  }
  for (const s of r.steps) {
    check(`Step tool "${s.tool.id}" exists in the database`, dbById.has(s.tool.id))
    check(`Step URL "${s.tool.id}" matches database URL`, dbById.get(s.tool.id)?.officialUrl === s.tool.officialUrl)
    if (s.alternative) check(`Alternative "${s.alternative.id}" exists in the database`, dbById.has(s.alternative.id))
  }

  const r2 = analyzeRequest('I want to research a college assignment, summarize PDFs, and create a presentation.')
  check('Research/summarize/presentation -> workflow found', r2.ok)
  if (r2.ok) {
    const labels = r2.steps.map((s) => s.label).join(' | ')
    check('Covers research + summarize + presentation', ['Research', 'Summarize', 'Presentation'].every((w) => labels.includes(w)), labels)
    check('Best match = research tool', r2.best.tool.id === 'perplexity', r2.best.tool.name)
  }

  const r3 = analyzeRequest('I need a free AI tool to remove the background from product photos.')
  check('Background removal -> canva recommended', r3.ok && r3.steps.some((s) => s.tool.id === 'canva'))

  const r4 = analyzeRequest('Help me study for an exam')
  check('Exam study -> quizlet recommended', r4.ok && r4.steps.some((s) => s.tool.id === 'quizlet'))

  const r5 = analyzeRequest('I need help with coding')
  check('Coding -> a coding-capable tool recommended', r5.ok && ['coding-chat', 'coding-build'].includes(r5.intents[0]))

  const r6 = analyzeRequest('I need to create AI images')
  check('AI images -> image tool recommended', r6.ok && r6.steps.some((s) => ['image-gen', 'image-edit', 'design', 'thumbnail'].includes(s.key)))

  const r7 = analyzeRequest('I need to analyze a PDF')
  check('PDF analysis -> notebooklm/kimi/claude/gemini', r7.ok && r7.steps.some((s) => ['notebooklm', 'kimi', 'claude', 'gemini'].includes(s.tool.id)))

  const r8 = analyzeRequest('I want to use chatgpt to write an essay')
  check('Explicit ChatGPT mention -> ChatGPT chosen', r8.ok && r8.steps.some((s) => s.tool.id === 'chatgpt'))

  const r9 = analyzeRequest('Hello world testing')
  check('Vague short input -> unclear state', !r9.ok && r9.reason === 'unclear')

  const r10 = analyzeRequest('I want to make a podcast with ai')
  check('Podcast (no matching tool) -> no-match state', !r10.ok && r10.reason === 'no-match')

  const r11 = analyzeRequest('   ')
  check('Empty input -> empty state', !r11.ok && r11.reason === 'empty')

  const r12 = analyzeRequest('study')
  check('Short but clear request still works', r12.ok && r12.steps.some((s) => s.tool.id === 'quizlet'))
}

// ---------- Part B: browser e2e ----------
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

  check('Section renders with title + subtitle + input + button', await page.evaluate(() => {
    const s = document.getElementById('workflow')
    return (
      !!s &&
      s.textContent.includes('Tell Me What You Need') &&
      s.textContent.includes('Describe what you want to accomplish') &&
      !!document.querySelector('textarea[aria-label="Describe what you want to accomplish"]') &&
      s.textContent.includes('Find My AI Workflow')
    )
  }))

  const chipCount = await page.$$eval('#workflow button.chip', (els) => els.length)
  check('Example prompt chips render (5)', chipCount === 5, `${chipCount} chips`)

  await page.evaluate(() => {
    const chips = [...document.querySelectorAll('#workflow button.chip')]
    chips.find((c) => c.textContent.includes('study for an exam')).click()
  })
  const loadingSeen = await page.waitForSelector('#workflow [role="status"]', { timeout: 3000 }).then(() => true).catch(() => false)
  check('Loading animation appears', loadingSeen)
  await page.waitForFunction(() => document.querySelector('#workflow')?.textContent.includes('Best match for you'), { timeout: 8000 })
  const exam = await page.evaluate(() => {
    const s = document.getElementById('workflow')
    const steps = [...s.querySelectorAll('ol li')].map((li) => li.textContent)
    const tryLinks = [...s.querySelectorAll('a')].filter((a) => a.textContent.includes('Try Tool')).map((a) => a.href)
    return { steps, tryLinks, hasQuizlet: steps.some((t) => t.includes('Quizlet')) }
  })
  check('Exam workflow -> 1 step with Quizlet', exam.steps.length === 1 && exam.hasQuizlet, `steps=${exam.steps.length}`)
  check('Try Tool buttons link to official https URLs', exam.tryLinks.length === 1 && exam.tryLinks[0].startsWith('https://'))

await page.evaluate(() => {
    const s = document.getElementById('workflow')
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.includes('Save Workflow')).click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  const savedBtn = await page.waitForFunction(() => document.querySelector('#workflow')?.textContent.includes('Saved in Browser'), { timeout: 5000 }).then(() => true).catch(() => false)
  check('Save Workflow stores entry in LocalStorage', savedBtn && (await page.evaluate(() => JSON.parse(localStorage.getItem('freeai-saved-workflows') || '[]').length)) === 1)

  await page.evaluate(() => {
    const s = document.getElementById('workflow')
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.includes('Saved in Browser')).click()
  })
  check('Unsave removes the LocalStorage entry', (await page.evaluate(() => JSON.parse(localStorage.getItem('freeai-saved-workflows') || '[]').length)) === 0)

  await page.evaluate(() => {
    const s = document.getElementById('workflow')
    const ta = s.querySelector('textarea')
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    setter.call(ta, 'I want to make a YouTube video. I need a script, voiceover, subtitles and a thumbnail.')
    ta.dispatchEvent(new Event('input', { bubbles: true }))
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.includes('Find My AI Workflow')).click()
  })
  await page.waitForFunction(() => document.querySelector('#workflow')?.textContent.includes('Best match for you'), { timeout: 8000 })
  const youtube = await page.evaluate(() => {
    const s = document.getElementById('workflow')
    const steps = [...s.querySelectorAll('ol li')]
    const altCount = s.textContent.includes('Free Alternative')
    return { stepCount: steps.length, altCount }
  })
  check('YouTube typed request -> >= 4 steps', youtube.stepCount >= 4, `${youtube.stepCount} steps`)
  check('Free Alternative shown in workflow', youtube.altCount)

await page.evaluate(() => {
    const s = document.getElementById('workflow')
    const ta = s.querySelector('textarea')
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    setter.call(ta, 'asdf qwer zxcv random words')
    ta.dispatchEvent(new Event('input', { bubbles: true }))
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.includes('Find My AI Workflow')).click()
  })
  await page.waitForFunction(() => document.querySelector('#workflow')?.textContent.includes("We couldn't find a perfect match yet"), { timeout: 8000 })
  check('No-match state shows browse-all link', await page.evaluate(() => {
    const s = document.getElementById('workflow')
    return [...s.querySelectorAll('a')].some((a) => a.textContent.includes('Browse All AI Tools') && a.getAttribute('href') === '#alternatives')
  }))

  await page.evaluate(() => {
    const s = document.getElementById('workflow')
    ;[...s.querySelectorAll('button')].find((b) => b.textContent.includes('Try Another Request')).click()
  })
  await new Promise((r) => setTimeout(r, 300))
  check('Try Another Request returns to input', await page.evaluate(() => {
    const s = document.getElementById('workflow')
    return !!s.querySelector('textarea') && !s.textContent.includes('Best match for you')
  }))

  await page.setViewport({ width: 375, height: 667 })
  await new Promise((r) => setTimeout(r, 400))
  const mobile = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - window.innerWidth
    const btn = [...document.querySelectorAll('#workflow button')].find((b) => b.textContent.includes('Find My AI Workflow'))
    const r = btn ? btn.getBoundingClientRect() : null
    return { overflow, btnWidth: r ? Math.round(r.width) : 0, viewport: window.innerWidth }
  })
  check('Mobile 375px: no overflow, button is a large touch target', mobile.overflow <= 1 && mobile.btnWidth >= 280, `overflow=${mobile.overflow}px btn=${mobile.btnWidth}px`)

  check('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} workflow checks passed`)
process.exit(failed.length ? 1 : 0)