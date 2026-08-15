import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Scale, X } from 'lucide-react'
import { categories, statusStyles, tools as allTools } from '../data/tools'
import { useApp } from '../context/AppContext'
import { Logo } from './ToolCard'

const CATEGORY_EMOJI = {
  all: '🌐',
  chat: '🤖',
  coding: '💻',
  research: '🔎',
  writing: '✍️',
  image: '🎨',
  video: '🎬',
  productivity: '📊',
}

const MAX_VISIBLE = 11
const DRAG_FACTOR = 0.25 // degrees of rotation per px dragged
const WHEEL_FACTOR = 0.2
const MOVE_TOLERANCE = 6 // px — beyond this a pointer gesture counts as a drag, not a tap

export default function AiToolOrbit({ mode = 'discover' }) {
  const { compareIds, toggleCompare } = useApp()
  const [category, setCategory] = useState('all')
  const [angle, setAngle] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [hubOpen, setHubOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [size, setSize] = useState(0)

  const containerRef = useRef(null)
  const angleRef = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const movedRef = useRef(0)
  const rafRef = useRef(0)
  const draggingRef = useRef(false)

  const isCompare = mode === 'compare'

  const list = useMemo(
    () => (category === 'all' ? allTools : allTools.filter((t) => t.category === category)),
    [category],
  )
  const N = list.length

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      setSize(Math.floor(Math.min(rect.width, rect.height)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      updateAngle(angleRef.current + e.deltaY * WHEEL_FACTOR)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  useEffect(() => {
    if (N > 0 && !dragging) setSelectedId(null)
  }, [category, N]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopMomentum = () => {
    cancelAnimationFrame(rafRef.current)
    velocityRef.current = 0
  }

  const updateAngle = (v) => {
    angleRef.current = ((v % 360) + 360) % 360
    setAngle(angleRef.current)
  }

  const onPointerDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return
    stopMomentum()
    draggingRef.current = true
    lastXRef.current = e.clientX
    movedRef.current = 0
    setDragging(true)
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      // synthetic or unsupported pointer — ignore
    }
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    movedRef.current += Math.abs(dx)
    velocityRef.current = dx
    updateAngle(angleRef.current + dx * DRAG_FACTOR)
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    const vel = velocityRef.current
    const spin = () => {
      const v = velocityRef.current * 0.94
      velocityRef.current = v
      if (Math.abs(v) < 0.15) return
      updateAngle(angleRef.current + v * DRAG_FACTOR)
      rafRef.current = requestAnimationFrame(spin)
    }
    if (Math.abs(vel) > 2) rafRef.current = requestAnimationFrame(spin)
  }

  const pickCategory = (id) => {
    setCategory(id)
    setHubOpen(false)
    setSelectedId(null)
    updateAngle(0)
  }

  const selectTool = (id, e) => {
    if (e) {
      e.stopPropagation()
      if (movedRef.current > MOVE_TOLERANCE) return
    }
    setSelectedId((prev) => (prev === id ? null : id))
    setHubOpen(false)
  }

  const selectedTool = selectedId ? allTools.find((t) => t.id === selectedId) : null
  const categoryLabel = category === 'all' ? 'All Tools' : categories.find((c) => c.id === category)?.label || category
  const compareSet = new Set(compareIds.length ? compareIds : isCompare ? ['gemini', 'deepseek', 'chatgpt'] : [])

  // ----- geometry -----
  const nodeCount = Math.min(MAX_VISIBLE, N)
  const step = N > 0 ? 360 / N : 360
  const halfArc = N > MAX_VISIBLE ? (nodeCount / 2) * step : 180
  const radius = size > 0 ? size / 2 - 82 : 0
  const nodeTile = size < 380 ? 'h-9 w-9 rounded-lg' : 'h-11 w-11 rounded-xl'

  const nodes = []
  if (N > 0) {
    for (let k = 0; k < N; k++) {
      const a = ((k * step + angle) % 360 + 360) % 360
      const dist = ((a - 90 + 540) % 360) - 180 // degrees away from the front (bottom)
      if (Math.abs(dist) > halfArc) continue
      const depth = (Math.sin((a * Math.PI) / 180) + 1) / 2
      const rad = (a * Math.PI) / 180
      nodes.push({
        k,
        tool: list[k],
        x: Math.cos(rad) * radius,
        y: Math.sin(rad) * radius,
        depth,
        scale: 0.62 + 0.38 * depth,
        opacity: 0.4 + 0.6 * depth,
      })
    }
    nodes.sort((p, q) => p.depth - q.depth)
  }

  const inCompare = (id) => compareSet.has(id)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
          Showing: <span className="text-slate-900 dark:text-white">{categoryLabel}</span>
          <span className="text-xs font-normal text-slate-400">· {N} tools</span>
        </p>
        <div className="flex items-center gap-2">
          {category !== 'all' && (
            <button type="button" onClick={() => pickCategory('all')} className="chip">
              All Categories
            </button>
          )}
          {isCompare && (
            <a href="#compare-table" className="btn btn-primary px-4 py-2.5 text-xs">
              <Scale size={13} />
              Compare Tools
            </a>
          )}
        </div>
      </div>

      {N === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-3xl" aria-hidden="true">😕</p>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">No tools found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We don&apos;t have any AI tools in this category yet.</p>
          <a href="#alternatives" className="btn btn-primary mt-4">
            Browse All Tools
            <ArrowUpRight size={14} />
          </a>
        </div>
      ) : (
        <div
          ref={containerRef}
          role="group"
          aria-label="AI tool orbit"
          data-rotation={Math.round(angle)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative mx-auto mt-6 aspect-square w-full max-w-[560px] select-none"
          style={{ touchAction: 'none' }}
        >
          {/* soft glow behind the ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-300/20 via-gold-300/10 to-brand-400/15 blur-2xl" />

          {size > 0 && nodes.map((n) => {
            const tool = n.tool
            const selected = selectedId === tool.id
            const inSet = inCompare(tool.id)
            const left = size > 0 ? size / 2 + n.x - (size < 380 ? 34 : 40) : 0
            const top = size > 0 ? size / 2 + n.y - (size < 380 ? 34 : 40) : 0
            return (
              <button
                key={tool.id}
                type="button"
                data-tool-id={tool.id}
                data-angle={Math.round((((n.k * step + angle) % 360) + 360) % 360)}
                aria-pressed={selected}
                onClick={(e) => selectTool(tool.id, e)}
                className={`absolute flex w-[68px] flex-col items-center gap-1 rounded-xl p-1 outline-none sm:w-[80px] ${dragging ? '' : 'transition-[left,top,transform,opacity] duration-300 ease-out'}`}
                style={{
                  left,
                  top,
                  opacity: selected ? 1 : n.opacity,
                  transform: `translate(-50%,-50%) scale(${selected ? n.scale * 1.18 : n.scale})`,
                  zIndex: selected ? 60 : 10 + Math.round(n.depth * 50),
                  willChange: 'transform, opacity',
                }}
              >
                <span
                  className={`relative ${nodeTile} tile inline-flex shrink-0 items-center justify-center bg-white p-1 ring-1 ring-slate-900/5 ${
                    selected
                      ? 'ring-2 ring-brand-500 shadow-[0_10px_24px_-6px_rgba(183,65,14,0.55)]'
                      : inSet
                        ? 'ring-2 ring-gold-400 shadow-[0_8px_20px_-8px_rgba(173,148,64,0.6)]'
                        : ''
                  }`}
                >
                  <Logo tool={tool} size="sm" />
                  {inSet && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-white shadow" title="In comparison">
                      ✓
                    </span>
                  )}
                </span>
                <span className="w-full truncate text-center text-[9px] font-semibold text-slate-700 sm:text-[10px] dark:text-slate-200">
                  {tool.name.split(' ')[0]}
                </span>
                <span className="inline-flex max-w-full items-center gap-1 truncate text-[8px] font-medium text-slate-400 sm:text-[9px] dark:text-slate-500">
                  <span className={`h-1 w-1 shrink-0 rounded-full ${(statusStyles[tool.freeStatus] || statusStyles['Free Tier']).dot}`} />
                  <span className="truncate">{tool.freeStatus}</span>
                </span>
              </button>
            )
          })}

          {/* central category selector */}
          <div data-no-drag className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => setHubOpen((o) => !o)}
              aria-expanded={hubOpen}
              className="tile group relative flex h-24 w-24 flex-col items-center justify-center gap-0.5 rounded-full border border-gold-300/60 bg-gradient-to-br from-brand-500 via-[#a0522d] to-gold-500 text-white shadow-[0_14px_34px_-10px_rgba(183,65,14,0.55)] transition-transform duration-300 hover:scale-105 sm:h-32 sm:w-32"
            >
              <span className="text-xl sm:text-2xl" aria-hidden="true">✨</span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] sm:text-xs">AI Tools</span>
              <span className="text-[8px] font-medium text-white/80 sm:text-[9px]">{categoryLabel}</span>
            </button>

            {hubOpen && (
              <div className="card absolute left-1/2 top-1/2 z-40 w-56 -translate-x-1/2 -translate-y-1/2 p-2 shadow-lift" data-no-drag>
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Choose a category</p>
                  <button
                    type="button"
                    onClick={() => setHubOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                    aria-label="Close category menu"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pickCategory(c.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors ${
                        category === c.id
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                          : 'text-slate-700 hover:bg-[#f6f0e8] dark:text-slate-200 dark:hover:bg-white/5'
                      }`}
                    >
                      <span aria-hidden="true">{CATEGORY_EMOJI[c.id]}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!dragging && hubOpen && (
            <button
              type="button"
              aria-label="Close category menu"
              onClick={() => setHubOpen(false)}
              className="absolute inset-0 z-20 cursor-default"
            />
          )}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        {isCompare ? 'Tap tools to build your lineup — the comparison below updates live.' : 'Drag, swipe or scroll to rotate the orbit — tap a tool to inspect it.'}
      </p>

      {/* selected tool info card */}
      {selectedTool && (
        <div key={selectedTool.id} className="card float-in relative mx-auto mt-6 max-w-xl p-5">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Close tool card"
          >
            <X size={15} />
          </button>
          <div className="flex flex-wrap items-center gap-3.5">
            <Logo tool={selectedTool} />
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-extrabold text-slate-900 dark:text-white">{selectedTool.name}</h4>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{selectedTool.bestFor}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${(statusStyles[selectedTool.freeStatus] || statusStyles['Free Tier']).badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${(statusStyles[selectedTool.freeStatus] || statusStyles['Free Tier']).dot}`} />
              {selectedTool.freeStatus}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedTool.description}</p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => toggleCompare(selectedTool.id)}
              className={`btn w-full justify-center sm:w-auto ${inCompare(selectedTool.id) ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300' : 'btn-primary'}`}
            >
              <Scale size={14} />
              {inCompare(selectedTool.id) ? 'In Compare ✓' : 'Compare →'}
            </button>
            <a
              href={selectedTool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-soft w-full justify-center sm:w-auto"
            >
              Open Tool
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}