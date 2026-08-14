import { Cpu, GitFork, Terminal } from 'lucide-react'
import { tools } from '../data/tools'
import ToolCard from './ToolCard'

const pillars = [
  {
    icon: Cpu,
    title: 'Run it locally',
    text: 'Ollama, LM Studio, GPT4All and Jan let you chat with open models on your own computer — private, offline and truly unlimited.',
  },
  {
    icon: GitFork,
    title: 'Open source, not freeware',
    text: 'Open source means the code is public and auditable. A free commercial service is different — we label each card honestly.',
  },
  {
    icon: Terminal,
    title: 'Bring your own model',
    text: 'Cline, Continue, Aider and Zed are free forever — you supply your own API key or plug in a free local model.',
  },
]

export default function OpenSourceSection() {
  const openSourceTools = tools.filter((t) => t.openSource)

  return (
    <section id="open-source" className="relative py-20">
      <div className="pointer-events-none absolute left-0 top-10 h-64 w-64 rounded-full bg-brand-300/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Free forever</p>
          <h2 className="section-title mt-3">
            Open-<span className="gradient-text">Source AI</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Run AI locally or explore open models without paying for a premium chatbot subscription.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card card-hover p-5">
              <span className="tile inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 dark:from-brand-500/20 dark:to-brand-500/10 dark:text-brand-300">
                <p.icon size={20} />
              </span>
              <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {openSourceTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCompare={false} />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-400 dark:text-slate-500">
          Open weights and open source are not the same as free commercial services. DeepSeek, Qwen and Meta offer open-weight models, but their chat apps are free commercial services — their cards say so.
        </p>
      </div>
    </section>
  )
}
