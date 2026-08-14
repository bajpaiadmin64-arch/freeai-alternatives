import { useMemo, useState } from 'react'
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import ToolCard from './ToolCard'
import { accountFilters, categories, freeStatusFilters } from '../data/tools'

const categoryLabel = (id) => categories.find((c) => c.id === id)?.label || id

export default function ToolGrid({
  tools,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  showSearch = true,
  showFilters = true,
  showCompare = true,
  emptyMessage = 'No AI tools match your filters. Try clearing the search or switching categories.',
}) {
  const [freeStatus, setFreeStatus] = useState('all')
  const [account, setAccount] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) => {
      if (category === 'opensource' && !t.openSource) return false
      if (category !== 'all' && category !== 'opensource' && t.category !== category) return false
      const fs = freeStatusFilters.find((f) => f.id === freeStatus)
      if (fs && fs.match && !fs.match(t)) return false
      const ac = accountFilters.find((a) => a.id === account)
      if (ac && ac.match && !ac.match(t)) return false
      if (!q) return true
      const haystack = [
        t.name,
        t.company,
        t.description,
        t.bestFor,
        categoryLabel(t.category),
        ...(t.features || []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [tools, query, category, freeStatus, account])

  const activeFilters = (category !== 'all' ? 1 : 0) + (freeStatus !== 'all' ? 1 : 0) + (account !== 'all' ? 1 : 0)

  const clearAll = () => {
    onQueryChange('')
    onCategoryChange('all')
    setFreeStatus('all')
    setAccount('all')
  }

  return (
    <div>
      {(showSearch || showFilters) && (
        <div className="mb-8 space-y-4">
          {showSearch && (
            <div className="search-shell mx-auto flex max-w-xl items-center gap-2 p-2">
              <Search className="ml-2 shrink-0 text-slate-400" size={18} />
              <label htmlFor="tool-search" className="sr-only">
                Search AI tools
              </label>
              <input
                id="tool-search"
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search by name, company, use case or feature…"
                className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          )}

          {showFilters && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <SlidersHorizontal size={13} />
                  Free status
                </span>
                {freeStatusFilters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFreeStatus(f.id)}
                    className={`chip ${freeStatus === f.id ? 'chip-active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Account
                </span>
                {accountFilters.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccount(a.id)}
                    className={`chip ${account === a.id ? 'chip-active' : ''}`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-800 dark:text-white">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'tool' : 'tools'}
          {category !== 'all' && (
            <>
              {' '}
              in <span className="font-semibold text-slate-800 dark:text-white">{category === 'opensource' ? 'Open Source' : categoryLabel(category)}</span>
            </>
          )}
          {activeFilters > 0 && (
            <button type="button" onClick={clearAll} className="ml-3 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">
              Clear all filters
            </button>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-2xl border-dashed p-12 text-center">
          <SearchX className="mx-auto text-slate-400" size={32} />
          <p className="mt-3 font-semibold text-slate-800 dark:text-white">Nothing found</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCompare={showCompare} />
          ))}
        </div>
      )}
    </div>
  )
}
