import { useEffect, useRef, useState } from 'react'
import { Mail, Phone, X } from 'lucide-react'

const CONTACT = {
  name: 'Utkarsh Bajpai',
  role: 'Designer & Developer',
  phone: '7706929484',
  phoneHref: 'tel:+917706929484',
  email: 'utkarshbajpai068@gmail.com',
  emailHref: 'mailto:utkarshbajpai068@gmail.com',
}

const SEEN_KEY = 'freeai-contact-popup-seen'
const OPEN_DELAY_MS = 2200
const CLOSE_MS = 220

export default function ContactPopup() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const timerRef = useRef(null)
  const closingRef = useRef(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return
    timerRef.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => {
    if (closingRef.current) return
    closingRef.current = true
    sessionStorage.setItem(SEEN_KEY, '1')
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
      closingRef.current = false
    }, CLOSE_MS)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact information"
    >
      <button
        type="button"
        aria-label="Close contact card"
        onClick={close}
        className={`absolute inset-0 cursor-default bg-slate-900/45 backdrop-blur-[2px] ${
          closing ? 'animate-pop-out' : 'animate-fade-in'
        }`}
      />

      <div
        className={`card relative w-full max-w-sm overflow-hidden rounded-3xl p-6 pt-8 shadow-lift sm:p-7 sm:pt-9 ${
          closing ? 'animate-pop-out' : 'animate-pop-in'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400" />

        <button
          type="button"
          onClick={close}
          aria-label="Close contact card"
          className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="tile inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-400 text-xl font-extrabold text-white">
            UB
          </span>
          <p className="eyebrow mt-4">Contact</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {CONTACT.name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            {CONTACT.role}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={CONTACT.phoneHref}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift dark:border-white/10 dark:bg-night-700/40 dark:hover:border-brand-500/50"
          >
            <span className="tile inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
              <Phone size={18} />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Phone
              </span>
              <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                {CONTACT.phone}
              </span>
            </span>
          </a>

          <a
            href={CONTACT.emailHref}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift dark:border-white/10 dark:bg-night-700/40 dark:hover:border-brand-500/50"
          >
            <span className="tile inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
              <Mail size={18} />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Email
              </span>
              <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                {CONTACT.email}
              </span>
            </span>
          </a>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
          Reach out anytime — calls, WhatsApp &amp; emails welcome.
        </p>
      </div>
    </div>
  )
}