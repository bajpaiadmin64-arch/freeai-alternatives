import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function QRCodeGenerator({ onBack }) {
  const [text, setText] = useState('https://freeai-alternatives.com')
  const [size, setSize] = useState(200)
  const [darkColor, setDarkColor] = useState('#213234')
  const canvasRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return
    setError('')
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: darkColor, light: '#ffffff' },
    }).catch(() => setError('Could not generate QR code. Try shorter text.'))
  }, [text, size, darkColor])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <UtilityLayout name="QR Code Generator" icon={({ size: s }) => <span style={{ fontSize: s }}>🔗</span>} onBack={onBack} description="Generate QR codes from text, URLs, or contact info.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Text or URL</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Enter text or URL..."
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Size: {size}px</label>
              <input type="range" min="100" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Color</label>
              <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 dark:border-white/10" />
            </div>
          </div>
          <div className="flex justify-center rounded-xl bg-slate-50 p-6 dark:bg-night-800">
            <canvas ref={canvasRef} className="block" />
          </div>
          {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
          <button type="button" onClick={download} className="btn btn-primary mt-4 w-full py-3" disabled={!text.trim()}>
            <Download size={15} /> Download PNG
          </button>
        </div>
      </div>
    </UtilityLayout>
  )
}
