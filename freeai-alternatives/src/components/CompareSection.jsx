import { ArrowUpRight, Check, Minus, RotateCcw } from 'lucide-react'
import { comparisonRows, tools } from '../data/tools'
import { useApp } from '../context/AppContext'

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
  const { compareIds, replaceCompare, clearCompare } = useApp()
  const picks = compareIds.length > 0 ? compareIds : DEFAULT_PICKS
  const selected = picks.map((id) => tools.find((t) => t.id === id)).filter(Boolean)
  const options = tools.filter((t) => !picks.includes(t.id))

  return (
    <section id="compare" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Side by side</p>
          <h2 className="section-title mt-3">
            Compare <span className="gradient-text">AI Tools</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Pick up to three tools to compare free access, features and capabilities side by side. Use the compare button on any tool card to build your own lineup.
          </p>
        </div>

        <div className="card mt-10 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <caption className="sr-only">Comparison of selected AI tools</caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-night-700/40">
                <th scope="col" className="w-44 px-4 py-4 text-left font-semibold text-slate-500 dark:text-slate-400">
                  Feature
                </th>
                {selected.map((tool, i) => (
                  <th key={`${tool.id}-${i}`} scope="col" className="min-w-44 px-4 py-4 text-left align-top">
                    <div className="flex items-start gap-2">
                      <span
                        className="tile inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)` }}
                        aria-hidden="true"
                      >
                        {tool.name.replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900 dark:text-white">{tool.name}</p>
                        <select
                          value={tool.id}
                          onChange={(e) => replaceCompare(tool.id, e.target.value)}
                          className="mt-1 w-full max-w-[190px] cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 focus:outline-none dark:border-white/15 dark:bg-night-700 dark:text-slate-300"
                          aria-label={`Change tool in column ${i + 1}`}
                        >
                          <option value={tool.id}>{tool.name}</option>
                          {options.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, ri) => (
                <tr
                  key={row.key}
                  className={`border-b border-slate-100 dark:border-white/5 ${ri % 2 === 1 ? 'bg-slate-50/60 dark:bg-night-700/30' : ''}`}
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
