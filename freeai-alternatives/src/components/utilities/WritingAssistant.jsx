import { useState } from 'react'
import { Copy } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

const modes = [
  { id: 'email', label: 'Email', prompt: 'Professional email' },
  { id: 'application', label: 'Application', prompt: 'Formal application letter' },
  { id: 'paragraph', label: 'Paragraph', prompt: 'Well-structured paragraph' },
  { id: 'blog', label: 'Blog', prompt: 'Blog post content' },
  { id: 'social', label: 'Social Media', prompt: 'Social media caption' },
  { id: 'resume', label: 'Resume', prompt: 'Resume content' },
  { id: 'rewrite', label: 'Rewrite', prompt: 'Rewritten text' },
  { id: 'grammar', label: 'Grammar', prompt: 'Grammar-corrected text' },
]

function processText(text, mode) {
  if (!text.trim()) return ''
  if (mode === 'grammar') {
    let result = text
    result = result.replace(/\bi\b/g, 'I')
    result = result.replace(/\bi'm\b/gi, "I'm")
    result = result.replace(/\bi'll\b/gi, "I'll")
    result = result.replace(/\bi've\b/gi, "I've")
    result = result.replace(/\bim\b/gi, "I'm")
    result = result.replace(/\s+/g, ' ')
    result = result.replace(/([.!?])\s*([a-z])/g, (_, p, c) => p + ' ' + c.toUpperCase())
    if (result && result[0] !== result[0].toUpperCase()) result = result[0].toUpperCase() + result.slice(1)
    return result
  }
  if (mode === 'rewrite') {
    return text.replace(/\b(very|really|just|actually|basically)\b/gi, '').replace(/\s+/g, ' ').trim()
  }
  if (mode === 'email') {
    const lines = text.split('\n').filter(Boolean)
    const subject = lines[0] || text.slice(0, 50)
    const body = lines.slice(1).join('\n') || text
    return `Subject: ${subject}\n\nDear Team,\n\n${body}\n\nBest regards`
  }
  if (mode === 'social') {
    const cleaned = text.replace(/\n+/g, ' ').trim()
    const hashtags = cleaned.split(' ').filter((w) => w.length > 4).slice(0, 3).map((w) => '#' + w.toLowerCase()).join(' ')
    return `${cleaned}\n\n${hashtags}`
  }
  if (mode === 'resume') {
    const lines = text.split('\n').filter(Boolean)
    return lines.map((l) => {
      if (l.startsWith('-') || l.startsWith('•')) return l
      return '• ' + l.charAt(0).toUpperCase() + l.slice(1)
    }).join('\n')
  }
  if (mode === 'application') {
    return `To Whom It May Concern,\n\n${text}\n\nThank you for your consideration.\n\nSincerely`
  }
  if (mode === 'blog') {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim())
    if (sentences.length < 2) return `## Introduction\n\n${text}\n\n## Conclusion\n\nThis covers the main points.`
    return `## Introduction\n\n${sentences[0].trim()}.\n\n## Main Points\n\n${sentences.slice(1, -1).map((s) => s.trim() + '.').join('\n\n')}\n\n## Conclusion\n\n${sentences[sentences.length - 1].trim()}.`
  }
  if (mode === 'paragraph') {
    return text.replace(/\n+/g, ' ').trim()
  }
  return text
}

export default function WritingAssistant({ onBack }) {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('email')
  const [result, setResult] = useState('')

  const process = () => {
    setResult(processText(text, mode))
  }

  const currentMode = modes.find((m) => m.id === mode)

  return (
    <UtilityLayout name="AI Writing Assistant" icon={({ size }) => <span style={{ fontSize: size }}>✍️</span>} onBack={onBack} description="Rewrite, improve grammar, and generate content templates.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {modes.map((m) => (
              <button key={m.id} type="button" onClick={() => { setMode(m.id); setResult('') }}
                className={`chip ${mode === m.id ? 'chip-active' : ''}`}>
                {m.label}
              </button>
            ))}
          </div>

          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            {currentMode?.prompt || 'Enter your text'}
          </label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Enter your text here…"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />

          <button type="button" onClick={process} disabled={!text.trim()} className="btn btn-primary w-full py-3 mb-4">
            ✨ Process
          </button>

          {result && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Result</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result)} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result}</pre>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses rule-based text processing. For advanced AI writing, a backend API integration is recommended.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
