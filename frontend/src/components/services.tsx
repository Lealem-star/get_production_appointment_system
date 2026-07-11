import { motion } from 'framer-motion'
import { seoContent } from './servicesSeo'
import imgPortrait from '../assets/Portrait/look-studio-k7N9R_iYSkE-unsplash.jpg'
import imgLifestyle from '../assets/eventlifestyles/amy-vann-3NrS7gps6fM-unsplash.jpg'
import imgEventHero from '../assets/eventlifestyles/virginia-marinova-TjhNcyQ3--Q-unsplash.jpg'
import imgFashion from '../assets/fashioncommercial/angelo-pantazis-BIEaJ13iZrg-unsplash.jpg'
import imgProduct from '../assets/fashioncommercial/vitaly-gariev-aHcQk7dqVrI-unsplash.jpg'
import imgFood from '../assets/specializedphoto/mohamed-nohassi-4af_nc3jwIk-unsplash.jpg'
import imgStreet from '../assets/streeturban/alexander-kovalev-JMq8VHrmIY4-unsplash.jpg'
import imgLandscape from '../assets/landscapenature/april-vasquez-F6gpWb8ioy4-unsplash.jpg'
import imgFineArt from '../assets/fineartcreatives/aboodi-vesakaran-kfsEbvaaWbo-unsplash.jpg'
import imgBw from '../assets/editingcolor/peter-stumpf-Q2-OEzSZY94-unsplash.jpg'
import imgDrone from '../assets/landscapenature/karsten-wurth-XHl1gkHd6iM-unsplash.jpg'
import imgSports from '../assets/technicalshoot/bro-takes-photos-fu2XYXsA2sE-unsplash.jpg'
import imgCommercial from '../assets/fashioncommercial/mojtaba-fahiminia-CQzCMx_wvk4-unsplash.jpg'
import imgVideoEvent from '../assets/eventlifestyles/theo-kbsHCWI0pGo-unsplash.jpg'
import imgMusicVideo from '../assets/fineartcreatives/chaitanya-rayampally-t9qjqEmhO0M-unsplash.jpg'
import imgSocial from '../assets/editingcolor/eyestetix-studio-Jew0BcgpjJM-unsplash.jpg'
import imgDocumentary from '../assets/landscapenature/daniel-j-schwarz-jYGHS40LjT4-unsplash.jpg'
import imgReelA from '../assets/editingcolor/abin-james-x75kEKa6a0o-unsplash.jpg'
import imgReelB from '../assets/fineartcreatives/rodrigo-rodrigues-wolf-r-t-WXkiTTlJIfc-unsplash.jpg'
import imgReelC from '../assets/eventlifestyles/ben-iwara-LHhK4_d6Dxg-unsplash.jpg'

type CardSize = 'hero' | 'large' | 'medium' | 'small'

type ServiceItem = {
  title: string
  desc: string
  category: string
  image: string
  size: CardSize
  kind: 'photo' | 'video'
}

const sizeClasses: Record<CardSize, string> = {
  hero: 'min-h-[300px] sm:min-h-[380px] md:col-span-4 md:row-span-2',
  large: 'min-h-[240px] md:col-span-2 md:row-span-2',
  medium: 'min-h-[220px] md:col-span-2',
  small: 'min-h-[200px] md:col-span-1',
}

const photoServices: ServiceItem[] = [
  {
    title: 'Wedding & Event Cinematics',
    desc: 'Full-day coverage with emotional pacing, golden-hour portraits, and film-grade color.',
    category: 'Featured',
    image: imgEventHero,
    size: 'hero',
    kind: 'photo',
  },
  {
    title: 'Portrait',
    desc: 'Personality and emotion in every frame—studio or on location.',
    category: 'Photo',
    image: imgPortrait,
    size: 'large',
    kind: 'photo',
  },
  {
    title: 'Fashion',
    desc: 'Editorial energy for brands, models, and lookbooks.',
    category: 'Photo',
    image: imgFashion,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Food',
    desc: 'Texture, steam, and color that make every dish crave-worthy.',
    category: 'Photo',
    image: imgFood,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Landscape',
    desc: 'Cinematic horizons—rural light, wide vistas, and place.',
    category: 'Photo',
    image: imgLandscape,
    size: 'large',
    kind: 'photo',
  },
  {
    title: 'Lifestyle',
    desc: 'Candid, natural moments that feel like memory—not staging.',
    category: 'Photo',
    image: imgLifestyle,
    size: 'medium',
    kind: 'photo',
  },
  {
    title: 'Product',
    desc: 'Clean commercial visuals built for campaigns and e-commerce.',
    category: 'Photo',
    image: imgProduct,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Street',
    desc: 'Urban rhythm, contrast, and stories in passing light.',
    category: 'Photo',
    image: imgStreet,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Fine Art',
    desc: 'Conceptual frames with mood, metaphor, and intention.',
    category: 'Photo',
    image: imgFineArt,
    size: 'medium',
    kind: 'photo',
  },
  {
    title: 'Black & White',
    desc: 'Timeless monochrome—light, shadow, and form.',
    category: 'Photo',
    image: imgBw,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Aerial / Drone',
    desc: 'Sweeping perspectives from above with stable, cinematic motion.',
    category: 'Photo',
    image: imgDrone,
    size: 'small',
    kind: 'photo',
  },
  {
    title: 'Sports',
    desc: 'Peak action frozen mid-movement with crisp detail.',
    category: 'Photo',
    image: imgSports,
    size: 'medium',
    kind: 'photo',
  },
]

