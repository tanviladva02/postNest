/**
 * Centralized utility to get the absolute production site URL for canonical tags,
 * sitemaps, OpenGraph metadata, and Schema.org structured data.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;

  // In non-local environments, sanitize and ensure canonical https://www.postnest.in domain
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    let cleanUrl = envUrl.replace(/\/$/, '');
    
    // Normalize apex domain to www if needed
    if (cleanUrl === 'https://postnest.in' || cleanUrl === 'http://postnest.in') {
      return 'https://www.postnest.in';
    }
    return cleanUrl;
  }

  // Production fallback domain
  return 'https://www.postnest.in';
}

/**
 * Returns a fully-qualified canonical URL for any site path.
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
}
