import { useState } from 'react'
import { Copy } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function convertHundreds(n) {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertHundreds(n % 100) : '')
}

function numberToWords(num) {
  if (num === 0) return 'Zero'
  const negative = num < 0
  num = Math.abs(num)
  const intPart = Math.floor(num)
  const decPart = Math.round((num - intPart) * 100)

  let result = ''
  if (intPart >= 10000000) result += convertHundreds(Math.floor(intPart / 10000000)) + ' Crore '
  if (intPart >= 100000) result += convertHundreds(Math.floor((intPart % 10000000) / 100000)) + ' Lakh '
  if (intPart >= 1000) result += convertHundreds(Math.floor((intPart % 100000) / 1000)) + ' Thousand '
  if (intPart % 1000 >= 100) result += convertHundreds(Math.floor((intPart % 1000) / 100)) + ' Hundred '
  if (intPart % 100 > 0) {
    if (intPart >= 100) result += 'and '
    result += convertHundreds(intPart % 100)
  }
  result = result.trim()
  if (decPart > 0) result += ' Point ' + String(decPart).split('').map((d) => ones[parseInt(d)] || 'Zero').join(' ')
  return (negative ? 'Negative ' : '') + (result || 'Zero')
}

export default function NumberToWords({ onBack }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const convert = () => {
    const n = parseFloat(input)
    if (isNaN(n)) { setResult('Please enter a valid number'); return }
    if (Math.abs(n) > 999999999999) { setResult('Number too large'); return }
    setResult(numberToWords(n))
  }

  return (
    <UtilityLayout name="Number to Words" icon={({ size }) => <span style={{ fontSize: size }}>🔢</span>} onBack={onBack} description="Convert numbers to words with Indian number formatting.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Enter a number</label>
          <input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 12500"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          <button type="button" onClick={convert} className="btn btn-primary w-full py-3">Convert to Words</button>
          {result && (
            <div className="mt-4 rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">{result}</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result)} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Copy">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Supports Indian numbering system (Lakhs, Crores). Handles decimals and negative numbers.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
