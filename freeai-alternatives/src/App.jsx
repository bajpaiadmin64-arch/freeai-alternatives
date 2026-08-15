import { useCallback, useState } from 'react'
import { PenLine } from 'lucide-react'
import Navbar from './components/Navbar'
import ContactPopup from './components/ContactPopup'
import WhatsAppButton from './components/WhatsAppButton'
import Hero from './components/Hero'
import WorkflowFinder from './components/WorkflowFinder'
import AiToolOrbitSection from './components/AiToolOrbitSection'
import Categories from './components/Categories'
import FeaturedSection from './components/FeaturedSection'
import AlternativeFinder from './components/AlternativeFinder'
import ToolGrid from './components/ToolGrid'
import CompareSection from './components/CompareSection'
import StudentSection from './components/StudentSection'
import OpenSourceSection from './components/OpenSourceSection'
import DonationSection from './components/DonationSection'
import AboutContact from './components/AboutContact'
import Footer from './components/Footer'
import { tools } from './data/tools'

function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const scrollToAlternatives = useCallback(() => {
    document.getElementById('alternatives')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSearch = useCallback(
    (q) => {
      setQuery(q)
      scrollToAlternatives()
    },
    [scrollToAlternatives],
  )

  const handleCategory = useCallback(
    (c) => {
      setCategory(c)
      scrollToAlternatives()
    },
    [scrollToAlternatives],
  )

  return (
    <div className="min-h-screen text-slate-900 antialiased dark:text-white">
      <Navbar />
      <ContactPopup />
      <WhatsAppButton />
      <div className="sticky top-16 z-40 border-b border-slate-200/60 bg-white/85 backdrop-blur-md dark:border-white/5 dark:bg-night-950/75">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">
          <PenLine size={14} className="shrink-0 text-brand-500" aria-hidden="true" />
          Designed &amp; Developed by{' '}
          <span className="font-bold text-brand-600 dark:text-brand-200">Utkarsh Bajpai</span>
        </p>
      </div>
      <main>
        <Hero onSearch={handleSearch} />
        <WorkflowFinder />
        <AiToolOrbitSection />

        <section id="search" className="mx-auto max-w-7xl px-4 sm:px-6">
          <Categories category={category} onCategoryChange={handleCategory} />
        </section>

        <FeaturedSection />
        <AlternativeFinder />

        <section id="alternatives" className="scroll-mt-20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">All 60 tools</p>
              <h2 className="section-title mt-3">
                Popular AI <span className="gradient-text">Alternatives</span>
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Every tool below offers legitimate free access, a free tier or open-source availability — with a direct link to its official website.
              </p>
            </div>
            <div className="mt-10">
              <ToolGrid
                tools={tools}
                query={query}
                onQueryChange={setQuery}
                category={category}
                onCategoryChange={setCategory}
              />
            </div>
          </div>
        </section>

        <CompareSection />
        <StudentSection />
        <OpenSourceSection />
        <DonationSection />
        <AboutContact />
      </main>
      <Footer />
    </div>
  )
}

export default Home
