import { useState, useRef } from 'react'
import { Mic, Square, Copy, Download } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function SpeechToText({ onBack }) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const startListening = () => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    setError('')
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + ' '
      }
      if (final) setText((prev) => prev + final)
    }
    recognition.onerror = (e) => {
      setListening(false)
      if (e.error === 'not-allowed') setError('Microphone access denied. Please allow microphone permissions.')
      else setError(`Error: ${e.error}`)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!SpeechRecognition) { setError('Audio file transcription requires Chrome or Edge.'); return }
    setError('Audio file transcription: use the browser Speech API for microphone input. File upload transcription requires a backend service.')
  }

  return (
    <UtilityLayout name="Speech to Text" icon={({ size }) => <span style={{ fontSize: size }}>🎤</span>} onBack={onBack} description="Transcribe speech and audio to text.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <button type="button" onClick={listening ? stopListening : startListening}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                listening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600'
              }`}>
              {listening ? <Square size={24} /> : <Mic size={24} />}
            </button>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{listening ? 'Listening…' : 'Tap to start'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{listening ? 'Speak now. Tap stop when done.' : 'Microphone input (Chrome/Edge)'}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Transcribed text</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Your speech will appear here..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Or upload audio file</label>
            <input type="file" accept="audio/*" onChange={handleAudioUpload}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          </div>

          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={() => navigator.clipboard.writeText(text)} disabled={!text}
              className="btn btn-soft flex-1 py-2.5">
              <Copy size={14} /> Copy
            </button>
            <button type="button" onClick={() => { const b = new Blob([text], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'transcription.txt'; a.click(); URL.revokeObjectURL(u) }}
              className="btn btn-soft flex-1 py-2.5" disabled={!text}>
              <Download size={14} /> Download
            </button>
            <button type="button" onClick={() => setText('')} disabled={!text} className="btn btn-soft px-4 py-2.5">Clear</button>
          </div>

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Speech recognition uses the Web Speech API (Chrome/Edge only). Audio file transcription requires a backend service.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
