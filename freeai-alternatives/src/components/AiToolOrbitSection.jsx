import AiToolOrbit from './AiToolOrbit'

export default function AiToolOrbitSection() {
  return (
    <section id="orbit" className="relative py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-300/15 via-gold-300/15 to-brand-400/15 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Explore the AI universe</p>
          <h2 className="section-title mt-3">
            🌐 AI Tool <span className="gradient-text">Orbit</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Spin the orbit to discover AI tools, tap one to inspect it, and compare or open it instantly.
          </p>
        </div>
        <div className="mt-10">
          <AiToolOrbit />
        </div>
      </div>
    </section>
  )
}