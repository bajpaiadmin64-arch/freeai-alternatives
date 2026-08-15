import { useState, useRef } from 'react'
import { Upload, Download, Trash2 } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function ImageCompressor({ onBack }) {
  const [original, setOriginal] = useState(null)
  const [compressed, setCompressed] = useState(null)
  const [quality, setQuality] = useState(0.7)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const canvasRef = useRef(null)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginal(file)
    setOriginalSize(file.size)
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      compress(img, quality)
    }
    img.src = URL.createObjectURL(file)
  }

  const compress = (img, q) => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        setCompressedSize(blob.size)
        setCompressed(URL.createObjectURL(blob))
      }
    }, 'image/jpeg', q)
  }

  const handleQualityChange = (q) => {
    setQuality(q)
    if (original) {
      const img = new Image()
      img.onload = () => compress(img, q)
      img.src = URL.createObjectURL(original)
    }
  }

  const download = () => {
    if (!compressed) return
    const a = document.createElement('a')
    a.href = compressed
    a.download = 'compressed.jpg'
    a.click()
  }

  const reduction = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : 0

  return (
    <UtilityLayout name="Image Compressor" icon={({ size }) => <span style={{ fontSize: size }}>🖼️</span>} onBack={onBack} description="Reduce image file sizes without quality loss.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Upload Image</label>
          <label className="mb-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-brand-400 dark:border-white/20 dark:hover:border-brand-400">
            <Upload size={32} className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{original ? original.name : 'Click or drag to upload'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))} className="w-full accent-brand-500" />
          </div>

          {original && (
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-night-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">Original</div>
                <div className="font-bold text-slate-900 dark:text-white">{(originalSize / 1024).toFixed(1)} KB</div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-center dark:bg-brand-500/10">
                <div className="text-xs text-brand-600 dark:text-brand-300">Compressed</div>
                <div className="font-bold text-brand-700 dark:text-brand-200">{(compressedSize / 1024).toFixed(1)} KB</div>
              </div>
            </div>
          )}

          {original && compressed && (
            <p className="mb-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {reduction > 0 ? `${reduction}% smaller` : 'No size reduction at this quality'}
            </p>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {compressed && (
            <div className="mb-4 flex justify-center">
              <img src={compressed} alt="Compressed" className="max-h-48 rounded-lg object-contain" />
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={download} disabled={!compressed} className="btn btn-primary flex-1 py-3">
              <Download size={15} /> Download
            </button>
            <button type="button" onClick={() => { setOriginal(null); setCompressed(null); setOriginalSize(0); setCompressedSize(0) }}
              className="btn btn-soft px-4 py-3">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </UtilityLayout>
  )
}
