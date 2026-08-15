export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  }
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`${sizes[size]} tile relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[62%] w-[62%]"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="14.5" stroke="#82BAC4" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="6" fill="#fff" />
          <circle cx="34.2" cy="13.8" r="3.4" fill="#E07A5F" />
          <circle cx="13.8" cy="13.8" r="3.4" fill="#fff" />
          <circle cx="13.8" cy="34.2" r="3.4" fill="#fff" />
          <circle cx="34.2" cy="34.2" r="3.4" fill="#fff" />
        </svg>
      </span>
      <span className="flex flex-col">
        <span className={`text-lg font-extrabold leading-tight tracking-tight ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          FreeAI
          <span className={light ? 'text-[#b5dbe3]' : 'gradient-text'}> Alternatives</span>
        </span>
      </span>
    </span>
  )
}
