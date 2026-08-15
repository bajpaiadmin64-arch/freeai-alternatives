import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

export default function TextToSpeech({ onBack }) {
  const [text, setText] = useState('')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const utterRef = useRef(null)

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices()
      setVoices(v)
      if (!selectedVoice && v.length) {
        const en = v.find((x) => x.lang.startsWith('en'))
        setSelectedVoice(en ? en.name : v[0].name)
      }
    }
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoice])

  const speak = () => {
    if (!text.trim()) return
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const v = voices.find((x) => x.name === selectedVoice)
    if (v) u.voice = v
    u.rate = rate
    u.pitch = pitch
    u.onend = () => { setSpeaking(false); setPaused(false) }
    utterRef.current = u
    speechSynthesis.speak(u)
    setSpeaking(true)
    setPaused(false)
  }

  const pause = () => { speechSynthesis.pause(); setPaused(true) }
  const resume = () => { speechSynthesis.resume(); setPaused(false) }
  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); setPaused(false) }

  const enVoices = voices.filter((v) => v.lang.startsWith('en'))
  const hiVoices = voices.filter((v) => v.lang.startsWith('hi'))
  const displayVoices = [...enVoices, ...hiVoices.filter((v) => !enVoices.includes(v))]

  return (
    <UtilityLayout name="Text to Speech" icon={({ size }) => <span style={{ fontSize: size }}>🔊</span>} onBack={onBack} description="Convert text to natural-sounding speech using your browser.">
      <div className="mx-auto max-w-lg">
        <div className="card p-6">
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Enter text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Type or paste text to read aloud..."
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Voice</label>
              <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
                {(displayVoices.length ? displayVoices : voices).map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Speed: {rate}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
          </div>
          <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Pitch: {pitch}</label>
          <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="mb-4 w-full accent-brand-500" />
          <div className="flex gap-2">
            {!speaking ? (
              <button type="button" onClick={speak} className="btn btn-primary flex-1 py-3" disabled={!text.trim()}>
                <Play size={15} /> Speak
              </button>
            ) : (
              <>
                <button type="button" onClick={paused ? resume : pause} className="btn btn-soft flex-1 py-3">
                  {paused ? <><Play size={15} /> Resume</> : <><Pause size={15} /> Pause</>}
                </button>
                <button type="button" onClick={stop} className="btn btn-soft px-4 py-3">
                  <Square size={15} />
                </button>
              </>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses the Web Speech API built into your browser. Voice availability varies by browser and OS.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
