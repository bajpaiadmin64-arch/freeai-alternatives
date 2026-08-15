export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  }
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`${sizes[size]} tile relative inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-[#a0522d] to-gold-500`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[62%] w-[62%]"
          aria-hidden="true"
        >
          <circle cx="13" cy="30" r="4" fill="#fff" />
          <circle cx="35" cy="30" r="4" fill="#fff" />
          <circle cx="24" cy="13" r="4" fill="#fff" />
          <path
            d="M13 30H35M24 17V26"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M37.5 3.5c.7 2.6 2.1 4 4.7 4.7-2.6.7-4 2.1-4.7 4.7-.7-2.6-2.1-4-4.7-4.7 2.6-.7 4-2.1 4.7-4.7Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="flex flex-col">
        <span className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
          FreeAI
          <span className="gradient-text"> Alternatives</span>
        </span>
      </span>
    </span>
  )
}
