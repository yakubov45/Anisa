/**
 * Merges class names into a single string
 */
export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a number into currency string (e.g., UZS or USD)
 */
export function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);
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
