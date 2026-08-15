import { useState } from 'react'
import { Plus, Trash2, ArrowDown, Copy } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

const steps = [
  { id: 'paste', label: '📝 Paste Text', description: 'Start with text input' },
  { id: 'upload', label: '📄 Upload PDF', description: 'Extract text from PDF' },
  { id: 'summarize', label: '✨ Summarize', description: 'Extract key points' },
  { id: 'question', label: '❓ Ask Question', description: 'Search for answers' },
  { id: 'rewrite', label: '✍️ Rewrite', description: 'Improve the text' },
  { id: 'grammar', label: '🔤 Fix Grammar', description: 'Correct grammar errors' },
  { id: 'simplify', label: '📖 Simplify', description: 'Make text simpler' },
  { id: 'translate', label: '🌐 Translate', description: 'Translate to another language' },
]

function extractiveSummarize(text) {
  const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10)
  if (!sentences.length) return text
  const words = text.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  const freq = {}
  for (const w of words) freq[w] = (freq[w] || 0) + 1
  const maxFreq = Math.max(...Object.values(freq), 1)
  const scored = sentences.map((s) => {
    const sWords = s.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
    return { text: s, score: sWords.reduce((sum, w) => sum + (freq[w] || 0) / maxFreq, 0) / (sWords.length || 1) }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 4).map((s) => s.text + '.').join(' ')
}

function processStep(text, stepId, input) {
  if (stepId === 'summarize') return extractiveSummarize(text)
  if (stepId === 'rewrite') return text.replace(/\b(very|really|just|actually|basically)\b/gi, '').replace(/\s+/g, ' ').trim()
  if (stepId === 'grammar') {
    let r = text.replace(/\bi\b/g, 'I').replace(/\s+/g, ' ')
    r = r.replace(/([.!?])\s*([a-z])/g, (_, p, c) => p + ' ' + c.toUpperCase())
    return r[0]?.toUpperCase() + r.slice(1)
  }
  if (stepId === 'simplify') {
    const complex = { 'utilize': 'use', 'demonstrate': 'show', 'approximately': 'about', 'subsequently': 'then', 'furthermore': 'also', 'nevertheless': 'but', 'endeavor': 'try' }
    let r = text
    for (const [k, v] of Object.entries(complex)) r = r.replace(new RegExp(k, 'gi'), v)
    return r
  }
  if (stepId === 'question') {
    const q = (input || '').toLowerCase()
    const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10)
    const qWords = q.split(/\W+/).filter((w) => w.length > 2)
    const relevant = sentences.filter((s) => qWords.some((w) => s.toLowerCase().includes(w))).slice(0, 5)
    return relevant.length ? relevant.join('. ') + '.' : 'No relevant information found.'
  }
  return text
}

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

export default function AIWorkspace({ onBack }) {
  const [workflowSteps, setWorkflowSteps] = useState([{ id: 'paste', input: '', output: '' }])
  const [loading, setLoading] = useState(false)

  const addStep = () => setWorkflowSteps((p) => [...p, { id: 'summarize', input: '', output: '' }])
  const removeStep = (i) => setWorkflowSteps((p) => p.filter((_, idx) => idx !== i))
  const updateStep = (i, field, value) => setWorkflowSteps((p) => p.map((s, idx) => idx === i ? { ...s, [field]: value } : s))

  const runWorkflow = async () => {
    setLoading(true)
    let currentText = ''
    const results = [...workflowSteps]

    for (let i = 0; i < results.length; i++) {
      if (results[i].id === 'upload' && results[i].file) {
        try { currentText = await extractPdfText(results[i].file) } catch { currentText = 'PDF extraction failed.' }
      } else if (results[i].id === 'paste') {
        currentText = results[i].input || currentText
      } else if (results[i].id === 'question') {
        currentText = processStep(currentText, 'question', results[i].input)
      } else {
        currentText = processStep(currentText, results[i].id)
      }
      results[i].output = currentText
    }
    setWorkflowSteps(results)
    setLoading(false)
  }

  return (
    <UtilityLayout name="AI Workspace" icon={({ size }) => <span style={{ fontSize: size }}>🤖</span>} onBack={onBack} description="Combine multiple AI tools in one workflow.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Build a pipeline: add steps, then run the workflow. Each step processes the output of the previous one.
          </p>

          <div className="space-y-4">
            {workflowSteps.map((step, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown size={16} className="text-brand-400" />
                  </div>
                )}
                <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="mb-3 flex items-center justify-between">
                    <select value={step.id} onChange={(e) => updateStep(i, 'id', e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
                      {steps.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    {workflowSteps.length > 1 && (
                      <button type="button" onClick={() => removeStep(i)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  {step.id === 'upload' ? (
                    <input type="file" accept=".pdf" onChange={(e) => updateStep(i, 'file', e.target.files?.[0])}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-night-800 dark:text-white" />
                  ) : step.id !== 'paste' || i === 0 ? (
                    <textarea value={step.input} onChange={(e) => updateStep(i, 'input', e.target.value)} rows={2}
                      placeholder={step.id === 'paste' ? 'Enter or paste text…' : step.id === 'question' ? 'e.g. What are the main points?' : 'Optional input…'}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white" />
                  ) : null}
                  {step.output && (
                    <div className="mt-3 rounded-lg bg-brand-50/60 p-3 dark:bg-brand-500/5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase text-brand-600 dark:text-brand-300">Output</p>
                        <button type="button" onClick={() => navigator.clipboard.writeText(step.output)} className="rounded p-1 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20">
                          <Copy size={12} />
                        </button>
                      </div>
                      <p className="mt-1 max-h-32 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">{step.output}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={addStep} className="btn btn-soft flex-1 py-2.5">
              <Plus size={15} /> Add Step
            </button>
            <button type="button" onClick={runWorkflow} disabled={loading} className="btn btn-primary flex-1 py-2.5">
              {loading ? 'Running…' : '▶ Run Workflow'}
            </button>
          </div>
        </div>
      </div>
    </UtilityLayout>
  )
}
