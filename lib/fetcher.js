"use client";

/**
 * A robust fetch wrapper for API calls if needed (e.g., for Payment Webhooks or external APIs)
 */
export async function fetcher(url, options = {}) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
}
