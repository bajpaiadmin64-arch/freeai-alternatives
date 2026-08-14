import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { alternativeFinder, tools } from '../data/tools'
import { Logo } from './ToolCard'

export default function AlternativeFinder() {
  const [selected, setSelected] = useState(alternativeFinder.paidOptions[0])
  const results = selected.toolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean)

  return (
    <section id="finder" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Free replacement</p>
          <h2 className="section-title mt-3">
            Find Your <span className="gradient-text">Free Alternative</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{alternativeFinder.intro}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {alternativeFinder.paidOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt)}
              className={`chip ${selected.id === opt.id ? 'chip-active' : ''}`}
              aria-pressed={selected.id === opt.id}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-700 dark:text-slate-200">
          {selected.note}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <div
              key={tool.id}
              className="card card-hover tile-hover flex items-center gap-4 p-4"
            >
              <Logo tool={tool} size="lg" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-slate-900 dark:text-white">{tool.name}</h3>
                <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Best for:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{tool.bestFor}</span>
                  <span className="text-slate-300 dark:text-white/15">·</span>
                  <span className="text-brand-600 dark:text-brand-400">{tool.freeStatus}</span>
                </p>
              </div>
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-icon shrink-0"
                aria-label={`Use ${tool.name} for free`}
                title={`Open ${tool.name} official website`}
              >
                <ArrowUpRight size={16} />
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          We only recommend official services with legitimate free access. No cracked models, no shared accounts, no unauthorized API keys.
        </p>
      </div>
    </section>
  )
}
