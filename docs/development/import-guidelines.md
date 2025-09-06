# 📦 Import Organization Guidelines

Este documento define o padrão oficial para organização e ordenação de imports em todos os arquivos TypeScript do projeto.

## 🎯 Objetivo

- Melhorar a legibilidade e manutenção do código.
- Facilitar revisões e evitar conflitos desnecessários em PRs.
- Padronizar a estrutura de imports para todo o time.

---

## 🧩 Estrutura dos Imports

Os imports devem ser organizados em blocos, separados por uma linha em branco, seguindo a ordem abaixo:

### 1. **Bibliotecas externas**
- Pacotes do Node.js e bibliotecas de terceiros (ex: `@nestjs/common`, `rxjs`, `lodash`, etc).

### 2. **Aliases e módulos internos do projeto**
- Imports usando alias definidos no `tsconfig.json` (ex: `@/modules/`, `@/prisma/`, etc).

### 3. **Imports relativos**
- Imports relativos ao próprio módulo/pasta (ex: `./service`, `../dtos/xxx`).

### 4. **Separação por linha em branco entre blocos**

### 5. **Ordem alfabética dentro de cada bloco** _(opcional, mas recomendado)_

---

## 📋 Exemplo Prático

```ts
// 1. Bibliotecas externas
import { Injectable, Logger } from '@nestjs/common';

// 2. Aliases e módulos internos
import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

// 3. Imports relativos ao módulo
import { CreateEstablishmentRequestDTO } from '../dtos/create-establishment-request.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';
```

---

## ✅ Regras Resumidas

1. **Sempre separe os imports em blocos:**
   - Bibliotecas externas
   - Aliases do projeto
   - Imports relativos

2. **Separe cada bloco com uma linha em branco.**

3. **(Opcional) Ordene alfabeticamente dentro de cada bloco.**

4. **Nunca misture imports de diferentes blocos na mesma linha.**

---

## 🛠️ Automatização

- Utilize o ESLint com o plugin `eslint-plugin-import` para reforçar essas regras.
- O Prettier pode ajudar a manter a formatação.

### Exemplo de configuração ESLint:

```json
"import/order": [
  "error",
  {
    "groups": [
      "builtin",
      "external",
      "internal",
      "parent",
      "sibling",
      "index"
    ],
    "newlines-between": "always",
    "alphabetize": { "order": "asc", "caseInsensitive": true }
  }
]
```

---

## 👥 Observações para o Time

- Siga este padrão em todos os arquivos TypeScript do projeto.
- Em caso de dúvida, consulte este documento ou peça revisão para alguém do time.
- Sugestões de melhoria são bem-vindas! 