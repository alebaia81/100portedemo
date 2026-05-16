"use client";

import { useCart } from "@/lib/store";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { X, ShoppingBag, Send, User, Clock, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    getTotal, 
    customerName, 
    setCustomerName, 
    pickupTime, 
    setPickupTime,
    removeItem
  } = useCart();

  const total = getTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleOrder = () => {
    if (!customerName || !pickupTime) {
      alert("Per favore, inserisci il tuo nome e l'orario di ritiro.");
      return;
    }
    const link = generateWhatsAppLink("3398156719", items, total, customerName, pickupTime);
    window.open(link, "_blank");
  };

  if (itemCount === 0) return null;

  return (
    <>
      {/* Sticky Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-accent text-background p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 transition-transform animate-bounce hover:animate-none"
      >
        <ShoppingBag size={24} />
        <span className="font-bold">{itemCount}</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/20">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-accent">
            <ShoppingBag /> Il Tuo Ordine
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:text-accent">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start gap-4 pb-4 border-b border-border/50">
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-sm text-muted-text">
                  {item.quantity}x {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-accent">{formatPrice(item.price * item.quantity)}</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-muted-text hover:text-steak-red transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="space-y-4 bg-background/30 p-4 rounded-xl border border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-text flex items-center gap-2">
                <User size={14} /> Il Tuo Nome
              </label>
              <input
                type="text"
                placeholder="Es. Mario Rossi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg p-2 focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-text flex items-center gap-2">
                <Clock size={14} /> Orario di Ritiro
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg p-2 focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-background/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold">Totale</span>
            <span className="text-2xl font-bold text-accent">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleOrder}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            <Send size={20} />
            Invia Ordine su WhatsApp
          </button>
          <p className="text-center text-[10px] text-muted-text mt-4 uppercase tracking-widest">
            Il pagamento avviene al ritiro nel locale
          </p>
        </div>
      </div>
    </>
  );
}
