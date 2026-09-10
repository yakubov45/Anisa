'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden rounded-3xl bg-surface-100 flex flex-col md:flex-row">
      {/* Mobile Image (shows on top for mobile, hidden on desktop layout below) */}
      <div className="relative w-full aspect-[16/9] md:hidden rounded-t-3xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85"
          alt="Premium kitchenware setup"
          fill
          className="object-cover"
        />
      </div>

      {/* Left Content */}
      <div className="flex flex-col justify-center w-full md:w-[55%] px-10 md:px-16 py-12 md:py-20 z-10">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 px-4 py-1.5 rounded-full text-primary text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Premium Kitchenware
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
            Elevate Your <br className="hidden md:block" />
            <span className="text-accent">Culinary</span> <br className="hidden md:block" />
            Experience
          </h1>
          
          <p className="text-muted text-base md:text-lg max-w-lg leading-relaxed mt-6 mx-auto md:mx-0">
            Discover our curated collection of premium cookware, artisan knives, and elegant tableware — crafted for those who believe great meals begin with exceptional tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8">
            <Link href="/catalog" className="btn-sage px-8 py-3.5 text-sm inline-flex items-center gap-2 w-full sm:w-auto justify-center">
              Explore Catalog
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/collections" className="btn-outlined px-8 py-3.5 text-sm w-full sm:w-auto text-center flex justify-center">
              Shop Collections
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-8 mt-10">
            <div className="text-muted text-sm font-medium flex items-center gap-2">
              <span className="text-primary font-bold">✓</span> Free Shipping Over $99
            </div>
            <div className="text-muted text-sm font-medium flex items-center gap-2">
              <span className="text-primary font-bold">✓</span> 30-Day Returns
            </div>
            <div className="text-muted text-sm font-medium flex items-center gap-2">
              <span className="text-primary font-bold">✓</span> Premium Quality
            </div>
          </div>
        </div>
      </div>

      {/* Right Image (Desktop) */}
      <div className="hidden md:block relative md:w-[45%] min-h-[300px] md:min-h-[500px]">
        {/* Gradient overlay to blend with left content */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-100 to-transparent z-10 pointer-events-none"></div>
        
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=85"
          alt="Premium kitchenware setup"
          fill
          className="object-cover"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-12 right-12 z-20 bg-white/95 backdrop-blur shadow-soft rounded-xl px-4 py-3 flex items-center gap-3 animate-float">
          <span className="text-2xl">🏆</span>
          <span className="text-sm font-semibold text-foreground">Trusted by 10,000+<br/>Home Chefs</span>
        </div>
        
        <div className="absolute bottom-16 left-8 z-20 bg-white/95 backdrop-blur shadow-soft rounded-xl px-4 py-3 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
          <span className="text-2xl">⭐</span>
          <span className="text-sm font-semibold text-foreground">4.9/5 Average<br/>Rating</span>
        </div>
      </div>
    </div>
  );
}
