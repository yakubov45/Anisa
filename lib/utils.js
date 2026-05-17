/**
 * Merges class names into a single string
 */
export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a number into currency string (e.g., UZS or USD)
 * Uses locale-independent formatting for UZS to prevent SSR/client hydration mismatch.
 */
export function formatPrice(price, currency = 'USD', exchangeRate = 12800) {
    const val = Number(price);
    if (isNaN(val)) return currency === 'UZS' ? 'UZS 0' : '$0.00';

    // Auto-detect if database price is in UZS (e.g. 8,500,000) or USD (e.g. 3,499)
    const isDbPriceInUZS = val > 100000;

    if (currency === 'UZS') {
        const uzsValue = isDbPriceInUZS ? val : val * exchangeRate;
        const formatted = Math.round(uzsValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${formatted} UZS`;
    } else {
        const usdValue = isDbPriceInUZS ? val / exchangeRate : val;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(usdValue);
    }
}


/**
 * Standard date formatting
 */
export function formatDate(date) {
    if (!date) return '';
    let d;
    if (date.toDate && typeof date.toDate === 'function') {
        d = date.toDate();
    } else if (date.seconds) {
        d = new Date(date.seconds * 1000);
    } else {
        d = new Date(date);
    }
    
    return d.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Slugify a string
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}
