import { Suspense, lazy, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { utilities, utilityCategories, categoryOrder } from '../data/utilities'

const utilityComponents = {
  'text-summarizer': lazy(() => import('./utilities/TextSummarizer')),
  'writing-assistant': lazy(() => import('./utilities/WritingAssistant')),
  'translator': lazy(() => import('./utilities/Translator')),
  'pdf-summarizer': lazy(() => import('./utilities/PDFSummarizer')),
  'pdf-qa': lazy(() => import('./utilities/PDFQA')),
  'background-remover': lazy(() => import('./utilities/BackgroundRemover')),
  'image-compressor': lazy(() => import('./utilities/ImageCompressor')),
  'image-resizer': lazy(() => import('./utilities/ImageResizer')),
  'image-to-text': lazy(() => import('./utilities/ImageToText')),
  'text-to-speech': lazy(() => import('./utilities/TextToSpeech')),
  'speech-to-text': lazy(() => import('./utilities/SpeechToText')),
  'calculator': lazy(() => import('./utilities/Calculator')),
  'percentage-calculator': lazy(() => import('./utilities/PercentageCalculator')),
  'number-to-words': lazy(() => import('./utilities/NumberToWords')),
  'qr-generator': lazy(() => import('./utilities/QRCodeGenerator')),
  'password-generator': lazy(() => import('./utilities/PasswordGenerator')),
  'word-counter': lazy(() => import('./utilities/WordCounter')),
  'color-picker': lazy(() => import('./utilities/ColorPicker')),
  'unit-converter': lazy(() => import('./utilities/UnitConverter')),
  'ai-workspace': lazy(() => import('./utilities/AIWorkspace')),
}

export default function UtilitiesSection() {
  const [activeUtility, setActiveUtility] = useState(null)

  const grouped = useMemo(() => {
    const map = {}
    for (const cat of categoryOrder) map[cat] = utilities.filter((u) => u.category === cat)
    return map
  }, [])

  if (activeUtility) {
    const util = utilities.find((u) => u.id === activeUtility)
    if (!util) return null
    const Comp = utilityComponents[activeUtility]
    return (
      <section id="utilities" className="scroll-mt-20 py-16">
        <Suspense
          fallback={
            <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading utility…</p>
            </div>
          }
        >
          <Comp onBack={() => setActiveUtility(null)} />
        </Suspense>
      </section>
    )
  }

  return (
    <section id="utilities" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Free AI Utilities</p>
          <h2 className="section-title mt-3">
            Use AI Tools <span className="gradient-text">Directly Here</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Useful AI-powered tools you can use directly here — no need to visit another website.
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Free for everyone, by Utkarsh Bajpai.
          </p>
        </div>

        {categoryOrder.map((catId) => {
          const cat = utilityCategories.find((c) => c.id === catId)
          const items = grouped[catId]
          if (!items?.length) return null
          return (
            <div key={catId} className="mt-12">
              <h3 className="mb-5 text-lg font-bold text-slate-800 dark:text-white">
                <span className="mr-2" aria-hidden="true">{cat?.emoji}</span>
                {cat?.label}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((util) => (
                  <article
                    key={util.id}
                    className="card card-hover group relative flex flex-col p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="tile flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
                        <span className="text-lg" aria-hidden="true">
                          {cat?.emoji || '🔧'}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{util.name}</h4>
                        {util.isAI && (
                          <span className="mt-0.5 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                            AI Tool
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {util.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveUtility(util.id)}
                      className="btn btn-primary mt-4 w-full py-2.5"
                    >
                      Use Now
                      <ArrowRight size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )
        })}

        <div className="mt-16 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-center dark:border-brand-500/20 dark:bg-brand-500/5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            All utilities in this section are provided free for everyone by Utkarsh Bajpai.
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            No subscription required for the free utilities. Some AI features use client-side processing with honest limitation notices.
          </p>
        </div>
      </div>
    </section>
  )
}
