# Agenda Procedimentos - Documentação

Este módulo implementa o relacionamento many-to-many entre Agenda e
Procedimentos através da tabela `agenda_procedimento_tenancy`.

## Estrutura da Tabela

A tabela `agenda_procedimento_tenancy` possui as seguintes colunas:

- `agenda_uuid` (UUID, PK) - Referência para a agenda
- `procedimento_uuid` (UUID, PK) - Referência para o procedimento
- `tenancy_uuid` (UUID) - Referência para o tenancy
- `created_at` (timestamp) - Data de criação
- `updated_at` (timestamp) - Data de atualização

## Endpoints Disponíveis

### 1. Adicionar Procedimento à Agenda

```http
POST /agenda/{uuid}/procedimentos
Content-Type: application/json

{
  "procedimentoUuid": "123e4567-e89b-12d3-a456-426614174000",
  "tenancyUuid": "123e4567-e89b-12d3-a456-426614174001"
}
```

### 2. Listar Procedimentos de uma Agenda

```http
GET /agenda/{uuid}/procedimentos
```

### 3. Buscar Agenda com Procedimentos (Resumo)

```http
GET /agenda/{uuid}/with-procedimentos
```

### 4. Remover Procedimento da Agenda

```http
DELETE /agenda/{uuid}/procedimentos/{procedimentoUuid}
Content-Type: application/json

{
  "tenancyUuid": "123e4567-e89b-12d3-a456-426614174001"
}
```

## Relacionamentos Implementados

### AgendaProcedimentoTenancy Entity

- **ManyToOne** com Agenda
- **ManyToOne** com Procedimento
- **ManyToOne** com Tenancy

### Agenda Entity

- **OneToMany** com AgendaProcedimentoTenancy

### Procedimento Entity

- **OneToMany** com AgendaProcedimentoTenancy

## Arquivos Criados/Modificados

### Novos Arquivos:

1. `src/agenda/entities/agenda-procedimento-tenancy.entity.ts` - Entidade da
   tabela de relacionamento
2. `src/agenda/dto/add-procedimento-to-agenda.dto.ts` - DTO para adicionar
   procedimento
3. `src/agenda/dto/remove-procedimento-from-agenda.dto.ts` - DTO para remover
   procedimento
4. `src/agenda/interfaces/agenda-procedimento.interface.ts` - Interfaces
   auxiliares

### Arquivos Modificados:

1. `src/agenda/entities/agenda.entity.ts` - Adicionado relacionamento OneToMany
2. `src/procedimentos/entities/procedimento.entity.ts` - Adicionado
   relacionamento OneToMany
3. `src/agenda/agenda.module.ts` - Registrada nova entidade
4. `src/agenda/agenda.service.ts` - Adicionados métodos para gerenciar
   procedimentos
5. `src/agenda/agenda.controller.ts` - Adicionados endpoints para procedimentos

## Validações Implementadas

- Verificação se a agenda existe antes de adicionar procedimento
- Verificação de relacionamento duplicado
- Tratamento de erros com exceções apropriadas (NotFoundException,
  ConflictException)
- Validação de UUIDs nos DTOs

## Características Técnicas

- Chaves compostas na tabela de relacionamento (agenda_uuid + procedimento_uuid)
- Índices para otimização de consultas
- Relacionamentos com cascade apropriados
- Soft deletes suportados conforme padrão do projeto
- TypeORM decorators para mapeamento objeto-relacional
