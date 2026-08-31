const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="24" viewBox="0 0 110 24" role="img" aria-label="Breeze"><rect width="110" height="24" rx="4" fill="#ffffff"/><text x="8" y="17" fill="#233849" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="-1.1">breeze.</text></svg>`;

// Self-contained wordmark: available to Railway without a Manus storage route.
export const BREEZE_WORDMARK_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(wordmarkSvg)}`;
