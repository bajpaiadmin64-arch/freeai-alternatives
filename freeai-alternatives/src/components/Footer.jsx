import { ShieldAlert } from 'lucide-react'
import Logo from './Logo'
import { siteConfig } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-700 dark:bg-night-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <Logo size="sm" light />
            <p className="mt-3 text-sm text-slate-200 dark:text-slate-300">{siteConfig.tagline}</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm" aria-label="Footer navigation">
            <a href="#alternatives" className="text-slate-300 transition-colors hover:text-white">
              AI Alternatives
            </a>
            <a href="#featured" className="text-slate-300 transition-colors hover:text-white">
              Featured
            </a>
            <a href="#compare" className="text-slate-300 transition-colors hover:text-white">
              Compare
            </a>
            <a href="#open-source" className="text-slate-300 transition-colors hover:text-white">
              Open Source
            </a>
            <a href="#utilities" className="text-slate-300 transition-colors hover:text-white">
              Utilities
            </a>
            <a href="#students" className="text-slate-300 transition-colors hover:text-white">
              Students
            </a>
            <a href="#about" className="text-slate-300 transition-colors hover:text-white">
              About
            </a>
          </nav>

          <div className="max-w-xs text-sm">
            <p className="font-semibold text-white">Stay updated</p>
            <p className="mt-1.5 text-slate-300 dark:text-slate-400">
              Tool data last verified: <span className="font-medium text-slate-100 dark:text-slate-200">{siteConfig.dataUpdatedOn}</span>. Free tiers change often.
            </p>
          </div>
        </div>

        <details className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 dark:border-white/10 dark:bg-white/5">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-white">
            <ShieldAlert size={16} className="text-[#b5dbe3]" />
            Disclaimer
          </summary>
          <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300 dark:text-slate-400">
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

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-center text-xs text-slate-300 sm:flex-row sm:text-left dark:border-white/10 dark:text-slate-400">
          <p>{siteConfig.footerNote}</p>
          <p>
            Free to use · No accounts · No tracking ·{' '}
            <a href="mailto:utkarshbajpai068@gmail.com" className="font-semibold text-[#b5dbe3] hover:underline hover:text-white">
              Feedback welcome
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}