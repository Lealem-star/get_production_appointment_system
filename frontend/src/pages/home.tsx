import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AppointmentOverlay from '../components/AppointmentOverlay'
import SiteHeader from '../components/SiteHeader'
import AboutSection from '../components/about'
import ServicesSection from '../components/services'
import PortfolioSection from '../components/portfolio'
import ContactSection from '../components/contact'
import logoSrc from '../assets/getpro.png'
import heroVideoSrc from '../assets/getpro.mp4'
import heroPosterSrc from '../assets/cameraman.jpg'
import cubeEditingColor from '../assets/editingcolor/abin-james-x75kEKa6a0o-unsplash.jpg'
import cubeEventLifestyle from '../assets/eventlifestyles/amy-vann-3NrS7gps6fM-unsplash.jpg'
import cubeFashionCommercial from '../assets/fashioncommercial/angelo-pantazis-BIEaJ13iZrg-unsplash.jpg'
import cubeFineArt from '../assets/fineartcreatives/aboodi-vesakaran-kfsEbvaaWbo-unsplash.jpg'
import cubeLandscape from '../assets/landscapenature/april-vasquez-F6gpWb8ioy4-unsplash.jpg'

const cubeImages: [string, string, string, string, string, string] = [
  logoSrc,
  cubeEditingColor,
  cubeEventLifestyle,
  cubeFashionCommercial,
  cubeFineArt,
  cubeLandscape,
]

const HERO_COPY = {
  en: {
    title: 'Creating Timeless Frames',
    description:
      'We craft photo and video with an earthy, human-centered eye—where cultural storytelling, documentary truth, and a modern cinematic finish meet. From events to branded work, your story stays authentic on screen.',
  },
  am: {
    title: 'ዘላለማዊ ትዝታዎችን እንፈጥራለን',
    description:
      'ባህልን የሚያከብር፣ ሰውን ማዕከል ያደረገ እይታ ያለው የፎቶና ቪዲዮ ስራ እንሰራለን። ከባህላዊ ተረክ እና ከእውነተኛ ዶክመንተሪ ቅርፅ ጋር ዘመናዊ የሲኒማ ጥራትን በማዋሃድ፣ ከዝግጅቶች እስከ የብራንድ ፕሮጀክቶች ድረስ ታሪክዎ በእውነተኛነት እንዲታይ እናደርጋለን።',
  },
} as const

type HeroLang = keyof typeof HERO_COPY

export default function HomePage() {
  const [appointmentOpen, setAppointmentOpen] = useState(false)
  const [heroLang, setHeroLang] = useState<HeroLang>('am')

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroLang((current) => (current === 'en' ? 'am' : 'en'))
    }, 15000)

    return () => window.clearInterval(intervalId)
  }, [])

  const heroCopy = HERO_COPY[heroLang]

  return (
    <div className="min-h-dvh bg-[#0b0b0b] text-ethio-ink">
      <SiteHeader onSetAppointment={() => setAppointmentOpen(true)} />

      <section
        id="home"
        aria-label="Hero"
        className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPosterSrc}
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
          aria-hidden
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>

        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-ethio-overlay/75 via-ethio-overlay/45 to-ethio-overlay/80"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-24 text-center sm:px-10 sm:py-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroLang}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              lang={heroLang === 'am' ? 'am' : 'en'}
            >
              <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight drop-shadow-md sm:text-5xl lg:text-6xl">
                <span className="bg-linear-to-r from-ethio-sun via-ethio-gold-mist to-ethio-gold-bright bg-clip-text text-transparent">
                  {heroCopy.title}
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-4xl text-sm font-semibold leading-relaxed text-ethio-sun/90 drop-shadow-sm sm:mt-6 sm:text-base lg:text-lg">
                {heroCopy.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="about">
        <AboutSection onSetAppointment={() => setAppointmentOpen(true)} />
      </section>

      <section id="services">
        <ServicesSection onSetAppointment={() => setAppointmentOpen(true)} />
      </section>

      <section id="portfolio">
        <PortfolioSection images={cubeImages} />
      </section>

      <ContactSection onSetAppointment={() => setAppointmentOpen(true)} />

      <footer className="border-t border-white/10 bg-[#0b0b0b] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
            <a
              href="#home"
              className="rounded-full px-4 py-2 text-header-ivory/80 transition duration-300 hover:bg-white/5 hover:text-header-gold"
            >
              Home
            </a>
            <a
              href="#portfolio"
              className="rounded-full px-4 py-2 text-header-ivory/80 transition duration-300 hover:bg-white/5 hover:text-header-gold"
            >
              Portfolio
            </a>
            <a
              href="#services"
              className="rounded-full px-4 py-2 text-header-ivory/80 transition duration-300 hover:bg-white/5 hover:text-header-gold"
            >
              Services
            </a>
            <a
              href="#about"
              className="rounded-full px-4 py-2 text-header-ivory/80 transition duration-300 hover:bg-white/5 hover:text-header-gold"
            >
              About
            </a>
            <a
              href="#contact"
              className="rounded-full px-4 py-2 text-header-ivory/80 transition duration-300 hover:bg-white/5 hover:text-header-gold"
            >
              Contact
            </a>
          </nav>

          <a
            href="https://t.me/thebaseoftheworld"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-end rounded-full border border-header-gold/40 bg-header-gold/10 px-5 py-2.5 text-xs font-bold tracking-wide text-header-ivory transition duration-300 hover:border-header-gold hover:bg-header-gold/20 hover:text-header-gold sm:self-auto sm:text-sm"
          >
            Built by Lealem Meseret
          </a>
        </div>
      </footer>

      <AppointmentOverlay open={appointmentOpen} onClose={() => setAppointmentOpen(false)} />
    </div>
  )
}
