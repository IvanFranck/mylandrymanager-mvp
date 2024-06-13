import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CommandStatus } from "./types/entities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export const calculateCommandSubtotal = (services: { quantity: number, service: { price: number } }[]) => {
  return services.reduce((acc, { quantity, service }) => acc + (service.price * quantity), 0);
}

export const getCommandStatusVariant= (status: CommandStatus): {
  variant: string;
  text: string;
} | undefined => {
  switch (status) {
    case 'PAID':
        return {
          variant: 'text-green-500 border-green-500',
          text: 'Réglée'
        }
      break;
    case 'NOT_PAID':
        return {
          variant: 'text-red-500 border-red-500',
          text: 'Non réglée'
        }
      break;
    case 'PENDING':
        return {
          variant :'text-yellow-500 border-yellow-500',
          text: 'Avancé'
        }
      break;
  
    default:
      break;
  }
}