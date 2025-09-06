import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

import { AppModule } from '../src/app.module';

/**
 * Script para gerar documentação YAML das rotas da aplicação
 * Baseado na configuração do Swagger com schemas completos
 */
async function generateRoutesYaml(): Promise<void> {
  console.log('🚀 Iniciando geração do documento YAML das rotas...');

  try {
    // Criar aplicação temporária para gerar documentação
    const app = await NestFactory.create(AppModule, { logger: false });

    // Configurar Swagger (mesma configuração do main.ts)
    const config = new DocumentBuilder()
      .setTitle('Barber Shop Manager')
      .setDescription('Barber Shop Manager system API for barbershop management')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    // Gerar documento Swagger
    const document = SwaggerModule.createDocument(app, config);

    // Converter para YAML com schemas completos
    const yamlContent = yaml.dump(document, {
      indent: 2,
      lineWidth: 120,
      noRefs: false, // Mantém as referências para organizar melhor
    });

    // Definir caminho do arquivo de saída
    const outputPath = join(process.cwd(), 'docs', 'routes.yaml');

    // Criar diretório docs se não existir
    const fs = require('fs');
    const docsDir = join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Escrever arquivo YAML
    writeFileSync(outputPath, yamlContent, 'utf8');

    console.log(`✅ Documento YAML gerado com sucesso em: ${outputPath}`);
    console.log(`📊 Total de rotas encontradas: ${Object.keys(document.paths).length}`);
    console.log(`📋 Total de schemas encontrados: ${Object.keys(document.components?.schemas || {}).length}`);

    // Fechar aplicação
    await app.close();

  } catch (error) {
    console.error('❌ Erro ao gerar documento YAML:', error);
    process.exit(1);
  }
}

// Executar script
generateRoutesYaml(); 