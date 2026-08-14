/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('freeai-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  const [compareIds, setCompareIds] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('freeai-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id],
    )
  }

  const replaceCompare = (oldId, newId) => {
    setCompareIds((prev) => {
      const base = prev.length ? prev : ['gemini', 'deepseek', 'chatgpt']
      if (base.includes(newId)) return base
      return base.map((x) => (x === oldId ? newId : x))
    })
  }

  const clearCompare = () => setCompareIds([])

  return (
    <AppContext.Provider value={{ dark, setDark, compareIds, toggleCompare, replaceCompare, clearCompare }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}