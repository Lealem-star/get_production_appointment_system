import { absoluteUrl, BUSINESS, DEFAULT_SITE_URL } from '../lib/seoConfig'

type LocalBusinessJsonLdProps = {
  siteUrl?: string
}

export default function LocalBusinessJsonLd({ siteUrl = DEFAULT_SITE_URL }: LocalBusinessJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteUrl('/', siteUrl),
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: absoluteUrl('/', siteUrl),
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    image: absoluteUrl('/favicon.svg', siteUrl),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: {
      '@type': 'City',
      name: BUSINESS.address.locality,
    },
    sameAs: [BUSINESS.social.tiktok],
    priceRange: '$$',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
