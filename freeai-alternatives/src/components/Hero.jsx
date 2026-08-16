import { ArrowDown, BadgeCheck, Compass, Search, Sparkles } from 'lucide-react'
import { categories, tools } from '../data/tools'

export default function Hero({ onSearch }) {
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Layered atmospheric depth — large ambient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-300/20 via-gold-300/15 to-brand-400/10 blur-[80px] animate-hero-glow" />
      <div className="pointer-events-none absolute -bottom-28 -left-40 h-80 w-80 rounded-full bg-gold-300/12 blur-[60px]" />
      <div className="pointer-events-none absolute -right-36 top-36 h-80 w-80 rounded-full bg-brand-400/12 blur-[60px]" />

      {/* Floating DeepSeek card — 3D layered */}
      <div className="pointer-events-none absolute left-[8%] top-1/2 hidden -translate-y-1/2 lg:block" style={{ perspective: '600px' }}>
        <div
          className="animate-float-slow flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md border border-white/50"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            boxShadow: '0 4px 8px rgb(33 50 52 / 0.06), 0 12px 24px -8px rgb(0 96 120 / 0.1), 0 24px 48px -16px rgb(0 96 120 / 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px) rotateX(2deg)',
          }}
        >
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

      {/* Floating Gemini card — 3D layered */}
      <div className="pointer-events-none absolute right-[7%] top-1/3 hidden -translate-y-1/2 lg:block" style={{ perspective: '600px' }}>
        <div
          className="animate-float-slower flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md border border-white/50"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            boxShadow: '0 4px 8px rgb(33 50 52 / 0.06), 0 12px 24px -8px rgb(0 96 120 / 0.1), 0 24px 48px -16px rgb(0 96 120 / 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px) rotateX(-2deg)',
          }}
        >
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

      {/* Hero content — layered depth */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6" style={{ perspective: '800px' }}>
        <p className="animate-fade-up mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" style={{ boxShadow: '0 2px 8px rgb(33 50 52 / 0.06), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
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

        {/* Stats bar — glassmorphic with depth */}
        <dl
          className="animate-fade-up mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x divide-slate-200/60 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md py-4 dark:divide-white/10 dark:border-white/8 dark:bg-white/5"
          style={{
            animationDelay: '400ms',
            boxShadow: '0 4px 12px rgb(33 50 52 / 0.06), 0 16px 32px -12px rgb(0 96 120 / 0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          <div className="px-2 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Tools listed</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{tools.length}</dd>
          </div>
          <div className="px-2 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Categories</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{categories.length}</dd>
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
