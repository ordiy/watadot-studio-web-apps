import { useEffect, useState } from 'react'
import { WataDotMark } from './WataDotMark'

const NAV = [
  { href: '#foresight-agent', label: 'ForesightAgent' },
  { href: '#map-rag', label: 'MAP-RAG' },
  { href: '#blog', label: 'Blog' },
  { href: '#about', label: 'About' },
] as const

function NavLink({
  href,
  children,
  onNavigate,
}: {
  href: string
  children: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="text-neutral-800 relative inline-block py-1 text-[15px] font-medium tracking-tight transition-colors duration-200 hover:text-neutral-950"
    >
      <span className="relative z-10">{children}</span>
      <span
        className="bg-neutral-900 absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100"
        aria-hidden
      />
    </a>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="border-neutral-200/90 bg-white/85 supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label="Main"
      >
        <a
          href="#"
          className="text-neutral-950 group flex items-center gap-3 outline-offset-4"
        >
          <span className="ring-neutral-900/8 flex size-9 shrink-0 items-center justify-center rounded-lg ring-1">
            <WataDotMark className="size-7" animated />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Wata<span className="text-sky-600 font-semibold">Dot</span>
          </span>
        </a>

        <ul className="max-md:hidden flex items-center gap-10">
          {NAV.map(({ href, label }) => (
            <li key={href} className="group">
              <NavLink href={href}>{label}</NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="text-neutral-800 hover:bg-neutral-100 inline-flex size-10 items-center justify-center rounded-lg transition-colors md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            {open ? (
              <path
                strokeLinecap="round"
                d="M6 6l12 12M18 6L6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 bg-white transition-[opacity,visibility] duration-300 md:hidden ${
          open
            ? 'visible opacity-100'
            : 'invisible pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1 px-5 py-8 sm:px-8">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-neutral-900 hover:bg-neutral-50 block rounded-xl px-4 py-3.5 text-lg font-medium tracking-tight transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
