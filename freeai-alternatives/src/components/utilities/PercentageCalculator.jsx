import { useState } from 'react'
import UtilityLayout from './UtilityLayout'

export default function PercentageCalculator({ onBack }) {
  const [mode, setMode] = useState('of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const x = parseFloat(a), y = parseFloat(b)
    if (isNaN(x) || isNaN(y)) { setResult('Please enter valid numbers'); return }
    if (mode === 'of') setResult(`${x}% of ${y} = ${(x / 100) * y}`)
    else if (mode === 'what') setResult(`${x} is ${((x / y) * 100).toFixed(2)}% of ${y}`)
    else if (mode === 'increase') setResult(`Increase from ${x} to ${y}: ${(((y - x) / x) * 100).toFixed(2)}%`)
    else if (mode === 'decrease') setResult(`Decrease from ${x} to ${y}: ${(((x - y) / x) * 100).toFixed(2)}%`)
  }

  const modes = [
    { id: 'of', label: 'X% of Y', aLabel: 'Percentage', bLabel: 'Number' },
    { id: 'what', label: 'X is what % of Y', aLabel: 'Number', bLabel: 'Of' },
    { id: 'increase', label: '% Increase', aLabel: 'Original', bLabel: 'New' },
    { id: 'decrease', label: '% Decrease', aLabel: 'Original', bLabel: 'New' },
  ]

  const current = modes.find((m) => m.id === mode)

  return (
    <UtilityLayout name="Percentage Calculator" icon={({ size }) => <span style={{ fontSize: size }}>📊</span>} onBack={onBack} description="Calculate percentages, increases, and decreases.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {modes.map((m) => (
              <button key={m.id} type="button" onClick={() => { setMode(m.id); setResult(null) }}
                className={`chip ${mode === m.id ? 'chip-active' : ''}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{current.aLabel}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{current.bLabel}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
          </div>
          <button type="button" onClick={calculate} className="btn btn-primary w-full py-3">Calculate</button>
          {result && (
            <div className="mt-4 rounded-xl bg-brand-50 p-4 text-center text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {result}
            </div>
          )}
        </div>
      </div>
    </UtilityLayout>
  )
}
