"use client";

import { useCart } from "@/lib/store";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { X, ShoppingBag, Send, User, Clock, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    items, 
    getTotal, 
    customerName, 
    setCustomerName, 
    pickupTime, 
    setPickupTime,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart();

  const total = getTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [orderType, setOrderType] = useState<'ritiro' | 'domicilio'>('ritiro');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'contanti' | 'pos'>('contanti');
  const [cashAmount, setCashAmount] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleOrder = () => {
    if (!customerName || !pickupTime) {
      alert("Per favore, inserisci il tuo nome e l'orario.");
      return;
    }
    if (orderType === 'domicilio' && !address.trim()) {
      alert("Per favore, inserisci il tuo indirizzo per la consegna.");
      return;
    }
    if (!gdprAccepted) {
      alert("Devi accettare il trattamento dei dati per procedere con l'ordine.");
      return;
    }
    
    const link = generateWhatsAppLink(
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "3398156719", 
      items, 
      total, 
      customerName, 
      pickupTime,
      orderType,
      address,
      paymentMethod,
      cashAmount
    );
    window.open(link, "_blank");
    
    // Reset dopo invio per evitare ordini doppi
    clearCart();
    setAddress('');
    setCashAmount('');
    setGdprAccepted(false);
    setOrderType('ritiro');
    setIsOpen(false);
  };

  if (!mounted || itemCount === 0) return null;

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
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center bg-background/50 rounded-lg border border-border">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:text-accent transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:text-accent transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-text">
                    x {formatPrice(item.price)}
                  </p>
                </div>
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

          <div className="space-y-6 bg-background/30 p-4 rounded-xl border border-border">
            
            {/* Modalità: Ritiro o Consegna */}
            <div className="flex bg-surface p-1 rounded-lg border border-border">
              <button 
                onClick={() => setOrderType('ritiro')}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-colors ${orderType === 'ritiro' ? 'bg-accent text-background' : 'text-muted-text hover:text-foreground'}`}
              >
                Ritiro
              </button>
              <button 
                onClick={() => setOrderType('domicilio')}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-colors ${orderType === 'domicilio' ? 'bg-accent text-background' : 'text-muted-text hover:text-foreground'}`}
              >
                Consegna
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-text flex items-center gap-2">
                  <User size={14} /> Il Tuo Nome
                </label>
                <input
                  type="text"
                  placeholder="Es. Mario Rossi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg p-3 focus:border-accent outline-none text-sm"
                />
              </div>

              {orderType === 'domicilio' && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold uppercase text-muted-text flex items-center gap-2">
                    📍 Indirizzo di Consegna
                  </label>
                  <input
                    type="text"
                    placeholder="Via Roma 11, Castelvetro Piacentino"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg p-3 focus:border-accent outline-none text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-text flex items-center gap-2">
                  <Clock size={14} /> {orderType === 'ritiro' ? 'Orario di Ritiro' : 'Orario Richiesto'}
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg p-3 focus:border-accent outline-none text-sm"
                />
              </div>
            </div>

            {/* Metodo di Pagamento */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              {orderType === 'domicilio' ? (
                <>
                  <label className="text-xs font-bold uppercase text-muted-text">💳 Come preferisci pagare?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer border rounded-lg p-3 text-center text-sm font-bold transition-colors flex flex-col items-center gap-1 ${paymentMethod === 'contanti' ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted-text hover:border-accent/50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="contanti" 
                        checked={paymentMethod === 'contanti'} 
                        onChange={() => setPaymentMethod('contanti')}
                        className="sr-only"
                      />
                      <span>Contanti</span>
                      {paymentMethod === 'contanti' && <span className="text-[10px] uppercase font-normal opacity-70">il rider porta il resto</span>}
                    </label>
                    <label className={`cursor-pointer border rounded-lg p-3 text-center text-sm font-bold transition-colors flex flex-col items-center gap-1 ${paymentMethod === 'pos' ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted-text hover:border-accent/50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="pos" 
                        checked={paymentMethod === 'pos'} 
                        onChange={() => setPaymentMethod('pos')}
                        className="sr-only"
                      />
                      <span>Carta / POS</span>
                      {paymentMethod === 'pos' && <span className="text-[10px] uppercase font-normal opacity-70">il rider porta il pos</span>}
                    </label>
                  </div>

                  {/* Input Importo Contanti (solo per consegna e contanti) */}
                  {paymentMethod === 'contanti' && (
                    <div className="mt-3 animate-fade-in space-y-2">
                      <label className="text-xs text-muted-text">Con che taglio paghi? (Es. 50)</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Importo in Euro"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          className="w-full bg-surface border border-border rounded-lg p-3 pl-8 focus:border-accent outline-none text-sm"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text font-bold">€</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-3 border border-border rounded-lg bg-surface">
                  <p className="text-xs uppercase tracking-widest text-muted-text font-bold">💳 Pagamento</p>
                  <p className="text-sm mt-1">Il pagamento avviene al ritiro nel locale.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-border bg-background/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Totale</span>
            <span className="text-2xl font-bold text-accent">{formatPrice(total)}</span>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
              <input 
                type="checkbox" 
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="peer appearance-none w-5 h-5 border border-border rounded bg-surface checked:bg-accent checked:border-accent transition-colors"
              />
              <svg className="absolute w-3 h-3 text-background opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[11px] text-muted-text leading-tight group-hover:text-foreground transition-colors">
              Acconsento al trattamento dei miei dati personali al solo fine di gestire e completare questo ordine, in conformità con la normativa sulla Privacy (GDPR).
            </span>
          </label>

          <button
            onClick={handleOrder}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4"
          >
            <Send size={20} />
            Invia Ordine su WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
