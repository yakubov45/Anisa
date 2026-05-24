import { redis } from "./redis";

export async function rateLimit(request, options = {}) {
    const { 
        limit = 10,           // Max so'rovlar soni
        windowMs = 60 * 1000, // 1 daqiqa
        keyPrefix = "rl"      // Kalit prefiksi
    } = options;
    
    // IP olish (Vercel/Next.js da)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    
    const key = `${keyPrefix}:${ip}`;
    const windowSec = Math.floor(windowMs / 1000);
    
    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSec);
        }
        
        if (current > limit) {
            return { 
                limited: true, 
                response: new Response(
                    JSON.stringify({ error: "Too many requests. Please try again later." }),
                    { 
                        status: 429, 
                        headers: { 
                            "Content-Type": "application/json",
                            "Retry-After": String(windowSec),
                            "X-RateLimit-Limit": String(limit),
                            "X-RateLimit-Remaining": "0"
                        } 
                    }
                )
            };
        }
        
        return { limited: false, remaining: limit - current };
    } catch {
        // Redis ishlamasa ham sayt ishlashini davom ettiradi
        return { limited: false };
    }
}
