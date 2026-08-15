import { useState } from 'react'
import UtilityLayout from './UtilityLayout'

const categories = {
  Length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
    base: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  },
  Weight: {
    units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Ton'],
    base: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    custom: true,
  },
  Area: {
    units: ['Sq Meter', 'Sq Kilometer', 'Sq Foot', 'Sq Inch', 'Acre', 'Hectare'],
    base: { 'Sq Meter': 1, 'Sq Kilometer': 1e6, 'Sq Foot': 0.092903, 'Sq Inch': 0.00064516, Acre: 4046.86, Hectare: 10000 },
  },
  Volume: {
    units: ['Liter', 'Milliliter', 'Gallon (US)', 'Quart', 'Cup', 'Fl Oz'],
    base: { Liter: 1, Milliliter: 0.001, 'Gallon (US)': 3.78541, Quart: 0.946353, Cup: 0.236588, 'Fl Oz': 0.0295735 },
  },
  Data: {
    units: ['Byte', 'KB', 'MB', 'GB', 'TB'],
    base: { Byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  },
  Time: {
    units: ['Second', 'Millisecond', 'Minute', 'Hour', 'Day', 'Week', 'Month', 'Year'],
    base: { Second: 1, Millisecond: 0.001, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Month: 2629746, Year: 31557600 },
  },
}

function convertTemp(value, from, to) {
  let celsius
  if (from === 'Celsius') celsius = value
  else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15

  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export default function UnitConverter({ onBack }) {
  const [cat, setCat] = useState('Length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Kilometer')
  const [input, setInput] = useState('1')
  const [result, setResult] = useState('')

  const convert = () => {
    const v = parseFloat(input)
    if (isNaN(v)) { setResult('Please enter a number'); return }
    const c = categories[cat]
    if (cat === 'Temperature') {
      setResult(`${v} ${fromUnit} = ${convertTemp(v, fromUnit, toUnit).toFixed(4)} ${toUnit}`)
    } else {
      const baseVal = v * c.base[fromUnit]
      const out = baseVal / c.base[toUnit]
      setResult(`${v} ${fromUnit} = ${out.toFixed(6)} ${toUnit}`)
    }
  }

  const units = categories[cat].units

  return (
    <UtilityLayout name="Unit Converter" icon={({ size }) => <span style={{ fontSize: size }}>📏</span>} onBack={onBack} description="Convert between common units of measurement.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.keys(categories).map((c) => (
              <button key={c} type="button" onClick={() => { setCat(c); setFromUnit(categories[c].units[0]); setToUnit(categories[c].units[1]); setResult('') }}
                className={`chip ${cat === c ? 'chip-active' : ''}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-3 items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Value</label>
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">From</label>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">To</label>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <button type="button" onClick={convert} className="btn btn-primary w-full py-3">Convert</button>
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
