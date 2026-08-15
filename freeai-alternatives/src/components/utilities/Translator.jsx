import { useState } from 'react'
import { Copy, ArrowRightLeft } from 'lucide-react'
import UtilityLayout from './UtilityLayout'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
]

const dictionary = {
  'hello': { hi: 'नमस्ते', es: 'hola', fr: 'bonjour', de: 'hallo', pt: 'olá', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ar: 'مرحبا' },
  'goodbye': { hi: 'अलविदा', es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', pt: 'adeus', ja: 'さようなら', ko: '안녕히 가세요', zh: '再见', ar: 'وداعا' },
  'thank you': { hi: 'धन्यवाद', es: 'gracias', fr: 'merci', de: 'danke', pt: 'obrigado', ja: 'ありがとう', ko: '감사합니다', zh: '谢谢', ar: 'شكرا' },
  'good morning': { hi: 'सुप्रभात', es: 'buenos días', fr: 'bonjour', de: 'guten morgen', pt: 'bom dia', ja: 'おはようございます', ko: '좋은 아침이에요', zh: '早上好', ar: 'صباح الخير' },
  'good night': { hi: 'शुभ रात्रि', es: 'buenas noches', fr: 'bonne nuit', de: 'gute nacht', pt: 'boa noite', ja: 'おやすみなさい', ko: '잘 자요', zh: '晚安', ar: 'تصبح على خير' },
  'how are you': { hi: 'आप कैसे हैं', es: '¿cómo estás?', fr: 'comment allez-vous?', de: 'wie geht es Ihnen?', pt: 'como vai?', ja: 'お元気ですか', ko: '어떻게 지내세요', zh: '你好吗', ar: 'كيف حالك' },
  'please': { hi: 'कृपया', es: 'por favor', fr: "s'il vous plaît", de: 'bitte', pt: 'por favor', ja: 'お願いします', ko: '제발', zh: '请', ar: 'من فضلك' },
  'yes': { hi: 'हाँ', es: 'sí', fr: 'oui', de: 'ja', pt: 'sim', ja: 'はい', ko: '네', zh: '是', ar: 'نعم' },
  'no': { hi: 'नहीं', es: 'no', fr: 'non', de: 'nein', pt: 'não', ja: 'いいえ', ko: '아니요', zh: '不', ar: 'لا' },
  'i love you': { hi: 'मैं तुमसे प्यार करता हूँ', es: 'te quiero', fr: 'je t\'aime', de: 'ich liebe dich', pt: 'eu te amo', ja: '愛しています', ko: '사랑해요', zh: '我爱你', ar: 'أحبك' },
  'welcome': { hi: 'स्वागत है', es: 'bienvenido', fr: 'bienvenue', de: 'willkommen', pt: 'bem-vindo', ja: 'ようこそ', ko: '환영합니다', zh: '欢迎', ar: 'أهلا وسهلا' },
  'sorry': { hi: 'माफ़ कीजिये', es: 'lo siento', fr: 'désolé', de: 'entschuldigung', pt: 'desculpe', ja: 'ごめんなさい', ko: '미안합니다', zh: '对不起', ar: 'آسف' },
  'friend': { hi: 'दोस्त', es: 'amigo', fr: 'ami', de: 'freund', pt: 'amigo', ja: '友達', ko: '친구', zh: '朋友', ar: 'صديق' },
  'water': { hi: 'पानी', es: 'agua', fr: 'eau', de: 'wasser', pt: 'água', ja: '水', ko: '물', zh: '水', ar: 'ماء' },
  'food': { hi: 'खाना', es: 'comida', fr: 'nourriture', de: 'essen', pt: 'comida', ja: '食べ物', ko: '음식', zh: '食物', ar: 'طعام' },
  'help': { hi: 'मदद', es: 'ayuda', fr: 'aide', de: 'hilfe', pt: 'ajuda', ja: '助けて', ko: '도움', zh: '帮助', ar: 'مساعدة' },
  'good': { hi: 'अच्छा', es: 'bueno', fr: 'bon', de: 'gut', pt: 'bom', ja: '良い', ko: '좋은', zh: '好', ar: 'جيد' },
  'bad': { hi: 'बुरा', es: 'malo', fr: 'mauvais', de: 'schlecht', pt: 'mau', ja: '悪い', ko: '나쁜', zh: '坏', ar: 'سيئ' },
  'today': { hi: 'आज', es: 'hoy', fr: "aujourd'hui", de: 'heute', pt: 'hoje', ja: '今日', ko: '오늘', zh: '今天', ar: 'اليوم' },
  'tomorrow': { hi: 'कल', es: 'mañana', fr: 'demain', de: 'morgen', pt: 'amanhã', ja: '明日', ko: '내일', zh: '明天', ar: 'غدا' },
}

function simpleTranslate(text, fromLang, toLang) {
  if (fromLang === toLang) return text
  const lower = text.toLowerCase().trim()
  if (dictionary[lower] && dictionary[lower][toLang]) return dictionary[lower][toLang]
  const words = lower.split(/\s+/)
  const translated = words.map((w) => dictionary[w]?.[toLang] || w)
  const result = translated.join(' ')
  if (result === lower) return `[Translation to ${languages.find((l) => l.code === toLang)?.label || toLang} not available in built-in dictionary. For full translation, an API integration is needed.]`
  return result
}

export default function Translator({ onBack }) {
  const [text, setText] = useState('')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('hi')
  const [result, setResult] = useState('')

  const translate = () => {
    if (!text.trim()) return
    setResult(simpleTranslate(text, from, to))
  }

  const swap = () => { setFrom(to); setTo(from); setResult('') }

  return (
    <UtilityLayout name="AI Translator" icon={({ size }) => <span style={{ fontSize: size }}>🌐</span>} onBack={onBack} description="Translate text between multiple languages.">
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
              {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button type="button" onClick={swap} className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10">
              <ArrowRightLeft size={18} />
            </button>
            <select value={to} onChange={(e) => setTo(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none dark:border-white/10 dark:bg-night-800 dark:text-white">
              {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Enter text to translate…"
            className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300/40 dark:border-white/10 dark:bg-night-800 dark:text-white" />

          <button type="button" onClick={translate} disabled={!text.trim()} className="btn btn-primary w-full py-3 mb-4">
            🌐 Translate
          </button>

          {result && (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Translation</p>
                <button type="button" onClick={() => navigator.clipboard.writeText(result)} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-500/20" title="Copy">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result}</p>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Uses a built-in dictionary for common words/phrases. Limited vocabulary — for full translation, a backend API (Google Translate, DeepL) is recommended.</p>
        </div>
      </div>
    </UtilityLayout>
  )
}
