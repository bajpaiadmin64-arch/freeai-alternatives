import { useEffect, useState } from 'react'
import { Menu, Moon, PenLine, Search, Sun, X } from 'lucide-react'
import Logo from './Logo'
import { useApp } from '../context/AppContext'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#alternatives', label: 'AI Alternatives' },
  { href: '#categories', label: 'Categories' },
  { href: '#compare', label: 'Compare' },
  { href: '#open-source', label: 'Open Source' },
  { href: '#about', label: 'About' },
]

export default function Navbar() {
  const { dark, setDark } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_-14px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-night-950/95'
          : 'border-b border-transparent bg-white/75 backdrop-blur-md dark:bg-night-950/70'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
        <a href="#home" aria-label="FreeAI Alternatives — Home">
          <Logo showCredit />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[11px] font-medium text-slate-500 xl:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            <PenLine size={11} className="text-brand-500" />
            Designed &amp; Developed by Utkarsh Bajpai
          </span>

          <a
            href="#search"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Search AI tools"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
          </a>

          <button
            type="button"
            onClick={() => setDark(!dark)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-brand-50 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200/80 bg-white/98 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.2)] lg:hidden dark:border-white/10 dark:bg-night-900">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 px-3 pt-3 text-[11px] font-medium text-slate-400 dark:border-white/10 dark:text-slate-500">
              <PenLine size={11} className="text-brand-500" />
              Designed &amp; Developed by Utkarsh Bajpai
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
