import { ArrowUpRight, Crown } from 'lucide-react'
import { featured, tools } from '../data/tools'
import { Logo } from './ToolCard'

export default function FeaturedSection() {
  const featuredTools = featured
    .map((f) => ({ ...f, tool: tools.find((t) => t.id === f.toolId) }))
    .filter((f) => f.tool)

  return (
    <section id="featured" className="relative py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-300/20 via-violet-300/20 to-cyan-300/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Editor's picks</p>
          <h2 className="section-title mt-3">
            Best Free AI Tools <span className="gradient-text">Right Now</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Our current recommendations based on how useful each free tier is. Recommendations are qualified, not absolute claims — free tiers change, so always verify on the official site.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((f, i) => (
            <a
              key={f.toolId}
              href={f.tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover tile-hover group relative flex flex-col p-5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300">
                <Crown size={11} />
                {f.label}
              </div>
              <div className="flex items-center gap-3">
                <Logo tool={f.tool} />
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-900 dark:text-white">{f.tool.name}</h3>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{f.tool.bestFor}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{f.wording}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                Use for Free
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
