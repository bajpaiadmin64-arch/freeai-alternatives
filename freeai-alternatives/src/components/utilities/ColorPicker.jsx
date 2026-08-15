import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700 hover:bg-slate-200 dark:bg-night-700 dark:text-slate-300 dark:hover:bg-night-600">
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {' '}{text}
    </button>
  )
}

export default function ColorPicker({ onBack }) {
  const [hex, setHex] = useState('#006078')
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const handleHex = (v) => { if (/^#[0-9a-fA-F]{6}$/.test(v)) setHex(v) }

  return (
    <UtilityLayout name="Color Picker" icon={({ size }) => <span style={{ fontSize: size }}>🎨</span>} onBack={onBack} description="Pick colors and copy HEX, RGB, HSL values.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-4">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)}
              className="h-20 w-20 cursor-pointer rounded-xl border-2 border-slate-200 dark:border-white/10" />
            <div>
              <input type="text" value={hex} onChange={(e) => handleHex(e.target.value)} maxLength={7}
                className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white" />
              <div className="mt-2 h-8 rounded-lg" style={{ backgroundColor: hex }} />
            </div>
          </div>
          <div className="space-y-2">
            <CopyBtn text={hex.toUpperCase()} />
            <CopyBtn text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            <CopyBtn text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </div>
        </div>
      </div>
    </UtilityLayout>
  )
}
