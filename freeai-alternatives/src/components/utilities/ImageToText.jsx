import { useState, useRef } from 'react'
import { Upload, Copy, Download, Trash2 } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function ImageToText({ onBack }) {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('eng')
  const imgRef = useRef(null)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImageUrl(URL.createObjectURL(file))
    setText('')
  }

  const extractText = async () => {
    if (!imageUrl) return
    setLoading(true)
    try {
      const Tesseract = await import('tesseract.js')
      const result = await Tesseract.recognize(imageUrl, lang, {
        logger: () => {},
      })
      setText(result.data.text)
    } catch {
      setText('Error: OCR failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <UtilityLayout name="Image to Text (OCR)" icon={({ size }) => <span style={{ fontSize: size }}>📑</span>} onBack={onBack} description="Extract text from images and screenshots using OCR.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Upload Image</label>
          <label className="mb-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-brand-400 dark:border-white/20 dark:hover:border-brand-400">
            <Upload size={32} className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{image ? image.name : 'Click to upload image with text'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          {imageUrl && (
            <div className="mb-4 flex justify-center rounded-xl bg-slate-50 p-4 dark:bg-night-800">
              <img ref={imgRef} src={imageUrl} alt="Uploaded" className="max-h-48 rounded-lg object-contain" />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Language</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
              </select>
            </div>
            <button type="button" onClick={extractText} disabled={!imageUrl || loading}
              className="btn btn-primary mt-5 flex-1 py-3">
              {loading ? 'Extracting…' : 'Extract Text'}
            </button>
          </div>

          {loading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
              Loading OCR engine (may take a moment)…
            </div>
          )}

          {text && (
            <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Extracted text</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
          )}

          {text && (
            <div className="flex gap-2">
              <button type="button" onClick={() => navigator.clipboard.writeText(text)} className="btn btn-soft flex-1 py-2.5">
                <Copy size={14} /> Copy
              </button>
              <button type="button" onClick={() => { const b = new Blob([text], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'ocr-text.txt'; a.click(); URL.revokeObjectURL(u) }}
                className="btn btn-soft flex-1 py-2.5">
                <Download size={14} /> Download
              </button>
              <button type="button" onClick={() => setText('')} className="btn btn-soft px-4 py-2.5">
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses Tesseract.js (runs in browser). First use downloads OCR models (~15MB). English and Hindi supported.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
