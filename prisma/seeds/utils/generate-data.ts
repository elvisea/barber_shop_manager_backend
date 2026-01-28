/**
 * Utilitários para geração de dados realistas para seeds
 */

import { FIRST_NAMES, LAST_NAMES } from '../data/templates/brazilian-names';
import { STREETS, NEIGHBORHOODS } from '../data/templates/brazilian-address';
import { ESTABLISHMENT_PREFIXES, ESTABLISHMENT_SUFFIXES } from '../data/templates/establishment-names';
import { DURATIONS } from '../data/templates/durations';

export class DataGenerator {
  /**
   * Gera nome brasileiro realista
   */
  static generateBrazilianName(): string {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    return `${firstName} ${lastName}`;
  }

  /**
   * Gera email baseado no nome
   */
  static generateEmail(name: string, domain: string = 'example.com'): string {
    const cleanName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '.');

    return `${cleanName}@${domain}`;
  }

  /**
   * Gera telefone brasileiro realista
   */
  static generateBrazilianPhone(): string {
    const ddd = Math.floor(Math.random() * 90) + 11; // DDDs válidos
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 90000000) + 10000000;

    return `+55${ddd}9${firstDigit}${remainingDigits.toString().padStart(7, '0')}`;
  }

  /**
   * Gera endereço brasileiro realista
   */
  static generateBrazilianAddress(): string {
    const street = STREETS[Math.floor(Math.random() * STREETS.length)];
    const neighborhood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
    const number = Math.floor(Math.random() * 9999) + 1;

    return `${street}, ${number}, ${neighborhood}`;
  }

  /**
   * Gera nome de estabelecimento realista
   */
  static generateEstablishmentName(): string {
    const prefix = ESTABLISHMENT_PREFIXES[Math.floor(Math.random() * ESTABLISHMENT_PREFIXES.length)];
    const suffix = ESTABLISHMENT_SUFFIXES[Math.floor(Math.random() * ESTABLISHMENT_SUFFIXES.length)];

    return `${prefix} ${suffix}`;
  }

  /**
   * Gera preço realista em centavos (R$ 10,00 a R$ 150,00)
   */
  static generatePrice(): number {
    const minPrice = 1000; // R$ 10,00
    const maxPrice = 15000; // R$ 150,00
    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  }

  /**
   * Gera duração realista em minutos (15 a 120 minutos)
   */
  static generateDuration(): number {
    return DURATIONS[Math.floor(Math.random() * DURATIONS.length)];
  }

  /**
   * Gera comissão realista (0.1 a 0.3)
   */
  static generateCommission(): number {
    const minCommission = 0.1;
    const maxCommission = 0.3;
    return Math.round((Math.random() * (maxCommission - minCommission) + minCommission) * 100) / 100;
  }
}
