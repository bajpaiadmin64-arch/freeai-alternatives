import { useState, useRef } from 'react'
import { Upload, Download, Trash2 } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function BackgroundRemover({ onBack }) {
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const canvasRef = useRef(null)
  const outCanvasRef = useRef(null)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginal(file)
    setResult(null)
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
    }
    img.src = URL.createObjectURL(file)
  }

  const removeBackground = () => {
    setProcessing(true)
    const canvas = canvasRef.current
    const out = outCanvasRef.current
    const ctx = canvas.getContext('2d')
    const outCtx = out.getContext('2d')
    const w = canvas.width, h = canvas.height
    out.width = w; out.height = h

    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data
    const outData = outCtx.createImageData(w, h)

    // Simple color-based background removal
    // Sample corner colors to detect background
    const corners = [
      [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    ]
    let bgR = 0, bgG = 0, bgB = 0
    for (const [x, y] of corners) {
      const i = (y * w + x) * 4
      bgR += data[i]; bgG += data[i + 1]; bgB += data[i + 2]
    }
    bgR = Math.round(bgR / 4); bgG = Math.round(bgG / 4); bgB = Math.round(bgB / 4)

    const threshold = 60

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2)
      if (dist < threshold) {
        outData.data[i] = 0; outData.data[i + 1] = 0; outData.data[i + 2] = 0; outData.data[i + 3] = 0
      } else {
        outData.data[i] = r; outData.data[i + 1] = g; outData.data[i + 2] = b; outData.data[i + 3] = 255
      }
    }
    outCtx.putImageData(outData, 0, 0)
    setResult(out.toDataURL('image/png'))
    setProcessing(false)
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'background-removed.png'
    a.click()
  }

  return (
    <UtilityLayout name="Background Remover" icon={({ size }) => <span style={{ fontSize: size }}>🖼️</span>} onBack={onBack} description="Remove backgrounds from images using color-based detection.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Upload Image</label>
          <label className="mb-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-brand-400 dark:border-white/20 dark:hover:border-brand-400">
            <Upload size={32} className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{original ? original.name : 'Click or drag to upload'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={outCanvasRef} className="hidden" />

          <button type="button" onClick={removeBackground} disabled={!original || processing}
            className="btn btn-primary w-full py-3 mb-4">
            {processing ? 'Processing…' : 'Remove Background'}
          </button>

          {result && (
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-night-800">
                <p className="mb-1 text-center text-xs font-semibold text-slate-500">Original</p>
                <img src={URL.createObjectURL(original)} alt="Original" className="mx-auto max-h-32 rounded-lg object-contain" />
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-night-800">
                <p className="mb-1 text-center text-xs font-semibold text-brand-600">Result</p>
                <img src={result} alt="Result" className="mx-auto max-h-32 rounded-lg object-contain" style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50%/16px 16px' }} />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={download} disabled={!result} className="btn btn-primary flex-1 py-3">
              <Download size={15} /> Download PNG
            </button>
            <button type="button" onClick={() => { setOriginal(null); setResult(null) }} className="btn btn-soft px-4 py-3">
              <Trash2 size={15} />
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses color-based detection (corner sampling). Works best with solid-color backgrounds. For complex backgrounds, a ML-based solution is recommended.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
