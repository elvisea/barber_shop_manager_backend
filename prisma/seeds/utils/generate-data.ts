/**
 * Utilitários para geração de dados realistas para seeds
 */

export class DataGenerator {
  /**
   * Gera nome brasileiro realista
   */
  static generateBrazilianName(): string {
    const firstNames = [
      'João', 'Maria', 'José', 'Ana', 'Carlos', 'Mariana', 'Pedro', 'Julia',
      'Lucas', 'Fernanda', 'Rafael', 'Camila', 'Diego', 'Larissa', 'Felipe',
      'Beatriz', 'Gabriel', 'Isabella', 'Bruno', 'Amanda', 'Rodrigo', 'Carolina',
      'Thiago', 'Natália', 'André', 'Patrícia', 'Marcos', 'Renata', 'Daniel',
      'Vanessa', 'Leandro', 'Cristina', 'Paulo', 'Sandra', 'Ricardo', 'Mônica'
    ];

    const lastNames = [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
      'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
      'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha',
      'Dias', 'Monteiro', 'Cardoso', 'Reis', 'Nascimento', 'Moreira', 'Freitas',
      'Mendes', 'Nunes', 'Marques', 'Machado', 'Araújo', 'Castro', 'Ramos'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

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
    const streets = [
      'Rua das Flores', 'Avenida Paulista', 'Rua da Consolação', 'Avenida Brasil',
      'Rua Augusta', 'Avenida Ipiranga', 'Rua Oscar Freire', 'Avenida Faria Lima',
      'Rua Haddock Lobo', 'Avenida Rebouças', 'Rua Bela Cintra', 'Avenida 9 de Julho',
      'Rua da Liberdade', 'Avenida Sumaré', 'Rua dos Três Irmãos', 'Avenida Pacaembu'
    ];

    const neighborhoods = [
      'Centro', 'Vila Madalena', 'Pinheiros', 'Jardins', 'Itaim Bibi', 'Moema',
      'Vila Olímpia', 'Brooklin', 'Santo André', 'São Bernardo', 'Osasco',
      'Guarulhos', 'Campinas', 'Santos', 'Ribeirão Preto', 'Belo Horizonte'
    ];

    const street = streets[Math.floor(Math.random() * streets.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const number = Math.floor(Math.random() * 9999) + 1;

    return `${street}, ${number}, ${neighborhood}`;
  }

  /**
   * Gera nome de estabelecimento realista
   */
  static generateEstablishmentName(): string {
    const prefixes = [
      'Barbearia', 'Salão', 'Barbearia e Barbearia', 'Corte & Cia', 'Estilo',
      'Modern', 'Classic', 'Premium', 'Elite', 'Top', 'Master', 'Pro'
    ];

    const suffixes = [
      'do Centro', 'da Vila', 'dos Jardins', 'Premium', 'Express', 'Clássica',
      'Modern', 'Elite', 'Top', 'Master', 'Pro', 'Style', 'Fashion'
    ];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

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
    const durations = [15, 30, 45, 60, 90, 120];
    return durations[Math.floor(Math.random() * durations.length)];
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
