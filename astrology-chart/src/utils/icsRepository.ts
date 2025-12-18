const RAW_BASE = 'https://raw.githubusercontent.com/jthora/planetaryAspectEventsCalendar/main'
const TREE_URL = 'https://api.github.com/repos/jthora/planetaryAspectEventsCalendar/git/trees/main?recursive=1'
const DEFAULT_MANIFEST_URL = '/calendar-manifest.json'
const STORAGE_KEY = 'cosmiccypher-ics-cache-v1'

export interface IcsIndexItem {
  path: string
  size?: number
  downloadUrl: string
  title?: string
}

export interface CachedIcsItem extends IcsIndexItem {
  downloadedAt: string
  content: string
}

type ManifestItem = {
  path: string
  size?: number
  downloadUrl?: string
  title?: string
  series?: string
  year?: string
}

function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    const { localStorage } = window
    const probeKey = `${STORAGE_KEY}-probe`
    localStorage.setItem(probeKey, '1')
    localStorage.removeItem(probeKey)
    return localStorage
  } catch (error) {
    console.warn('Local storage unavailable for ICS cache', error)
    return null
  }
}

function readCache(): Record<string, CachedIcsItem> {
  const storage = getStorage()
  if (!storage) return {}

  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, CachedIcsItem>
    return parsed ?? {}
  } catch (error) {
    console.warn('Failed to parse ICS cache', error)
    return {}
  }
}

function writeCache(cache: Record<string, CachedIcsItem>): void {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('Failed to write ICS cache', error)
  }
}

export function loadIcsCache(): Record<string, CachedIcsItem> {
  return readCache()
}

export function saveIcsCache(cache: Record<string, CachedIcsItem>): void {
  writeCache(cache)
}

export function removeCachedIcs(path: string): void {
  const cache = readCache()
  if (!cache[path]) return
  delete cache[path]
  writeCache(cache)
}

export function getCachedIcsList(): CachedIcsItem[] {
  return Object.values(readCache()).sort((a, b) => a.path.localeCompare(b.path))
}

export async function fetchIcsIndex(): Promise<IcsIndexItem[]> {
  const response = await fetch(TREE_URL, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to load ICS index (${response.status})`)
  }

  const payload = (await response.json()) as {
    tree?: Array<{ path: string; type: string; size?: number }>
  }

  const tree = payload.tree ?? []
  const items: IcsIndexItem[] = tree
    .filter(
      (node) =>
        node.type === 'blob' &&
        node.path.toLowerCase().endsWith('.ics') &&
        node.path.toLowerCase().startsWith('calendars/')
    )
    .map((node) => ({
      path: node.path,
      size: node.size,
      downloadUrl: `${RAW_BASE}/${encodePath(node.path)}`,
      title: humanizeTitle(node.path)
    }))
    .sort((a, b) => a.path.localeCompare(b.path))

  return items
}

async function fetchManifest(manifestUrl: string): Promise<IcsIndexItem[]> {
  const response = await fetch(manifestUrl, {
    headers: {
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Manifest fetch failed (${response.status})`)
  }

  const payload = (await response.json()) as {
    items?: ManifestItem[]
  }

  const items = (payload.items ?? [])
    .filter((item) =>
      item.path.toLowerCase().endsWith('.ics') && item.path.toLowerCase().startsWith('calendars/')
    )
    .map((item) => ({
      path: item.path,
      size: item.size,
      downloadUrl: item.downloadUrl ?? `${RAW_BASE}/${encodePath(item.path)}`,
      title: item.title ?? humanizeTitle(item.path)
    }))

  return items.sort((a, b) => a.path.localeCompare(b.path))
}

export async function fetchIcsIndexWithFallback(manifestUrl: string = DEFAULT_MANIFEST_URL): Promise<IcsIndexItem[]> {
  try {
    const manifestItems = await fetchManifest(manifestUrl)
    if (manifestItems.length > 0) return manifestItems
  } catch (error) {
    console.warn('Manifest fetch failed, falling back to GitHub tree API', error)
  }

  return fetchIcsIndex()
}

async function fetchIcsContent(item: IcsIndexItem): Promise<string> {
  const response = await fetch(item.downloadUrl)
  if (!response.ok) {
    throw new Error(`Failed to download ${item.path} (${response.status})`)
  }

  return response.text()
}

function triggerDownload(path: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = path.split('/').pop() ?? 'calendar.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function humanizeTitle(path: string): string {
  const file = path.split('/').pop() ?? path
  const spaceForce = file.match(/space[_-]?force[_-]?astrology[_-]?(\d{4})/i)
  if (spaceForce) return `Space Force Astrology ${spaceForce[1]} Calendar`

  const business = file.match(/business[_-]?astrology[_-]?(\d{4})/i)
  if (business) return `Business Astrology ${business[1]} Calendar`

  const standard = file.match(/standard[_-]?astrology[_-]?(\d{4})/i)
  if (standard) return `Standard Astrology ${standard[1]} Calendar`

  const year = file.match(/(20\d{2})/)
  if (year) return `Calendar ${year[1]}`

  return 'Calendar File'
}

export async function fetchAndCacheIcs(item: IcsIndexItem): Promise<CachedIcsItem> {
  const content = await fetchIcsContent(item)
  const record: CachedIcsItem = {
    ...item,
    downloadedAt: new Date().toISOString(),
    content
  }

  const cache = readCache()
  cache[item.path] = record
  writeCache(cache)
  return record
}

export async function downloadIcs(
  item: IcsIndexItem,
  options: { cache?: boolean } = {}
): Promise<CachedIcsItem | void> {
  if (options.cache) {
    const record = await fetchAndCacheIcs(item)
    triggerDownload(item.path, record.content)
    return record
  }

  const content = await fetchIcsContent(item)
  triggerDownload(item.path, content)
}

export function downloadCachedIcs(item: CachedIcsItem): void {
  triggerDownload(item.path, item.content)
}

export function makeIcsBlob(item: CachedIcsItem): Blob {
  return new Blob([item.content], { type: 'text/calendar' })
}

export function formatBytes(bytes?: number): string {
  if (!bytes || Number.isNaN(bytes)) return 'Unknown size'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / Math.pow(1024, exponent)
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}
