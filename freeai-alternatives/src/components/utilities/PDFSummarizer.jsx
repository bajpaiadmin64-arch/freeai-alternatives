import { useState, useCallback } from 'react'
import { Copy, FileText } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

async function extractPdfText(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item) => item.str).join(' ') + '\n\n'
  }
  return text
}

function summarize(text, length) {
  const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10)
  if (!sentences.length) return 'No extractable text found in the document.'

  // Score sentences by word frequency
  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  const freq = {}
  for (const w of words) freq[w] = (freq[w] || 0) + 1
  const maxFreq = Math.max(...Object.values(freq), 1)

  const scored = sentences.map((s) => {
    const sWords = s.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
    const score = sWords.reduce((sum, w) => sum + (freq[w] || 0) / maxFreq, 0) / (sWords.length || 1)
    return { text: s, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const n = length === 'short' ? 3 : length === 'medium' ? 6 : 10
  return scored.slice(0, Math.min(n, scored.length)).map((s) => s.text + '.').join(' ')
}

export default function PDFSummarizer({ onBack }) {
  const [file, setFile] = useState(null)
  const [fullText, setFullText] = useState('')
  const [summary, setSummary] = useState('')
  const [length, setLength] = useState('medium')
  const [loading, setLoading] = useState(false)

  const handleUpload = useCallback(async (e) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') return
    setFile(f)
    setLoading(true)
    try {
      const text = await extractPdfText(f)
      setFullText(text)
    } catch {
      setFullText('Error: Could not extract text from this PDF.')
    }
    setLoading(false)
  }, [])

  const doSummarize = () => {
    if (!fullText) return
    setSummary(summarize(fullText, length))
  }

  const keyPoints = summary ? summary.split(/\.\s+/).filter((s) => s.trim()).slice(0, 8) : []

  return (
    <UtilityLayout name="PDF Summarizer" icon={({ size }) => <span style={{ fontSize: size }}>📄</span>} onBack={onBack} description="Extract key points from PDF documents using extractive summarization.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Upload PDF</label>
          <label className="mb-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-brand-400 dark:border-white/20 dark:hover:border-brand-400">
            <FileText size={32} className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{file ? file.name : 'Click to upload PDF'}</span>
            <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
          </label>

          {loading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
              Extracting text…
            </div>
          )}

          {fullText && !loading && (
            <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-night-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracted text ({fullText.length} characters)</p>
              <p className="mt-1 max-h-32 overflow-y-auto text-xs text-slate-600 dark:text-slate-300">{fullText.slice(0, 500)}…</p>
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <div className="flex gap-2">
              {['short', 'medium', 'detailed'].map((l) => (
                <button key={l} type="button" onClick={() => setLength(l)}
                  className={`chip capitalize ${length === l ? 'chip-active' : ''}`}>
                  {l}
                </button>
              ))}
            </div>
            <button type="button" onClick={doSummarize} disabled={!fullText} className="btn btn-primary py-2.5 px-4">
              ✨ Summarize
            </button>
          </div>

          {summary && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Summary</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(summary)} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{summary}</p>
              {keyPoints.length > 1 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Key Points:</p>
                  <ul className="mt-1 space-y-1">
                    {keyPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        {p.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses extractive summarization (sentence scoring by word frequency). Runs entirely in your browser.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
