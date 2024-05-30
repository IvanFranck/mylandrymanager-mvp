import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export const calculateCommandSubtotal = (services: { quantity: number, service: { price: number } }[]) => {
  return services.reduce((acc, { quantity, service }) => acc + (service.price * quantity), 0);
}