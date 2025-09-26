import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  parseLocaleNumber(value: string): number {
    // Remove currency symbols, spaces, and use a consistent format
    const normalized = value.replace(/[^\d,.-]/g, '')
      .replace(/\./g, '') // Remove a thousand separators for es-CR format
      .replace(',', '.'); // Convert decimal comma to dot

    return Number(normalized);
  }

  formatCRC(current: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(current);
  }
}
