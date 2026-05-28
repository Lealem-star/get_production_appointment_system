import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../assets/getpro.png'

const NAV_ITEMS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Contact' },
] as const

type SiteHeaderProps = {
  onSetAppointment: () => void
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className="header-nav-link font-sans text-sm font-medium tracking-wide">
      {label}
    </a>
  )
}

export default function SiteHeader({ onSetAppointment }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-[background,backdrop-filter,border-color,box-shadow] duration-300 ${scrolled ? 'site-header--scrolled' : 'site-header--top'}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logoSrc}
            alt="Get production"
            className="h-9 w-9 rounded-md object-cover ring-1 ring-[#C9A86A]/30 sm:h-10 sm:w-10"
          />
          <span className="hidden font-serif text-lg font-semibold leading-none tracking-tight text-header-ivory sm:block sm:text-xl">
            Get production
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-8 md:flex lg:gap-10"
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSetAppointment}
            className="hidden rounded-full border border-header-gold/45 bg-header-gold/10 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-header-ivory transition-all duration-300 hover:border-header-gold hover:bg-header-gold/20 hover:text-header-gold sm:inline-flex sm:px-5 sm:text-xs"
          >
            Set Appointment
          </button>

          <button
            type="button"
            onClick={onSetAppointment}
            className="inline-flex rounded-full border border-header-gold/45 bg-header-gold/10 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-wide text-header-ivory transition-all duration-300 hover:border-header-gold hover:bg-header-gold/20 sm:hidden"
          >
            Book
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-header-ivory transition-colors duration-300 hover:bg-white/5 hover:text-header-gold md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-header-gold/20 bg-[rgba(15,15,15,0.92)] backdrop-blur-xl transition-[grid-template-rows,opacity] duration-300 md:hidden ${menuOpen ? 'grid grid-rows-[1fr] opacity-100' : 'pointer-events-none grid grid-rows-[0fr] opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        <nav className="overflow-hidden px-4 py-2" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="header-nav-link header-nav-link--stacked font-sans text-sm font-medium tracking-wide"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
