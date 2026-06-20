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
  
  let message = `\u{1F354} *NUOVO ORDINE - BURGER LAB*\n\n`;
  message += `\u{1F464} *Nome:* ${customerName}\n`;
  message += `\u{1F4E6} *Modalita:* ${orderType === 'domicilio' ? 'Consegna a Domicilio' : 'Ritiro al Locale'}\n`;
  
  if (orderType === 'domicilio') {
    message += `\u{1F4CD} *Indirizzo:* ${address}\n`;
    message += `\u{1F552} *Orario consegna:* ${pickupTime}\n`;
  } else {
    message += `\u{1F552} *Orario ritiro:* ${pickupTime}\n`;
  }
  
  if (orderType === 'domicilio') {
    if (paymentMethod === 'contanti' && cashAmount.trim() !== '') {
      message += `\u{1F4B5} *Pagamento:* Contanti (Resto su ${cashAmount}\u20AC)\n\n`;
    } else {
      message += `\u{1F4B3} *Pagamento:* ${paymentMethod === 'pos' ? 'Carta / POS' : 'Contanti'}\n\n`;
    }
  } else {
    message += `\u{1F4B5} *Pagamento:* Al Ritiro nel Locale\n\n`;
  }
  
  message += `\u{1F4CB} *Riepilogo:*\n- ${listaPiatti}\n\n`;
  message += `\u{1F4B0} *TOTALE: ${formatPrice(total)}*`;
  
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
