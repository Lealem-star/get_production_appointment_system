import { motion } from 'framer-motion'
import { useState, type FormEvent, type ReactNode } from 'react'

type ContactSectionProps = {
  onSetAppointment?: () => void
}

const CONTACT = {
  address: 'Addis Ababa, Ethiopia',
  email: 'hello@getproduction.studio',
  phone: '+251 932 717 615',
  phoneHref: 'tel:+251932717615',
  mailto: 'mailto:hello@getproduction.studio',
} as const

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.2c2.7 0 3 .01 4.04.06 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.05 1.04.06 1.34.06 4.04s-.01 3-.06 4.04c-.05 1.17-.24 1.8-.4 2.22a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.05.35-2.22.4-1.04.05-1.34.06-4.04.06s-3-.01-4.04-.06c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.04c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4C9 2.21 9.3 2.2 12 2.2Zm0 1.8c-2.66 0-2.97.01-4.01.06-.98.04-1.52.2-1.87.33-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.13.35-.29.89-.33 1.87-.05 1.04-.06 1.35-.06 4.01s.01 2.97.06 4.01c.04.98.2 1.52.33 1.87.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.13.89.29 1.87.33 1.04.05 1.35.06 4.01.06s2.97-.01 4.01-.06c.98-.04 1.52-.2 1.87-.33.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.13-.35.29-.89.33-1.87.05-1.04.06-1.35.06-4.01s-.01-2.97-.06-4.01c-.04-.98-.2-1.52-.33-1.87a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.13-.89-.29-1.87-.33-1.04-.05-1.35-.06-4.01-.06ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5.25-2.82a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.3V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.13 11.9v-8.41H7.08v-3.5h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79v8.41C19.61 23.09 24 18.09 24 12.07Z" />
      </svg>
    ),
  },
] as const

function PinIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
    </svg>
  )
}

type ContactDetailProps = {
  icon: ReactNode
  label: string
  children: ReactNode
}

function ContactDetail({ icon, label, children }: ContactDetailProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <div className="mt-1 text-sm text-white/55">{children}</div>
      </div>
    </div>
  )
}

export default function ContactSection({ onSetAppointment }: ContactSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // If backend isn't configured, keep the optimistic flow.
    if (!apiBaseUrl) {
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(`${apiBaseUrl}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, details }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setSubmitted(true)
    } catch {
      setSubmitError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact-section relative w-full overflow-hidden">
      <div className="contact-section-glow pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />
      <div className="contact-section-glow pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Contact Us
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
              Tell us about your shoot, event, or brand project—we&apos;ll reply with availability and next steps.
            </p>

            <div className="mt-10 space-y-8">
              <ContactDetail icon={<PinIcon />} label="Address">
                {CONTACT.address}
              </ContactDetail>
              <ContactDetail icon={<MailIcon />} label="Email">
                <a href={CONTACT.mailto} className="transition hover:text-amber-300">
                  {CONTACT.email}
                </a>
              </ContactDetail>
              <ContactDetail icon={<PhoneIcon />} label="Phone">
                <a href={CONTACT.phoneHref} className="transition hover:text-amber-300">
                  {CONTACT.phone}
                </a>
              </ContactDetail>
            </div>

            <div className="contact-book-card mt-12 rounded-2xl border border-white/8 bg-[#0c1228]/80 p-6 backdrop-blur-sm sm:p-7">
              <p className="text-sm font-bold text-amber-400">Book your session:</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Prefer a guided booking? Open our appointment flow for date, location, and project type.
              </p>
              {onSetAppointment ? (
                <button
                  type="button"
                  onClick={onSetAppointment}
                  className="mt-5 w-full rounded-xl border border-amber-400/35 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-100 transition hover:border-amber-300/50 hover:bg-amber-400/20 sm:w-auto sm:px-6"
                >
                  Set appointment
                </button>
              ) : (
                <a
                  href={CONTACT.phoneHref}
                  className="mt-5 inline-flex rounded-xl border border-amber-400/35 bg-amber-400/10 px-6 py-3 text-sm font-bold text-amber-100 transition hover:border-amber-300/50 hover:bg-amber-400/20"
                >
                  Call to book
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="contact-form-card rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10"
          >
            <h3 className="text-xl font-bold text-white sm:text-2xl">Contact Us</h3>

            <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
              <label className="contact-field block">
                <span className="text-sm font-semibold text-white">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="contact-field-input mt-2 w-full"
                />
              </label>

              <label className="contact-field block">
                <span className="text-sm font-semibold text-white">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="contact-field-input mt-2 w-full"
                />
              </label>

              <label className="contact-field block">
                <span className="text-sm font-semibold text-white">Details</span>
                <textarea
                  name="details"
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter your project details"
                  className="contact-field-input contact-field-textarea mt-2 w-full resize-none"
                />
              </label>

              {submitted ? (
                <p className="text-sm text-emerald-300/90">
                  Opening your email client—thank you. We&apos;ll get back to you soon.
                </p>
              ) : null}

              {submitError && !submitted ? (
                <p className="text-sm text-rose-200">{submitError}</p>
              ) : null}

              <button type="submit" className="contact-submit-btn" disabled={submitting}>
                Send message
              </button>
            </form>

            <div className="mt-10 flex items-center gap-4 border-t border-white/8 pt-8">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="text-amber-400 transition hover:text-amber-300 hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
