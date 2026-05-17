import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function generateWhatsAppLink(
  phone: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
  customerName: string,
  pickupTime: string,
  orderType: 'ritiro' | 'domicilio' = 'ritiro',
  address: string = '',
  paymentMethod: 'contanti' | 'pos' = 'contanti',
  cashAmount: string = ''
) {
  const baseUrl = "https://wa.me/" + phone.replace(/\D/g, "");
  
  const listaPiatti = items.map(item => `${item.quantity}x ${item.name}`).join("\n- ");
  
  let message = `🍔 *NUOVO ORDINE - 100 PORTE*\n\n`;
  message += `👤 *Nome:* ${customerName}\n`;
  message += `📦 *Modalità:* ${orderType === 'domicilio' ? 'Consegna a Domicilio' : 'Ritiro al Locale'}\n`;
  
  if (orderType === 'domicilio') {
    message += `📍 *Indirizzo:* ${address}\n`;
    message += `🕒 *Orario di consegna:* ${pickupTime}\n`;
  } else {
    message += `🕒 *Orario di ritiro:* ${pickupTime}\n`;
  }
  
  if (orderType === 'domicilio') {
    if (paymentMethod === 'contanti' && cashAmount.trim() !== '') {
      message += `💳 *Pagamento:* Contanti (Resto su ${cashAmount}€)\n\n`;
    } else {
      message += `💳 *Pagamento:* ${paymentMethod === 'pos' ? 'Carta / POS' : 'Contanti'}\n\n`;
    }
  } else {
    message += `💳 *Pagamento:* Al Ritiro nel Locale\n\n`;
  }
  
  message += `*Riepilogo:*\n- ${listaPiatti}\n\n`;
  message += `💰 *TOTALE: ${formatPrice(total)}*`;
  
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