const videoServices: ServiceItem[] = [
  {
    title: 'Commercial',
    desc: 'Brand films and promos with polished narrative arcs.',
    category: 'Video',
    image: imgCommercial,
    size: 'large',
    kind: 'video',
  },
  {
    title: 'Event',
    desc: 'Weddings and celebrations edited with cinematic flow.',
    category: 'Video',
    image: imgVideoEvent,
    size: 'medium',
    kind: 'video',
  },
  {
    title: 'Music Video',
    desc: 'Artist stories told through rhythm, color, and motion.',
    category: 'Video',
    image: imgMusicVideo,
    size: 'small',
    kind: 'video',
  },
  {
    title: 'Social Media',
    desc: 'Short-form cuts optimized for scroll-stopping impact.',
    category: 'Video',
    image: imgSocial,
    size: 'small',
    kind: 'video',
  },
  {
    title: 'Documentary',
    desc: 'Real experiences captured with honesty and depth.',
    category: 'Video',
    image: imgDocumentary,
    size: 'medium',
    kind: 'video',
  },
]

const reelFrames = [imgReelA, imgReelB, imgReelC, imgCommercial, imgEventHero, imgPortrait]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceCard({ item, index }: { item: ServiceItem; index: number }) {
  const isHero = item.size === 'hero'

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg backdrop-blur-xl transition-shadow duration-500 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(255,200,80,0.15)] ${sizeClasses[item.size]}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
      <motion.div
        className={`absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/25 ${isHero ? 'via-black/65' : ''}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(212,175,55,0.12),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200/95 backdrop-blur-md sm:text-[11px]">
        {item.category}
      </span>

      <motion.div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end p-5 sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <motion.div>
            <h3
              className={`font-serif font-semibold leading-tight text-white ${isHero ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'}`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-2 font-medium leading-relaxed text-white/65 ${isHero ? 'max-w-xl text-sm sm:text-base' : 'text-xs sm:text-sm'}`}
            >
              {item.desc}
            </p>
          </motion.div>
          <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-amber-300/90 backdrop-blur-sm transition-colors group-hover:border-amber-400/50 group-hover:bg-amber-400/10 group-hover:text-amber-200">
            <ArrowIcon />
          </span>
        </div>
      </motion.div>
    </motion.article>
  )
}

type ServicesSectionProps = {
  onSetAppointment: () => void
}

export default function ServicesSection({ onSetAppointment }: ServicesSectionProps) {
  return (
    <div className="services-cinematic relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400/80">What we create</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Cinematic services
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-white/55 sm:text-base">
            Not a service list—a portfolio of moods. Each card is a frame from how we shoot: emotional,
            premium, and rooted in real light.
          </p>
        </motion.header>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">Photography</h3>
            <p className="mt-1 text-sm text-white/45">Asymmetric gallery · featured stories first</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">
          {photoServices.map((item, i) => (
            <ServiceCard key={item.title} item={item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mt-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30 py-3 backdrop-blur-md sm:mt-20"
        >
          <p className="mb-3 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Motion reel</p>
          <motion.div className="flex w-max gap-3 px-3 services-reel-track">
            {[...reelFrames, ...reelFrames].map((src, i) => (
              <div
                key={i}
                className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-32 sm:w-52"
              >
                <img src={src} alt="Motion reel preview" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <motion.div className="mb-6">
            <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">Videography</h3>
            <p className="mt-1 text-sm text-white/45">Film-forward production for brands and life events</p>
          </motion.div>

          <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">
            {videoServices.map((item, i) => (
              <ServiceCard key={item.title} item={item} index={i} />
            ))}
          </motion.div>
        </motion.div>

        <section
          aria-label="Studio services overview"
          className="mt-16 rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md sm:mt-20 sm:p-10"
        >
          <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">{seoContent.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">{seoContent.description}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {seoContent.sections.map((section) => (
              <article key={section.heading} className="rounded-xl border border-white/10 bg-white/3 p-5">
                <h4 className="font-serif text-lg font-semibold text-amber-100/95">{section.heading}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{section.text}</p>
              </article>
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative mt-16 overflow-hidden rounded-2xl border border-amber-400/20 bg-white/4 p-8 text-center backdrop-blur-xl sm:mt-20 sm:p-12"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-600/5 blur-3xl"
            aria-hidden
          />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400/90">Ready when you are</p>
          <h3 className="relative mt-3 font-serif text-2xl font-semibold text-white sm:text-3xl">
            Let&apos;s shape your next frame
          </h3>
          <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/55">
            Tell us your date, vision, and mood—we&apos;ll match you with the right crew and cinematic approach.
          </p>
          <button
            type="button"
            onClick={onSetAppointment}
            className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-6 py-3 text-sm font-bold uppercase tracking-wide text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-amber-400/20 hover:shadow-[0_0_32px_rgba(255,200,80,0.2)]"
          >
            Book a consultation
            <ArrowIcon />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

