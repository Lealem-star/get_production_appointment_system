import { getApiBaseUrl, resolveMediaUrl } from './mediaUrl'

export type PortfolioItem = {
  id: string
  title: string
  category: string
  imageUrl: string
}

type PublishedPostsResponse = {
  posts: Array<{
    id: string
    title: string
    category: string
    imageUrl?: string
    published: boolean
  }>
}

export async function fetchPublishedPortfolioItems(): Promise<PortfolioItem[]> {
  if (!getApiBaseUrl()) return []

  try {
    const response = await fetch(`${getApiBaseUrl()}/public/posts`)
    if (!response.ok) return []

    const payload = (await response.json()) as PublishedPostsResponse
    return (payload.posts ?? [])
      .filter((post) => post.imageUrl?.trim())
      .map((post) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        imageUrl: resolveMediaUrl(post.imageUrl!),
      }))
  } catch {
    return []
  }
}

export function buildFallbackPortfolioItems(
  images: string[],
  labels: string[] = [],
): PortfolioItem[] {
  return images.map((imageUrl, index) => ({
    id: `fallback-${index}`,
    title: labels[index] ?? 'Studio work',
    category: 'Portfolio',
    imageUrl,
  }))
}

export { resolveMediaUrl }
