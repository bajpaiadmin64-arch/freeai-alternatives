import { Clapperboard, Code2, GitFork, Image as ImageIcon, LayoutGrid, MessageSquare, PenLine, Telescope, Zap } from 'lucide-react'
import { categories } from '../data/tools'

const iconMap = {
  LayoutGrid,
  MessageSquare,
  Code2,
  Telescope,
  PenLine,
  ImageIcon,
  Clapperboard,
  Zap,
}

export default function Categories({ category, onCategoryChange }) {
  const chips = [...categories, { id: 'opensource', label: 'Open Source', icon: 'GitFork' }]

  return (
    <section id="categories" className="py-10">
      <h2 className="sr-only">Categories</h2>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {chips.map((c) => {
          const Icon = c.icon === 'GitFork' ? GitFork : iconMap[c.icon] || LayoutGrid
          const active = category === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategoryChange(c.id)}
              className={`chip ${active ? 'chip-active' : ''}`}
              aria-pressed={active}
            >
              <Icon size={15} />
              {c.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
