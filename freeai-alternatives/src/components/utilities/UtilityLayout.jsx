import { ArrowLeft } from 'lucide-react'

export default function UtilityLayout({ name, icon: Icon, description, onBack, children }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
      >
        <ArrowLeft size={16} />
        Back to Utilities
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="tile flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
            <Icon size={22} />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
