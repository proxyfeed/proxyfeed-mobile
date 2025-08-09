import { api } from './client'

export type FeedItem = {
  id: string
  slug: string | null
  originalUrl: string
  publicUrl: string | null
  fetchStatus: string | null
  lastFetchedAt: string | null
  lastUpdatedAt: string | null
}

export async function getFeeds(): Promise<FeedItem[]> {
  const res = await api.get<{ items: FeedItem[] }>('/api/feeds')
  return res.data.items || []
}

export async function refetchFeed(feedId: string): Promise<void> {
  await api.post(`/refetch/${encodeURIComponent(feedId)}`)
}

export async function logout(): Promise<void> {
  await api.get('/logout')
}
