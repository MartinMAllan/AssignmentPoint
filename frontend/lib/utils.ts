import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { OrderStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayStatus(
  status: OrderStatus,
  userRole?: string
): string {
  if (status === "available" && userRole === "customer") {
    return "BIDDING"
  }
  
  return status.toUpperCase()
}