"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/menu-data";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  isAvailable?: boolean;
}

export default function ProductCard({ product, isAvailable = true }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = mounted ? (cartItem?.quantity || 0) : 0;

  const hasImage = !!product.image;

  return (
    <div className={`glass-card flex flex-col h-full group transition-all duration-300 hover:border-accent/50 ${
      hasImage ? "p-0 overflow-hidden" : "p-4"
    } ${!isAvailable ? 'opacity-50 grayscale' : ''}`}>
      
      {/* Product Image (if present) */}
      {hasImage && (
        <div className="relative h-48 w-full overflow-hidden border-b border-border/30">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.promo && (
            <span className="absolute top-3 left-3 bg-accent text-background font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
              Promo
            </span>
          )}
        </div>
      )}

      {/* Product Details Container */}
      <div className={`flex flex-col flex-grow ${hasImage ? "p-5" : ""}`}>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
              {product.name}
            </h3>
            <span className="text-accent font-bold whitespace-nowrap">
              {isAvailable ? formatPrice(product.price) : <span className="text-red-500 font-bold uppercase text-xs">Esaurito</span>}
            </span>
          </div>
          <p className="text-muted-text text-sm mb-5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Button / Quantity Controls */}
        <div className="mt-auto flex items-center justify-between">
          {quantity > 0 && isAvailable ? (
            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-1 border border-border w-full justify-between">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-1.5 hover:text-accent transition-colors"
                aria-label="Diminuisci quantità"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="p-1.5 hover:text-accent transition-colors"
                aria-label="Aumenta quantità"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => isAvailable && addItem(product)}
              disabled={!isAvailable}
              className="btn-primary py-2.5 px-4 flex items-center gap-2 w-full justify-center text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              Aggiungi
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
