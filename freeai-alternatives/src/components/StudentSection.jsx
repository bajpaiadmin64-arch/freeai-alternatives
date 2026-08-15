import { ArrowRight, BookOpen, Calculator, Code2, FileText, GraduationCap, PenLine, Presentation, StickyNote, Telescope } from 'lucide-react'
import { studentToolIds, tools } from '../data/tools'
import ToolCard from './ToolCard'

const useCases = [
  { icon: GraduationCap, label: 'Studying' },
  { icon: Telescope, label: 'Research' },
  { icon: FileText, label: 'Summarization' },
  { icon: StickyNote, label: 'Notes' },
  { icon: BookOpen, label: 'PDFs' },
  { icon: Code2, label: 'Coding' },
  { icon: Calculator, label: 'Mathematics' },
  { icon: PenLine, label: 'Writing' },
  { icon: Presentation, label: 'Presentations' },
]

export default function StudentSection() {
  const studentTools = studentToolIds.map((id) => tools.find((t) => t.id === id)).filter(Boolean)

  return (
    <section id="students" className="relative py-20">
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-gold-300/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Study on a budget</p>
          <h2 className="section-title mt-3">
            Free AI Tools <span className="gradient-text">for Students</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Study, research, summarize, solve math and write essays without paying — hand-picked free tools for students.
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {useCases.map((u) => (
            <li
              key={u.label}
              className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              <u.icon size={13} className="text-brand-500" />
              {u.label}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studentTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCompare={false} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#alternatives"
            className="btn btn-primary rounded-full px-7 py-3"
          >
            Explore Student Tools
            <ArrowRight size={16} />
          </a>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Students can also use the free tiers of Gemini, DeepSeek, Perplexity and Copilot for everyday study help.
          </p>
        </div>
      </div>
    </section>
  )
}
