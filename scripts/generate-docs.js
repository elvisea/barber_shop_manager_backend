#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Gerador automático de documentação Swagger para módulos
 * 
 * Este script gera automaticamente a estrutura de documentação Swagger
 * para novos módulos baseado em templates padronizados.
 */

// Configuração padrão
const DEFAULT_CONFIG = {
  actions: ['create', 'find-all', 'find-by-id', 'update', 'delete'],
  modulePath: 'src/modules',
  templatesPath: 'scripts/templates',
  docsFolder: 'docs'
};

// Mapeamento de ações para templates
const ACTION_TEMPLATES = {
  'create': 'create-entity.docs.ts.template',
  'find-all': 'find-entity.docs.ts.template',
  'find-by-id': 'find-entity-by-id.docs.ts.template',
  'update': 'update-entity.docs.ts.template',
  'delete': 'delete-entity.docs.ts.template'
};

/**
 * Converte string para PascalCase
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Converte string para camelCase
 */
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Substitui placeholders no template
 */
function replacePlaceholders(content, moduleName, entityName) {
  const entityNamePascal = toPascalCase(entityName);
  const entityNameCamel = toCamelCase(entityName);

  return content
    .replace(/\{\{moduleName\}\}/g, moduleName)
    .replace(/\{\{entityName\}\}/g, entityNameCamel)
    .replace(/\{\{EntityName\}\}/g, entityNamePascal);
}

/**
 * Cria diretório se não existir
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Diretório criado: ${dirPath}`);
  }
}

/**
 * Gera arquivo de documentação a partir do template
 */
function generateDocFile(templatePath, outputPath, moduleName, entityName) {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const processedContent = replacePlaceholders(templateContent, moduleName, entityName);

    fs.writeFileSync(outputPath, processedContent);
    console.log(`✅ Arquivo gerado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erro ao gerar arquivo ${outputPath}:`, error.message);
    throw error;
  }
}

/**
 * Gera arquivo index.ts
 */
function generateIndexFile(modulePath, moduleName, entityName, actions) {
  const indexPath = path.join(modulePath, 'docs', 'index.ts');
  const templatePath = path.join(__dirname, 'templates', 'index.docs.ts.template');

  generateDocFile(templatePath, indexPath, moduleName, entityName);
}

/**
 * Valida parâmetros de entrada
 */
function validateParams(moduleName, entityName) {
  if (!moduleName) {
    throw new Error('Nome do módulo é obrigatório. Use --module=<nome>');
  }

  if (!entityName) {
    throw new Error('Nome da entidade é obrigatório. Use --entity=<nome>');
  }

  // Validar formato do nome do módulo
  if (!/^[a-z][a-z0-9-]*$/.test(moduleName)) {
    throw new Error('Nome do módulo deve conter apenas letras minúsculas, números e hífens');
  }

  // Validar formato do nome da entidade
  if (!/^[a-z][a-z0-9-]*$/.test(entityName)) {
    throw new Error('Nome da entidade deve conter apenas letras minúsculas, números e hífens');
  }
}

/**
 * Verifica se o módulo existe
 */
function validateModuleExists(modulePath) {
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Módulo não encontrado: ${modulePath}`);
  }
}

/**
 * Função principal
 */
function main() {
  try {
    console.log('🚀 Gerador de Documentação Swagger');
    console.log('=====================================\n');

    // Parse dos argumentos da linha de comando
    const args = process.argv.slice(2);
    const options = {};

    args.forEach(arg => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        options[key] = value;
      }
    });

    const moduleName = options.module;
    const entityName = options.entity;
    const actions = options.actions ? options.actions.split(',') : DEFAULT_CONFIG.actions;

    // Validar parâmetros
    validateParams(moduleName, entityName);

    // Construir caminhos
    const modulePath = path.join(process.cwd(), DEFAULT_CONFIG.modulePath, moduleName);
    const docsPath = path.join(modulePath, DEFAULT_CONFIG.docsFolder);
    const templatesPath = path.join(process.cwd(), DEFAULT_CONFIG.templatesPath);

    // Validar se módulo existe
    validateModuleExists(modulePath);

    console.log(`📦 Módulo: ${moduleName}`);
    console.log(`🏷️  Entidade: ${entityName}`);
    console.log(`📋 Ações: ${actions.join(', ')}`);
    console.log(`📁 Caminho: ${modulePath}\n`);

    // Criar diretório docs se não existir
    ensureDirectoryExists(docsPath);

    // Gerar arquivos de documentação para cada ação
    actions.forEach(action => {
      const templateFile = ACTION_TEMPLATES[action];
      if (!templateFile) {
        console.warn(`⚠️  Ação não suportada: ${action}`);
        return;
      }

      const templatePath = path.join(templatesPath, templateFile);
      const outputFileName = templateFile.replace('entity', entityName).replace('.template', '');
      const outputPath = path.join(docsPath, outputFileName);

      if (!fs.existsSync(templatePath)) {
        console.warn(`⚠️  Template não encontrado: ${templatePath}`);
        return;
      }

      generateDocFile(templatePath, outputPath, moduleName, entityName);
    });

    // Gerar arquivo index.ts
    generateIndexFile(modulePath, moduleName, entityName, actions);

    console.log('\n🎉 Documentação Swagger gerada com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Verifique os arquivos gerados na pasta docs/');
    console.log('2. Ajuste os DTOs conforme necessário');
    console.log('3. Importe os decorators nos controllers');
    console.log('4. Teste a documentação no Swagger UI');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n💡 Uso: npm run generate-docs -- --module=<módulo> --entity=<entidade> [--actions=<ações>]');
    console.log('\n📋 Exemplos:');
    console.log('  npm run generate-docs -- --module=users --entity=user');
    console.log('  npm run generate-docs -- --module=products --entity=product --actions=create,find-all');
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  generateDocFile,
  replacePlaceholders,
  toPascalCase,
  toCamelCase
};
