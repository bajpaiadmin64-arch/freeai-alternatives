import { ArrowDown, BadgeCheck, Compass, Search, Sparkles } from 'lucide-react'
import { categories, tools } from '../data/tools'

export default function Hero({ onSearch }) {
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-300/25 via-gold-300/20 to-brand-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-32 h-72 w-72 rounded-full bg-gold-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="pointer-events-none absolute left-[8%] top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="animate-float-slow card flex items-center gap-3 rounded-2xl px-4 py-3 shadow-hero-card">
          <span className="tile h-9 w-9 shrink-0 rounded-lg bg-white p-1 ring-1 ring-slate-900/5" aria-hidden="true">
            <img src="/icons/deepseek.svg" alt="" loading="lazy" className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">DeepSeek</p>
            <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <BadgeCheck size={11} /> No account needed
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[7%] top-1/3 hidden -translate-y-1/2 lg:block">
        <div className="animate-float-slower card flex items-center gap-3 rounded-2xl px-4 py-3 shadow-hero-card">
          <span className="tile h-9 w-9 shrink-0 rounded-lg bg-white p-1 ring-1 ring-slate-900/5" aria-hidden="true">
            <img src="/icons/gemini.png" alt="" loading="lazy" className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Gemini</p>
            <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles size={11} /> 1M context · free tier
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="animate-fade-up mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#e9dfd0]/90 bg-[#fdfaf5]/90 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Free directory · Official links only · No account needed to browse
        </p>

        <h1
          className="animate-fade-up text-5xl font-extrabold leading-[1.06] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white"
          style={{ animationDelay: '80ms' }}
        >
          Stop Paying for AI You Can{' '}
          <span className="gradient-text">Use for Free.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-300"
          style={{ animationDelay: '160ms' }}
        >
          Discover powerful free and open-source alternatives to expensive AI tools — all in one place.
        </p>

        <form
          className="animate-fade-up search-shell mx-auto mt-10 flex max-w-xl items-center gap-2 p-2"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            onSearch(e.currentTarget.search.value)
          }}
          style={{ animationDelay: '240ms' }}
        >
          <Search className="ml-2 shrink-0 text-slate-400" size={20} />
          <label htmlFor="hero-search" className="sr-only">
            Search AI tools
          </label>
          <input
            id="hero-search"
            name="search"
            type="search"
            placeholder="Search AI tools…"
            className="w-full bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary shrink-0 px-5 py-2.5">
            Explore
          </button>
        </form>

        <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3 text-sm" style={{ animationDelay: '320ms' }}>
          <a href="#categories" className="btn btn-primary rounded-full px-6 py-3">
            <ArrowDown size={16} />
            Explore Free AI Tools
          </a>
          <a href="#finder" className="btn btn-soft rounded-full px-6 py-3">
            <Compass size={16} />
            Find an Alternative
          </a>
        </div>

        <dl
          className="animate-fade-up mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x divide-[#e9dfd0] rounded-2xl border border-[#e9dfd0]/80 bg-[#fdfaf5]/80 py-4 shadow-soft dark:divide-white/10 dark:border-white/10 dark:bg-white/5"
          style={{ animationDelay: '400ms' }}
        >
          <div className="px-2 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Tools listed</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {tools.length}
              <span className="text-sm text-slate-500 dark:text-slate-400">+</span>
            </dd>
          </div>
          <div className="px-2 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Categories</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {categories.length}
              <span className="text-sm text-slate-500 dark:text-slate-400">+</span>
            </dd>
          </div>
          <div className="px-2 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Official links</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">100%</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
