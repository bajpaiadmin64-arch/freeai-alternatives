import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Heart, RefreshCw, Sparkles, Trophy } from 'lucide-react'
import { analyzeRequest, samplePrompts } from '../utils/workflowEngine'
import { statusStyles } from '../data/tools'
import { Logo } from './ToolCard'

const LOADING_PHASES = [
  { emoji: '🔍', text: 'Understanding your task...' },
  { emoji: '🤖', text: 'Finding the best AI tools...' },
  { emoji: '✨', text: 'Building your workflow...' },
]

const STORE_KEY = 'freeai-saved-workflows'
const PHASE_MS = 700

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || []
  } catch {
    return []
  }
}

function writeSaved(list) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 10)))
  } catch {
    // storage unavailable (private mode) — saving is optional
  }
}

function StatusBadge({ tool }) {
  const status = statusStyles[tool.freeStatus] || statusStyles['Free Tier']
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
      {tool.freeStatus}
    </span>
  )
}

export default function WorkflowFinder() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | loading | result | unclear | no-match
  const [stage, setStage] = useState(0)
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (!result) return
    setSaved(readSaved().some((w) => w.query === result.query && w.bestToolId === result.best.tool.id))
  }, [result])

  const run = (raw) => {
    const text = raw.trim()
    if (!text || phase === 'loading') return
    setInput(text)
    setPhase('loading')
    setStage(0)
    setResult(null)
    LOADING_PHASES.forEach((_, i) => {
      const t = setTimeout(() => setStage(i), PHASE_MS * i)
      timers.current.push(t)
    })
    const t = setTimeout(() => {
      const analysis = analyzeRequest(text)
      if (analysis.ok) {
        setResult(analysis)
        setPhase('result')
      } else {
        setPhase(analysis.reason === 'no-match' ? 'no-match' : 'unclear')
      }
    }, PHASE_MS * LOADING_PHASES.length)
    timers.current.push(t)
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setInput('')
    setPhase('idle')
    setStage(0)
    setResult(null)
  }

  const toggleSave = () => {
    if (!result) return
    const list = readSaved()
    const existing = list.some((w) => w.query === result.query && w.bestToolId === result.best.tool.id)
    if (existing) {
      writeSaved(list.filter((w) => !(w.query === result.query && w.bestToolId === result.best.tool.id)))
      setSaved(false)
    } else {
      writeSaved([
        { query: result.query, bestToolId: result.best.tool.id, steps: result.steps.map((s) => ({ label: s.label, toolId: s.tool.id })), savedAt: Date.now() },
        ...list,
      ])
      setSaved(true)
    }
  }

  const loading = phase === 'loading'
  const current = LOADING_PHASES[Math.min(stage, LOADING_PHASES.length - 1)]

  return (
    <section id="workflow" className="relative py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-300/15 via-gold-300/15 to-brand-400/15 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">AI workflow finder</p>
          <h2 className="section-title mt-3">
            🤖 Tell Me <span className="gradient-text">What You Need</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Describe what you want to accomplish, and we&apos;ll find the right AI tools for you.
          </p>
        </div>

        <div className="card relative mt-10 overflow-hidden p-4 sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                run(input)
              }
            }}
            rows={2}
            placeholder="I want to research a college assignment, summarize PDFs, and create a presentation."
            aria-label="Describe what you want to accomplish"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => run(input)}
            disabled={loading}
            className="btn btn-primary mt-3 w-full justify-center px-6 py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles size={17} />
            Find My AI Workflow
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Example prompts">
          {samplePrompts.map((p) => (
            <button
              key={p.text}
              type="button"
              onClick={() => run(p.text)}
              disabled={loading}
              className="chip"
            >
              <span aria-hidden="true">{p.emoji}</span>
              {p.text}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-8">
          {loading && (
            <div className="card flex flex-col items-center justify-center gap-4 p-10 text-center" role="status">
              <span className="text-3xl" aria-hidden="true">
                {current.emoji}
              </span>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{current.text}</p>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-700 ease-out"
                  style={{ width: `${((Math.min(stage, 2) + 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {phase === 'result' && result && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  🚀 Your Recommended <span className="gradient-text">AI Workflow</span>
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">&ldquo;{result.query}&rdquo;</p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border-2 border-gold-400/70 bg-gradient-to-br from-gold-50 via-white to-brand-50 p-5 sm:p-6 dark:from-gold-500/10 dark:via-night-900 dark:to-brand-500/10">
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-gold-300 bg-gold-100/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-700 dark:border-gold-500/30 dark:bg-gold-500/20 dark:text-gold-300">
                  <Trophy size={12} />
                  Best match for you
                </span>
                <div className="flex flex-wrap items-center gap-3.5">
                  <Logo tool={result.best.tool} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{result.best.tool.name}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{result.best.tool.bestFor}</p>
                  </div>
                  <StatusBadge tool={result.best.tool} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{result.best.why}</p>
                <a
                  href={result.best.tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-4 w-full justify-center sm:w-auto"
                >
                  Try Now
                  <ArrowUpRight size={15} />
                </a>
              </div>

              <ol className="relative space-y-2">
                {result.steps.map((step, i) => (
                  <li key={`${step.key}-${step.tool.id}`}>
                    <div className="card card-hover tile-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                        <span className="tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 text-sm font-extrabold text-white shadow-tile">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Step {i + 1}
                          </p>
                          <h4 className="truncate font-bold text-slate-900 dark:text-white">
                            <span className="mr-1" aria-hidden="true">{step.emoji}</span>
                            {step.label}
                          </h4>
                        </div>
                      </div>
                      <div className="hidden h-10 w-px shrink-0 bg-slate-200 sm:block dark:bg-white/10" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Logo tool={step.tool} />
                          <div className="min-w-0 flex-1">
                            <h5 className="truncate font-bold text-slate-900 dark:text-white">{step.tool.name}</h5>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{step.tool.bestFor}</p>
                          </div>
                          <StatusBadge tool={step.tool} />
                        </div>
                        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {step.tool.description}
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-brand-600 dark:text-brand-300">Why: </span>
                          {step.why}
                        </p>
                        {step.alternative && (
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            🆓 <span className="font-semibold">Free Alternative:</span>{' '}
                            <a
                              href={step.alternative.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700 dark:text-brand-300"
                            >
                              {step.alternative.name}
                            </a>
                          </p>
                        )}
                      </div>
                      <a
                        href={step.tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-soft w-full shrink-0 justify-center sm:w-auto"
                      >
                        Try Tool
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                    {i < result.steps.length - 1 && (
                      <div className="flex justify-center py-2" aria-hidden="true">
                        <span className="tile flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 dark:bg-night-800 dark:text-slate-500 dark:ring-white/10">
                          <ArrowDown size={13} />
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={reset} className="btn btn-soft w-full justify-center py-3.5 sm:w-auto">
                  <RefreshCw size={15} />
                  Try Another Request
                </button>
                <button
                  type="button"
                  onClick={toggleSave}
                  className={`btn w-full justify-center py-3.5 sm:w-auto ${
                    saved
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'btn-soft'
                  }`}
                >
                  <Heart size={15} className={saved ? 'fill-current' : ''} />
                  {saved ? 'Saved in Browser ✓' : 'Save Workflow'}
                </button>
              </div>
            </div>
          )}

          {phase === 'unclear' && (
            <div className="card p-8 text-center">
              <p className="text-3xl" aria-hidden="true">🤔</p>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">Tell us a little more</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                Try something like: &ldquo;I need a free AI tool to remove the background from product photos.&rdquo;
              </p>
            </div>
          )}

          {phase === 'no-match' && (
            <div className="card p-8 text-center">
              <p className="text-3xl" aria-hidden="true">😕</p>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">We couldn&apos;t find a perfect match yet.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                Try one of the ideas below, or browse the full directory for a tool you know you need.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#alternatives" className="btn btn-primary w-full justify-center sm:w-auto">
                  Browse All AI Tools
                  <ArrowUpRight size={15} />
                </a>
                <button type="button" onClick={reset} className="btn btn-soft w-full justify-center sm:w-auto">
                  Try Another Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}