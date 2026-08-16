import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, CheckSquare, ChevronDown, ExternalLink, Info, Square } from 'lucide-react'
import { statusStyles } from '../data/tools'
import { toolIcons } from '../data/icons'
import { useApp } from '../context/AppContext'

function initials(name) {
  const clean = name.replace(/\(.*?\)/g, '').replace(/[^A-Za-z0-9 ]/g, ' ').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'AI'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function Logo({ tool, size = 'md' }) {
  const sizes = { sm: 'h-9 w-9 rounded-lg text-xs', md: 'h-11 w-11 rounded-xl text-sm', lg: 'h-14 w-14 rounded-2xl text-base' }
  const [failed, setFailed] = useState(false)
  const icon = toolIcons[tool.id]

  if (icon && !failed) {
    return (
      <span
        className={`${sizes[size]} tile inline-flex shrink-0 items-center justify-center bg-white p-1.5 ring-1 ring-slate-900/5`}
        aria-hidden="true"
      >
        <img
          src={icon}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </span>
    )
  }

  return (
    <span
      className={`${sizes[size]} tile inline-flex shrink-0 items-center justify-center font-bold text-white dark:brightness-125`}
      style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc 60%, ${tool.color}88)` }}
      aria-hidden="true"
    >
      {initials(tool.name)}
    </span>
  )
}

export { Logo }

export default function ToolCard({ tool, showCompare = true }) {
  const [expanded, setExpanded] = useState(false)
  const { compareIds, toggleCompare } = useApp()
  const inCompare = compareIds.includes(tool.id)
  const compareFull = compareIds.length >= 3 && !inCompare
  const status = statusStyles[tool.freeStatus] || statusStyles['Free Tier']
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, hovered: false })

  const categoriesText = useMemo(() => {
    const map = { chat: 'Chat', coding: 'Coding', research: 'Research', writing: 'Writing', image: 'Image', video: 'Video', productivity: 'Productivity', audio: 'Audio', automation: 'Automation' }
    return map[tool.category] || tool.category
  }, [tool.category])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -3
    const rotateY = ((x - centerX) / centerX) * 3
    setTilt({ x: rotateX, y: rotateY, hovered: true })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, hovered: false })
  }

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-4 dark:border-white/8 dark:bg-night-900/70"
      style={{
        transform: `perspective(800px) translateY(${tilt.hovered ? '-8px' : '0px'}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.hovered
          ? 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease'
          : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease, border-color 0.5s ease',
        boxShadow: tilt.hovered
          ? '0 8px 16px rgb(33 50 52 / 0.08), 0 20px 48px -12px rgb(0 96 120 / 0.18), 0 48px 96px -28px rgb(0 96 120 / 0.2)'
          : '0 1px 2px rgb(33 50 52 / 0.04), 0 4px 12px -4px rgb(33 50 52 / 0.08), 0 16px 32px -12px rgb(0 96 120 / 0.06)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glass highlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-10"
        style={{
          background: tilt.hovered
            ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 60%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 35%)',
          transition: 'background 0.35s ease',
        }}
      />

      {/* Content — above glass overlay */}
      <div className="relative z-20 flex items-start gap-3">
        <Logo tool={tool} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{tool.name}</h3>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{tool.company}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {tool.freeStatus}
        </span>
      </div>

      <p className="relative z-20 mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {tool.description}
      </p>

      <dl className="relative z-20 mt-3 space-y-1.5 text-xs">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500 dark:text-slate-400">Best For</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100">{tool.bestFor}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500 dark:text-slate-400">Free Access</dt>
          <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
            {tool.freeStatus === 'Completely Free' || tool.freeStatus === 'Open Source' ? 'Yes' : 'Limited'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500 dark:text-slate-400">Limits</dt>
          <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{tool.limitations.split('.')[0]}.</dd>
        </div>
      </dl>

      {expanded && (
        <div className="relative z-20 mt-3 rounded-xl border border-brand-100 bg-brand-50/60 p-3.5 text-xs dark:border-white/10 dark:bg-night-700/50">
          <p className="font-semibold text-slate-800 dark:text-slate-100">Key features</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {tool.features.slice(0, 6).map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-1 w-1 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">Free tier details</p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">{tool.limitations}</p>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Info size={12} />
            Category: {categoriesText} · Last checked: {tool.lastChecked} · Free tiers can change — verify on the official site.
          </p>
        </div>
      )}

      <div className="relative z-20 mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
        <a
          href={tool.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1 py-2.5"
        >
          Use for Free
          <ArrowUpRight size={15} />
        </a>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="btn btn-soft py-2.5"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronDown size={15} className="rotate-180 transition-transform" /> : <ChevronDown size={15} className="transition-transform" />}
          Details
        </button>
        {showCompare && (
          <button
            type="button"
            onClick={() => toggleCompare(tool.id)}
            disabled={compareFull}
            className={`btn btn-soft btn-icon py-2.5 disabled:cursor-not-allowed disabled:opacity-40 ${
              inCompare ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/50 dark:bg-brand-500/10 dark:text-brand-200' : ''
            }`}
            title={compareFull ? 'Compare is full (max 3 tools)' : inCompare ? 'Remove from compare' : 'Add to compare'}
            aria-pressed={inCompare}
          >
            {inCompare ? <CheckSquare size={14} /> : <Square size={14} />}
          </button>
        )}
      </div>

      {tool.openSource && !tool.freeStatus.includes('Open Source') && (
        <p className="relative z-20 mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 dark:text-rose-400">
          <ExternalLink size={11} />
          Free commercial service — its models are open-weight
        </p>
      )}
    </article>
  )
}
