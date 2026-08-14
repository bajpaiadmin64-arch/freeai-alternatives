import { ShieldAlert } from 'lucide-react'
import Logo from './Logo'
import { siteConfig } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t border-[#e9dfd0] bg-[#fdfaf5]/90 dark:border-white/10 dark:bg-night-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <Logo size="sm" showCredit />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{siteConfig.tagline}</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm" aria-label="Footer navigation">
            <a href="#alternatives" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              AI Alternatives
            </a>
            <a href="#featured" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Featured
            </a>
            <a href="#compare" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Compare
            </a>
            <a href="#open-source" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Open Source
            </a>
            <a href="#students" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Students
            </a>
            <a href="#about" className="text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              About
            </a>
          </nav>

          <div className="max-w-xs text-sm">
            <p className="font-semibold text-slate-800 dark:text-white">Stay updated</p>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400">
              Tool data last verified: <span className="font-medium text-slate-700 dark:text-slate-200">{siteConfig.dataUpdatedOn}</span>. Free tiers change often.
            </p>
          </div>
        </div>

        <details className="mt-10 rounded-2xl border border-[#e6dccd] bg-[#f8f2ea]/80 p-5 dark:border-white/10 dark:bg-night-800/60">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
            <ShieldAlert size={16} className="text-brand-500" />
            Disclaimer
          </summary>
          <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <p>
              This website is an independent directory and is not affiliated with OpenAI, Anthropic, Google, Microsoft,
              xAI, Perplexity, Mistral, Meta or any other listed company unless explicitly stated.
            </p>
            <p>
              AI services and their free tiers can change at any time. Always check the official provider website for
              the latest terms, limits and pricing.
            </p>
            <p>
              We do not provide cracked, pirated or unauthorized access to paid AI services. All links lead to official
              websites, and listings should not be interpreted as endorsements.
            </p>
          </div>
        </details>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left dark:border-white/10 dark:text-slate-400">
          <p>{siteConfig.footerNote}</p>
          <p>
            Free to use · No accounts · No tracking ·{' '}
            <a href="mailto:utkarshbajpai068@gmail.com" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
              Feedback welcome
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
