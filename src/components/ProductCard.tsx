"use client";

import { Product } from "@/lib/menu-data";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="glass-card p-4 flex flex-col h-full group transition-all hover:border-accent/50">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <span className="text-accent font-bold">{formatPrice(product.price)}</span>
        </div>
        <p className="text-muted-text text-sm mb-4 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        {quantity > 0 ? (
          <div className="flex items-center gap-3 bg-background/50 rounded-lg p-1 border border-border">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1 hover:text-accent transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="font-bold min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1 hover:text-accent transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="btn-primary py-2 px-4 flex items-center gap-2 w-full justify-center text-sm"
          >
            <Plus size={16} />
            Aggiungi
          </button>
        )}
      </div>
    </div>
  );
}
