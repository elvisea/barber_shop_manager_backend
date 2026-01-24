-- Script SQL para criar 15 estabelecimentos para o usuário 3e540fc1-679f-4c70-9b9e-0ec1790545bb
-- Execute este script dentro do container Docker ou diretamente no banco de dados

INSERT INTO establishments (
  id,
  name,
  address,
  phone,
  owner_id,
  created_at,
  updated_at,
  deleted_at,
  deleted_by
) VALUES
  (
    gen_random_uuid(),
    'Barbearia do João',
    'Rua das Flores, 123 - Centro, Curitiba - PR',
    '+5541991000001',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Corte & Estilo',
    'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
    '+5511991000002',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barber Shop Premium',
    'Rua do Comércio, 789 - Centro, Rio de Janeiro - RJ',
    '+5521991000003',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Estilo Masculino',
    'Av. Beira Mar, 321 - Praia de Iracema, Fortaleza - CE',
    '+5585991000004',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barbearia Clássica',
    'Rua da Praia, 654 - Centro, Florianópolis - SC',
    '+5548991000005',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'The Barber',
    'Av. Atlântica, 987 - Copacabana, Rio de Janeiro - RJ',
    '+5521991000006',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Corte Moderno',
    'Rua XV de Novembro, 147 - Centro, Belo Horizonte - MG',
    '+5531991000007',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barbearia Elite',
    'Av. Boa Viagem, 258 - Boa Viagem, Recife - PE',
    '+5581991000008',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Estilo & Tradição',
    'Rua do Sol, 369 - Centro Histórico, Salvador - BA',
    '+5571991000009',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barber House',
    'Av. Dom Luís, 741 - Meireles, Fortaleza - CE',
    '+5585991000010',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Corte Perfeito',
    'Rua da Consolação, 852 - Consolação, São Paulo - SP',
    '+5511991000011',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barbearia Vintage',
    'Av. Sete de Setembro, 963 - Centro, Porto Alegre - RS',
    '+5551991000012',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'The Gentleman',
    'Rua Augusta, 159 - Consolação, São Paulo - SP',
    '+5511991000013',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Barbearia do Bairro',
    'Rua das Acácias, 357 - Jardim das Flores, Campinas - SP',
    '+5519991000014',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  ),
  (
    gen_random_uuid(),
    'Corte & Barba',
    'Av. Afonso Pena, 468 - Centro, Belo Horizonte - MG',
    '+5531991000015',
    '3e540fc1-679f-4c70-9b9e-0ec1790545bb',
    NOW(),
    NOW(),
    NULL,
    NULL
  );

-- Verificar se os estabelecimentos foram criados
SELECT 
  id,
  name,
  phone,
  address,
  created_at
FROM establishments
WHERE owner_id = '3e540fc1-679f-4c70-9b9e-0ec1790545bb'
ORDER BY created_at DESC;
