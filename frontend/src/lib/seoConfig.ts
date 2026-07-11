export const SITE_NAME = 'Get Production'

export const DEFAULT_SITE_URL =
  import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '') || 'https://getproview.vercel.app'

export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Get Production',
  description:
    'Professional photo and video studio in Addis Ababa, Ethiopia. Wedding, portrait, event, fashion, product photography and cinematic videography.',
  email: 'ameaxo@gmail.com',
  phone: '+251932717615',
  address: {
    street: 'Megenagna',
    locality: 'Addis Ababa',
    country: 'Ethiopia',
  },
  social: {
    tiktok: 'https://www.tiktok.com/@am68953',
  },
} as const

export const homeSeo = {
  title: `${SITE_NAME} | Photo & Video Studio in Addis Ababa`,
  description: BUSINESS.description,
  keywords:
    'photo studio Addis Ababa, videography Ethiopia, wedding photography, portrait photography, product photography, commercial video, Get Production',
  path: '/',
  ogType: 'website' as const,
}

export const adminSeo = {
  title: `Admin | ${SITE_NAME}`,
  description: 'Staff login for Get Production studio management.',
  path: '/admin',
  noindex: true,
}

export function absoluteUrl(path: string, siteUrl = DEFAULT_SITE_URL): string {
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalized}`
}
