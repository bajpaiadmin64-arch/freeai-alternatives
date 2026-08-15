import { useState, useMemo } from 'react'
import { Copy } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function WordCounter({ onBack }) {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length : 0
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
    const readTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, charsNoSpaces, sentences, paragraphs, readTime }
  }, [text])

  const items = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: `${stats.readTime} min` },
  ]

  return (
    <UtilityLayout name="Word & Character Counter" icon={({ size }) => <span style={{ fontSize: size }}>🔤</span>} onBack={onBack} description="Count words, characters, sentences, and paragraphs.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste or type your text here..."
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {items.map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-night-800">
                <div className="text-xl font-bold text-brand-600 dark:text-brand-300">{item.value}</div>
                <div className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
          {text && (
            <button type="button" onClick={() => navigator.clipboard.writeText(Object.entries(items).map(([, v]) => `${v.label}: ${v.value}`).join('\n'))}
              className="btn btn-soft mt-4 w-full py-2.5">
              <Copy size={14} /> Copy Stats
            </button>
          )}
        </div>
      </div>
    </UtilityLayout>
  )
}
