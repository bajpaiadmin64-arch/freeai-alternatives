import { useState } from 'react'
import { Delete } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function Calculator({ onBack }) {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [justEvaluated, setJustEvaluated] = useState(false)

  const inputDigit = (d) => {
    if (justEvaluated) { setDisplay(d); setExpression(''); setJustEvaluated(false); return }
    setDisplay((p) => (p === '0' ? d : p + d))
  }

  const inputDot = () => {
    if (justEvaluated) { setDisplay('0.'); setExpression(''); setJustEvaluated(false); return }
    if (!display.includes('.')) setDisplay((p) => p + '.')
  }

  const inputOp = (op) => {
    setExpression((p) => p + display + ' ' + op + ' ')
    setDisplay('0')
    setJustEvaluated(false)
  }

  const evaluate = () => {
    try {
      const full = expression + display
      const result = Function('"use strict"; return (' + full + ')')()
      setDisplay(String(result))
      setExpression('')
      setJustEvaluated(true)
    } catch { setDisplay('Error') }
  }

  const clear = () => { setDisplay('0'); setExpression(''); setJustEvaluated(false) }
  const backspace = () => setDisplay((p) => (p.length > 1 ? p.slice(0, -1) : '0'))
  const percent = () => setDisplay((p) => String(parseFloat(p) / 100))
  const negate = () => setDisplay((p) => String(-parseFloat(p)))

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ]

  const handleBtn = (b) => {
    if (b === 'C') return clear()
    if (b === '⌫') return backspace()
    if (b === '±') return negate()
    if (b === '%') return percent()
    if (b === '=') return evaluate()
    if (['÷', '×', '−', '+'].includes(b)) return inputOp(b === '÷' ? '/' : b === '×' ? '*' : b === '−' ? '-' : b)
    if (b === '.') return inputDot()
    inputDigit(b)
  }

  const sciButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['log', 'ln', '√', 'x²'],
  ]

  return (
    <UtilityLayout name="Calculator" icon={({ size }) => <span style={{ fontSize: size }}>🧮</span>} onBack={onBack} description="Basic and scientific calculator.">
      <div className="mx-auto max-w-sm">
        <div className="card p-4">
          <div className="mb-4 rounded-xl bg-slate-50 p-4 text-right dark:bg-night-800">
            {expression && (
              <div className="text-xs text-slate-400 dark:text-slate-500">{expression}</div>
            )}
            <div className="text-3xl font-bold text-slate-900 dark:text-white truncate">{display}</div>
          </div>

          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {sciButtons.flat().map((b) => (
              <button
                key={'s' + b}
                type="button"
                onClick={() => {
                  const v = parseFloat(display)
                  if (b === 'sin') setDisplay(String(Math.sin(v * Math.PI / 180)))
                  else if (b === 'cos') setDisplay(String(Math.cos(v * Math.PI / 180)))
                  else if (b === 'tan') setDisplay(String(Math.tan(v * Math.PI / 180)))
                  else if (b === 'π') setDisplay(String(Math.PI))
                  else if (b === 'log') setDisplay(String(Math.log10(v)))
                  else if (b === 'ln') setDisplay(String(Math.log(v)))
                  else if (b === '√') setDisplay(String(Math.sqrt(v)))
                  else if (b === 'x²') setDisplay(String(v * v))
                  setJustEvaluated(true)
                }}
                className="rounded-lg bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-night-700 dark:text-slate-300 dark:hover:bg-night-600"
              >
                {b}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {buttons.flat().map((b) => {
              const isOp = ['÷', '×', '−', '+', '='].includes(b)
              const isAction = ['C', '±', '%'].includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBtn(b)}
                  className={`rounded-xl py-3 text-lg font-semibold transition-all active:scale-95 ${
                    b === '0' ? 'col-span-1' : ''
                  } ${
                    isOp
                      ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-[0_2px_8px_rgba(0,96,120,0.3)]'
                      : isAction
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-night-700 dark:text-slate-300'
                        : 'bg-white text-slate-900 hover:bg-slate-50 dark:bg-night-800 dark:text-white dark:hover:bg-night-700'
                  }`}
                >
                  {b === '⌫' ? <Delete size={18} className="mx-auto" /> : b}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </UtilityLayout>
  )
}
