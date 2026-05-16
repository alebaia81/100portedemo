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
  pickupTime: string
) {
  const baseUrl = "https://wa.me/" + phone.replace(/\D/g, "");
  
  let message = `Ciao Cento Porte Pub! Mi chiamo *${customerName}*, vorrei ordinare per asporto:\n\n`;
  
  items.forEach((item) => {
    message += `• ${item.quantity}x *${item.name}* (${formatPrice(item.price * item.quantity)})\n`;
  });
  
  message += `\n*Totale: ${formatPrice(total)}*\n`;
  message += `*Orario di ritiro preferito: ${pickupTime}*\n\n`;
  message += `Confermate la disponibilità?`;
  
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
