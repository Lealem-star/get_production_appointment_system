import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import profileSrc from '../assets/profile.png'

type AboutSectionProps = {
  onSetAppointment?: () => void
}

const STATS = [
  { value: '8+', label: 'years experience' },
  { value: '500+', label: 'projects delivered' },
  { value: '98%', label: 'satisfied clients' },
] as const

const FLOAT_TAGS = [
  {
    label: 'Photography',
    position: 'top-[8%] right-[4%] sm:right-[0%]',
    line: 'about-tag-line--top',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 7h4l2-3h4l2 3h4v12H4V7z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    label: 'Videography',
    position: 'top-[42%] -left-2 sm:left-0',
    line: 'about-tag-line--mid',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="6" width="14" height="12" rx="2" />
        <path d="M17 10l4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Creative branding',
    position: 'bottom-[10%] right-[2%] sm:right-[4%]',
    line: 'about-tag-line--bottom',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const

function FloatTag({
  label,
  position,
  line,
  icon,
  delay,
}: {
  label: string
  position: string
  line: string
  icon: ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={`about-float-tag absolute z-20 flex items-center gap-2.5 ${position}`}
    >
      <span className={`about-tag-connector pointer-events-none absolute ${line}`} aria-hidden />
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ethio-forest text-amber-200 shadow-md ring-2 ring-amber-400/30">
        {icon}
      </span>
      <span className="rounded-full border border-white/12 bg-black/50 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:text-sm">
        {label}
      </span>
    </motion.div>
  )
}

export default function AboutSection({ onSetAppointment }: AboutSectionProps) {
  return (
    <div className="services-cinematic about-hero relative w-full overflow-hidden">
      <div className="about-hero-glow pointer-events-none absolute right-0 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-y-1/2 translate-x-1/4 rounded-full bg-amber-500/10 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400/80">Who we are</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Let&apos;s work together to create wonders with us
            </h2>
            <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/55 sm:text-base">
              A photo and video studio rooted in warm, organic visuals and emotional pacing—turning real
              moments into cinematic frames for events, brands, and personal stories.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#contact"
                className="inline-flex rounded-full bg-header-gold/25 px-6 py-3 text-sm font-bold text-header-ivory ring-1 ring-header-gold/45 transition hover:bg-header-gold/35 hover:ring-header-gold"
              >
                Let&apos;s talk
              </a>
              {onSetAppointment ? (
                <button
                  type="button"
                  onClick={onSetAppointment}
                  className="inline-flex rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-amber-400/40 hover:bg-white/10"
                >
                  Start project
                </button>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-amber-400/40 hover:bg-white/10"
                >
                  Start project
                </a>
              )}
            </div>

            <ul className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 sm:gap-6">
              {STATS.map((stat, i) => (
                <motion.li
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                >
                  <p className="font-serif text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-white/40 sm:text-xs">{stat.label}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="about-portrait-wrap relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none lg:justify-self-end"
          >
            <div className="about-hero-rings pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <span className="about-ring about-ring--1" />
              <span className="about-ring about-ring--2" />
              <span className="about-ring about-ring--3" />
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] sm:max-w-[380px]">
              <img
                src={profileSrc}
                alt="Get production studio"
                className="relative z-10 h-full w-full object-cover object-top drop-shadow-2xl"
              />
            </div>

            {FLOAT_TAGS.map((tag, i) => (
              <FloatTag key={tag.label} {...tag} delay={0.2 + i * 0.1} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
