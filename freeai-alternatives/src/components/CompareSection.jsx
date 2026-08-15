import { ArrowUpRight, Check, Minus, RotateCcw, X } from 'lucide-react'
import { comparisonRows, tools } from '../data/tools'
import { useApp } from '../context/AppContext'
import AiToolOrbit from './AiToolOrbit'
import { Logo } from './ToolCard'

function BoolCell({ value }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title="Yes">
        <Check size={15} strokeWidth={3} /> Yes
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1 text-slate-400" title="No">
        <Minus size={15} /> No
      </span>
    )
  return <span className="text-slate-500 dark:text-slate-300">{value}</span>
}

const DEFAULT_PICKS = ['gemini', 'deepseek', 'chatgpt']

export default function CompareSection() {
  const { compareIds, toggleCompare, clearCompare } = useApp()
  const picks = compareIds.length > 0 ? compareIds : DEFAULT_PICKS
  const selected = picks.map((id) => tools.find((t) => t.id === id)).filter(Boolean)

  return (
    <section id="compare" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Side by side</p>
          <h2 className="section-title mt-3">
            Compare <span className="gradient-text">AI Tools</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Pick up to three tools to compare free access, features and capabilities side by side. Use the orbit below — or the compare button on any tool card — to build your lineup.
          </p>
        </div>

        <div className="mt-10">
          <AiToolOrbit mode="compare" />
        </div>

        <div id="compare-table" className="card mt-10 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <caption className="sr-only">Comparison of selected AI tools</caption>
            <thead>
              <tr className="border-b border-[#e9dfd0] bg-[#f6f0e6]/70 dark:border-white/10 dark:bg-night-700/40">
                <th scope="col" className="w-44 px-4 py-4 text-left font-semibold text-slate-500 dark:text-slate-400">
                  Feature
                </th>
                {selected.map((tool, i) => (
                  <th key={`${tool.id}-${i}`} scope="col" className="min-w-44 px-4 py-4 text-left align-top">
                    <div className="flex items-start gap-2.5">
                      <Logo tool={tool} />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900 dark:text-white">{tool.name}</p>
                        <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{tool.bestFor}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCompare(tool.id)}
                        className="ml-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-white/10"
                        aria-label={`Remove ${tool.name} from comparison`}
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, ri) => (
                <tr
                  key={row.key}
                  className={`border-b border-slate-100 dark:border-white/5 ${ri % 2 === 1 ? 'bg-[#f8f2ea]/60 dark:bg-night-700/30' : ''}`}
                >
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">
                    {row.label}
                  </th>
                  {selected.map((tool) => (
                    <td key={tool.id} className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {row.type === 'bool' ? <BoolCell value={tool[row.key]} /> : <span>{tool[row.key]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-xs text-slate-400 dark:text-slate-500">
            Comparison reflects information verified from official sources on 13 Aug 2026. Free tiers and features change frequently — always check the provider’s website for current terms.
          </p>
          <button
            type="button"
            onClick={clearCompare}
            className="btn btn-soft"
          >
            <RotateCcw size={14} />
            Reset comparison
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {selected.map((tool) => (
              <a
                key={tool.id}
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary rounded-full px-4 py-2 text-xs"
              >
                Use {tool.name.split(' ')[0]} for Free
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
