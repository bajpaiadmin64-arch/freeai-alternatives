import { useState } from 'react'
import { Copy } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

function extractiveSummarize(text, length) {
  const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10)
  if (!sentences.length) return { summary: 'No extractable sentences found.', keyPoints: [] }

  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  const freq = {}
  for (const w of words) freq[w] = (freq[w] || 0) + 1
  const maxFreq = Math.max(...Object.values(freq), 1)

  const scored = sentences.map((s, i) => {
    const sWords = s.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
    const wordScore = sWords.reduce((sum, w) => sum + (freq[w] || 0) / maxFreq, 0) / (sWords.length || 1)
    const positionBonus = i < 3 ? 0.3 : 0
    return { text: s, score: wordScore + positionBonus, index: i }
  })

  scored.sort((a, b) => b.score - a.score)
  const n = length === 'short' ? 2 : length === 'medium' ? 4 : 7
  const selected = scored.slice(0, Math.min(n, scored.length)).sort((a, b) => a.index - b.index)

  return {
    summary: selected.map((s) => s.text + '.').join(' '),
    keyPoints: selected.map((s) => s.text).slice(0, 5),
  }
}

export default function TextSummarizer({ onBack }) {
  const [text, setText] = useState('')
  const [length, setLength] = useState('medium')
  const [result, setResult] = useState(null)

  const summarize = () => {
    if (!text.trim()) return
    setResult(extractiveSummarize(text, length))
  }

  return (
    <UtilityLayout name="AI Text Summarizer" icon={({ size }) => <span style={{ fontSize: size }}>📝</span>} onBack={onBack} description="Summarize long texts into key points using extractive summarization.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Paste your text here</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste or type the text you want to summarize…"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />

          <div className="mb-4 flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Length:</label>
            {['short', 'medium', 'detailed'].map((l) => (
              <button key={l} type="button" onClick={() => setLength(l)}
                className={`chip capitalize ${length === l ? 'chip-active' : ''}`}>
                {l}
              </button>
            ))}
          </div>

          <button type="button" onClick={summarize} disabled={!text.trim()} className="btn btn-primary w-full py-3 mb-4">
            ✨ Summarize
          </button>

          {result && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Summary</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.summary)} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.summary}</p>
              {result.keyPoints.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Key Points:</p>
                  <ul className="mt-1 space-y-1">
                    {result.keyPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses extractive summarization (sentence scoring by word frequency). Runs entirely in your browser — no data sent to any server.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
