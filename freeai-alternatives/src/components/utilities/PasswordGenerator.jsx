import { useState, useCallback } from 'react'
import { Copy, RefreshCw, Check } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function PasswordGenerator({ onBack }) {
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    let chars = ''
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (numbers) chars += '0123456789'
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if (!chars) { setPassword('Select at least one option'); return }
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    setPassword(Array.from(arr, (v) => chars[v % chars.length]).join(''))
    setCopied(false)
  }, [length, uppercase, lowercase, numbers, symbols])

  const strength = (() => {
    let s = 0
    if (length >= 8) s++
    if (length >= 12) s++
    if (length >= 16) s++
    if (uppercase && lowercase) s++
    if (numbers) s++
    if (symbols) s++
    if (s <= 2) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', w: 'w-1/4' }
    if (s <= 4) return { label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500', w: 'w-2/4' }
    if (s <= 5) return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', w: 'w-3/4' }
    return { label: 'Very Strong', color: 'text-emerald-600', bg: 'bg-emerald-600', w: 'w-full' }
  })()

  return (
    <UtilityLayout name="Password Generator" icon={({ size }) => <span style={{ fontSize: size }}>🔐</span>} onBack={onBack} description="Create secure random passwords. Never stored.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          {password && (
            <div className="mb-4 rounded-xl bg-slate-50 p-4 font-mono text-sm break-all dark:bg-night-800">
              <span className="text-slate-900 dark:text-white">{password}</span>
            </div>
          )}
          {password && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-night-700">
                <div className={`h-full rounded-full transition-all ${strength.bg} ${strength.w}`} />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Length: {length}</label>
            <input type="range" min="6" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-brand-500" />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {[
              { label: 'Uppercase (A-Z)', value: uppercase, set: setUppercase },
              { label: 'Lowercase (a-z)', value: lowercase, set: setLowercase },
              { label: 'Numbers (0-9)', value: numbers, set: setNumbers },
              { label: 'Symbols (!@#)', value: symbols, set: setSymbols },
            ].map((o) => (
              <label key={o.label} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-xs font-medium text-slate-700 cursor-pointer dark:border-white/10 dark:text-slate-300">
                <input type="checkbox" checked={o.value} onChange={(e) => o.set(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400" />
                {o.label}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={generate} className="btn btn-primary flex-1 py-3">
              <RefreshCw size={15} /> Generate
            </button>
            {password && (
              <button type="button" onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                className="btn btn-soft px-4 py-3">
                {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Passwords are generated locally using crypto.getRandomValues() and never stored.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
