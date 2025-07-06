/**
 * Convert a URL to a relative path if it's on the same host as the app URL
 */
export function relativeRoute(url: string): string {
    const base = window.location.origin;

    try {
        const parsed = new URL(url, base);
        const baseParsed = new URL(base);

        // If same host, return relative path
        if (parsed.host === baseParsed.host) {
            return parsed.pathname + parsed.search + parsed.hash;
        }

        // External URL, return as-is
        return url;
    } catch (error) {
        console.error(error);
        return url;
    }
}
