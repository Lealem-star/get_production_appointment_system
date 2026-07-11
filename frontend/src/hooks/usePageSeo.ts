import { useEffect } from 'react'
import { absoluteUrl, DEFAULT_SITE_URL } from '../lib/seoConfig'

type PageSeoOptions = {
  title: string
  description: string
  path?: string
  keywords?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  noindex?: boolean
  siteUrl?: string
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== 'content') element!.setAttribute(key, value)
    })
    document.head.appendChild(element)
  }
  if (attributes.content && element) element.setAttribute('content', attributes.content)
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export function usePageSeo({
  title,
  description,
  path = '/',
  keywords,
  ogType = 'website',
  ogImage = '/favicon.svg',
  noindex = false,
  siteUrl = DEFAULT_SITE_URL,
}: PageSeoOptions) {
  useEffect(() => {
    const canonical = absoluteUrl(path, siteUrl)
    const image = absoluteUrl(ogImage, siteUrl)
    const robots = noindex ? 'noindex, nofollow' : 'index, follow'

    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })

    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Get Production' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US' })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    upsertLink('canonical', canonical)
  }, [title, description, path, keywords, ogType, ogImage, noindex, siteUrl])
}
