import { motion } from 'framer-motion'

type PortfolioSectionProps = {
  images: string[]
}

export default function PortfolioSection({ images }: PortfolioSectionProps) {
  return (
    <div className="services-cinematic relative w-full overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-14"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-400/80">Selected work</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-5xl">Portfolio</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-white/55 sm:text-base">
            Highlights of light, texture, and place—frames that show how we see your story.
          </p>
        </motion.header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.45 }}
              className="group overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 transition duration-300 hover:border-amber-400/40 hover:shadow-[0_0_28px_rgba(255,200,80,0.12)]"
            >
              <img
                src={src}
                alt={`Portfolio frame ${idx + 1}`}
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
