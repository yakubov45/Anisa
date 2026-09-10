'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────
interface ProductVariant {
  id: string;
  capacity?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  priceDelta: number;
  sku?: string;
  images: string[];
}

interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  material: string;
  stovetopCompatibility: string[];
  basePrice: number;
  discountPrice?: number | null;
  primaryImage: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  badge?: 'New' | 'Bestseller' | 'Sale' | null;
}

// ─── Compatibility Icons ─────────────────────────────────────
const COMPAT_ICONS: Record<string, string> = {
  'Induction': '⚡',
  'Gas': '🔥',
  'Electric': '⚡',
  'Ceramic': '◉',
  'Oven': '♨️',
  'Dishwasher Safe': '💧',
  'Microwave Safe': '📡',
};

function ProductCard({ product, badge }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = product.variants?.[selectedVariantIndex] || null;

  const currentPrice = (product.discountPrice || product.basePrice) + (activeVariant?.priceDelta || 0);
  const originalPrice = product.basePrice + (activeVariant?.priceDelta || 0);
  const isDiscounted = product.discountPrice != null;
  const stock = activeVariant?.stock ?? 0;

  let displayBadge = badge;
  if (!displayBadge && isDiscounted) {
    displayBadge = 'Sale';
  }

  const discountPercent = isDiscounted
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col h-full bg-white border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-surface-100 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full p-6 relative">
          <Image
            src={activeVariant?.images?.[0] || product.primaryImage}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Badges */}
        {displayBadge && (
          <div className="absolute top-4 left-4 z-10">
            {displayBadge === 'New' && (
              <span className="bg-primary-100 text-primary px-3 py-1 text-xs font-semibold rounded-full border border-primary-200">
                New
              </span>
            )}
            {displayBadge === 'Bestseller' && (
              <span className="bg-accent-100 text-accent-700 px-3 py-1 text-xs font-semibold rounded-full border border-accent-200">
                Bestseller
              </span>
            )}
            {displayBadge === 'Sale' && (
              <span className="bg-accent text-white px-3 py-1 text-xs font-semibold rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-border text-muted hover:text-primary hover:border-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-1.5">
            {product.brand}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {product.material && (
            <span className="material-badge">
              🔧 {product.material}
            </span>
          )}
          {product.stovetopCompatibility?.slice(0, 3).map(compat => (
            <span key={compat} className="compat-badge">
              {COMPAT_ICONS[compat] || '✓'} {compat}
            </span>
          ))}
        </div>

        {/* Variants */}
        {product.variants?.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {product.variants.map((v, i) => {
              if (v.colorHex) {
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      i === selectedVariantIndex ? 'border-primary' : 'border-transparent hover:border-muted'
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.color}
                  />
                );
              }
              if (v.capacity) {
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      i === selectedVariantIndex
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-foreground hover:bg-surface-200'
                    }`}
                  >
                    {v.capacity}
                  </button>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Rating & Price */}
        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-3.5 h-3.5 ${star <= product.rating ? 'fill-current' : 'fill-surface-200 text-surface-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              {isDiscounted && (
                <span className="text-sm text-muted line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-foreground">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full h-11 rounded-xl font-semibold text-sm transition-all ${
            stock > 0 
              ? 'btn-sage' 
              : 'bg-surface-200 text-muted cursor-not-allowed'
          }`}
          disabled={stock <= 0}
        >
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
