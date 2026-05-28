import { Link } from 'react-router-dom'
import logoSrc from '../../assets/getpro.png'

const LANDING_FEATURES = [
  {
    title: 'Appointments',
    desc: 'Review, approve, and track every client booking in one place.',
    icon: '◷',
  },
  {
    title: 'Team & roles',
    desc: 'Manage admin and staff access with clear permission levels.',
    icon: '◎',
  },
  {
    title: 'Portfolio & posts',
    desc: 'Publish work, update categories, and keep the site current.',
    icon: '✎',
  },
  {
    title: 'Studio overview',
    desc: 'Dashboard metrics for pending requests, users, and live content.',
    icon: '▦',
  },
] as const

export type AdminLandingCredentials = { email: string; password: string }

type AdminLandingProps = {
  credentials: AdminLandingCredentials
  onCredentialsChange: (next: AdminLandingCredentials) => void
  authError: string
  onLogin: () => void
}

function AdminLoginCard({
  credentials,
  onCredentialsChange,
  authError,
  onLogin,
}: AdminLandingProps) {
  return (
    <div
      id="admin-sign-in"
      className="admin-card w-full overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="border-b border-white/10 bg-linear-to-br from-[#1a1612] via-[#12100e] to-[#0a0a0a] px-6 py-7 text-center sm:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-header-gold/90">Secure access</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-header-ivory sm:text-3xl">Sign in</h2>
        <p className="mt-2 text-sm text-header-ivory/55">Use your studio credentials to open the dashboard.</p>
      </div>

      <form
        className="space-y-4 px-6 py-6 sm:px-8"
        onSubmit={(event) => {
          event.preventDefault()
          onLogin()
        }}
      >
        <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wide text-header-ivory/70">
          Email
          <input
            id="admin-email"
            type="email"
            value={credentials.email}
            onChange={(event) => onCredentialsChange({ ...credentials, email: event.target.value })}
            className="admin-input mt-1.5"
            placeholder="admin@studio.com"
            autoComplete="username"
          />
        </label>
        <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wide text-header-ivory/70">
          Password
          <input
            id="admin-password"
            type="password"
            value={credentials.password}
            onChange={(event) => onCredentialsChange({ ...credentials, password: event.target.value })}
            className="admin-input mt-1.5"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        {authError ? (
          <p className="rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            {authError}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-xl bg-header-gold/20 py-3 text-sm font-bold uppercase tracking-wide text-header-ivory ring-1 ring-header-gold/40 transition hover:bg-header-gold/30"
        >
          Sign in to dashboard
        </button>
      </form>

      <div className="border-t border-white/8 bg-black/20 px-6 py-4 sm:px-8">
        <p className="text-center text-[11px] leading-relaxed text-header-ivory/45">Authorized users only.</p>
      </div>
    </div>
  )
}

export default function AdminLanding(props: AdminLandingProps) {
  return (
    <div className="admin-shell relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-header-gold/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-ethio-forest/15 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Get production"
              className="h-10 w-10 rounded-lg object-cover ring-1 ring-header-gold/30"
            />
            <div className="leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-header-gold/80">Get production</p>
              <p className="font-serif text-lg font-semibold text-header-ivory">Studio portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-header-ivory/70 transition hover:bg-white/5 hover:text-header-ivory sm:inline-flex"
            >
              Public site
            </Link>
            <a
              href="#admin-sign-in"
              className="rounded-lg bg-header-gold/15 px-3 py-2 text-xs font-bold uppercase tracking-wide text-header-gold ring-1 ring-header-gold/35 transition hover:bg-header-gold/25 sm:px-4"
            >
              Sign in
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12 lg:py-14">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-header-gold/90">Internal workspace</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-header-ivory sm:text-5xl lg:text-[3.25rem]">
            Run your studio
            <span className="block text-header-gold/90">from one place.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-header-ivory/55 sm:text-lg">
            The Get production admin portal keeps bookings, team access, and portfolio content organized—so
            you can focus on shoots, not spreadsheets.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {LANDING_FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="admin-card flex gap-3 rounded-xl p-4 transition hover:border-header-gold/25"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-header-gold/10 text-sm text-header-gold"
                  aria-hidden
                >
                  {feature.icon}
                </span>
                <div>
                  <p className="font-semibold text-header-ivory">{feature.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-header-ivory/50">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/8 pt-8">
            <div>
              <p className="font-serif text-2xl font-semibold text-header-ivory">24/7</p>
              <p className="text-xs text-header-ivory/45">Portal access for your team</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-header-ivory">4</p>
              <p className="text-xs text-header-ivory/45">Core modules in one dashboard</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-header-ivory">Secure</p>
              <p className="text-xs text-header-ivory/45">Role-based admin & staff login</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col lg:sticky lg:top-8">
          <AdminLoginCard {...props} />
          <Link
            to="/"
            className="mt-4 block text-center text-xs font-semibold text-header-gold/80 transition hover:text-header-ivory"
          >
            ← Back to website
          </Link>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/8 px-4 py-5 text-center sm:px-6">
        <p className="text-[11px] text-header-ivory/35">
          © {new Date().getFullYear()} Get production · Authorized personnel only
        </p>
      </footer>
    </div>
  )
}
