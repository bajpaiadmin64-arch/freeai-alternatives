import { useState, useRef, useCallback } from 'react'
import { Upload, Download, Trash2, Lock, Unlock } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

const presets = [
  { label: 'Custom', w: 0, h: 0 },
  { label: 'Instagram', w: 1080, h: 1080 },
  { label: 'YouTube', w: 1280, h: 720 },
  { label: 'WhatsApp', w: 800, h: 600 },
  { label: 'Profile', w: 400, h: 400 },
  { label: 'HD', w: 1920, h: 1080 },
]

export default function ImageResizer({ onBack }) {
  const [original, setOriginal] = useState(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockRatio, setLockRatio] = useState(true)
  const [preset, setPreset] = useState('Custom')
  const [resultUrl, setResultUrl] = useState(null)
  const aspectRef = useRef(1)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginal(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      aspectRef.current = img.width / img.height
      setWidth(img.width)
      setHeight(img.height)
      resize(img, img.width, img.height)
    }
    img.src = URL.createObjectURL(file)
  }

  const resize = useCallback((img, w, h) => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(img, 0, 0, w, h)
    setResultUrl(canvas.toDataURL('image/png'))
  }, [])

  const handleWidthChange = (w) => {
    setWidth(w)
    setPreset('Custom')
    if (lockRatio && imgRef.current) {
      const h = Math.round(w / aspectRef.current)
      setHeight(h)
      resize(imgRef.current, w, h)
    }
  }

  const handleHeightChange = (h) => {
    setHeight(h)
    setPreset('Custom')
    if (lockRatio && imgRef.current) {
      const w = Math.round(h * aspectRef.current)
      setWidth(w)
      resize(imgRef.current, w, h)
    }
  }

  const applyPreset = (p) => {
    setPreset(p.label)
    if (p.w && p.h) { setWidth(p.w); setHeight(p.h); if (imgRef.current) resize(imgRef.current, p.w, p.h) }
  }

  const download = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `resized-${width}x${height}.png`
    a.click()
  }

  return (
    <UtilityLayout name="Image Resizer" icon={({ size }) => <span style={{ fontSize: size }}>📐</span>} onBack={onBack} description="Resize images for any platform or purpose.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Upload Image</label>
          <label className="mb-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-brand-400 dark:border-white/20 dark:hover:border-brand-400">
            <Upload size={32} className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{original ? original.name : 'Click or drag to upload'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          <div className="mb-4 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.label} type="button" onClick={() => applyPreset(p)}
                className={`chip ${preset === p.label ? 'chip-active' : ''}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-2 items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Width (px)</label>
              <input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} min="1"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
            <div className="flex items-center justify-center pb-1">
              <button type="button" onClick={() => setLockRatio(!lockRatio)}
                className={`rounded-lg p-2 transition-colors ${lockRatio ? 'text-brand-500' : 'text-slate-400'}`}>
                {lockRatio ? <Lock size={18} /> : <Unlock size={18} />}
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Height (px)</label>
              <input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} min="1"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white" />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {resultUrl && (
            <div className="mb-4 flex justify-center rounded-xl bg-slate-50 p-4 dark:bg-night-800">
              <img src={resultUrl} alt="Resized" className="max-h-48 rounded-lg object-contain" />
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={download} disabled={!resultUrl} className="btn btn-primary flex-1 py-3">
              <Download size={15} /> Download
            </button>
            <button type="button" onClick={() => { setOriginal(null); setResultUrl(null) }} className="btn btn-soft px-4 py-3">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </UtilityLayout>
  )
}
