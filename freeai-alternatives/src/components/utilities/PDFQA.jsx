import { useState, useCallback } from 'react'
import { Search, FileText } from 'lucide-react'
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

function findAnswer(text, question) {
  const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15)
  const qWords = question.toLowerCase().split(/\W+/).filter((w) => w.length > 2)

  if (!qWords.length) return { answer: 'Please ask a more specific question.', relevant: [] }

  const scored = sentences.map((s) => {
    const sLower = s.toLowerCase()
    const matches = qWords.filter((w) => sLower.includes(w)).length
    return { text: s, score: matches / qWords.length }
  })

  const relevant = scored.filter((s) => s.score > 0.2).sort((a, b) => b.score - a.score).slice(0, 5)

  if (!relevant.length) {
    return { answer: 'No relevant information found for this question. Try rephrasing or using different keywords.', relevant: [] }
  }

  return {
    answer: relevant.map((r) => r.text + '.').join(' '),
    relevant,
  }
}

export default function PDFQA({ onBack }) {
  const [file, setFile] = useState(null)
  const [fullText, setFullText] = useState('')
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
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

  const ask = () => {
    if (!fullText || !question.trim()) return
    setResult(findAnswer(fullText, question))
  }

  return (
    <UtilityLayout name="PDF Q&A" icon={({ size }) => <span style={{ fontSize: size }}>💬</span>} onBack={onBack} description="Ask questions about your PDF content.">
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
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Document loaded ({fullText.length} characters). Ask a question below.
            </p>
          )}

          <div className="mb-4 flex gap-2">
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder='e.g. "What are the main conclusions?"'
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
            <button type="button" onClick={ask} disabled={!fullText || !question.trim()} className="btn btn-primary px-4 py-3">
              <Search size={16} />
            </button>
          </div>

          {result && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
              <p className="mb-2 text-sm font-bold text-slate-800 dark:text-white">Answer</p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.answer}</p>
              {result.relevant.length > 1 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Relevant passages:</p>
                  <ul className="mt-1 space-y-1">
                    {result.relevant.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        {r.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses keyword-based search through extracted PDF text. Runs entirely in your browser.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
