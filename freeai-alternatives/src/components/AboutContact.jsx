import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

export default function AboutContact() {
  return (
    <>
      <section id="about" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="card rounded-3xl p-8 sm:p-12">
            <p className="eyebrow">Who we are</p>
            <h2 className="section-title mt-3">About This Website</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              This project was created to make powerful AI tools easier to discover without forcing users to pay for
              expensive subscriptions. We collect legitimate free tiers, free AI services and open-source alternatives
              in one simple directory.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Our core message is simple: <strong className="text-slate-800 dark:text-white">why pay more when there are powerful free AI options?</strong>{' '}
              Search, find an alternative, click, and use the official service for free.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" size={20} />
              <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                We do not provide cracked, pirated or unauthorized access to paid AI services. Every link on this site
                goes to the official website of the listed provider.
              </p>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              No accounts are required to use this website, and we collect no personal data. Everything runs in your
              browser — search, filters and comparisons work fully client-side.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="card rounded-3xl p-8 sm:p-12">
            <p className="eyebrow">Get in touch</p>
            <h2 className="section-title mt-3">Contact</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Developed &amp; Designed by <strong className="text-slate-800 dark:text-white">Utkarsh Bajpai</strong>
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a
                href="tel:+917706929484"
                className="card card-hover p-5 text-center"
              >
                <span className="tile mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
                  <Phone size={20} />
                </span>
                <p className="mt-2.5 text-sm font-bold text-slate-900 dark:text-white">7706929484</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Call or WhatsApp</p>
              </a>
              <a
                href="mailto:utkarshbajpai068@gmail.com"
                className="card card-hover p-5 text-center sm:col-span-2"
              >
                <span className="tile mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
                  <Mail size={20} />
                </span>
                <p className="mt-2.5 break-all text-sm font-bold text-slate-900 dark:text-white">utkarshbajpai068@gmail.com</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Send an email anytime</p>
              </a>
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={14} className="text-brand-500" />
              Website designed and developed by Utkarsh Bajpai · Available worldwide
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
