# API Documentation - SPAC

## Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login de usuário
- `POST /api/v1/auth/register` - Registro de usuário
- `POST /api/v1/auth/logout` - Logout de usuário

### Candidatos
- `GET /api/v1/candidates` - Lista de candidatos
- `GET /api/v1/candidates/[id]` - Detalhes do candidato
- `POST /api/v1/candidates` - Criar candidato
- `PUT /api/v1/candidates/[id]` - Atualizar candidato
- `DELETE /api/v1/candidates/[id]` - Remover candidato

### Scores
- `GET /api/v1/scores/[candidateId]` - Scores do candidato
- `POST /api/v1/scores` - Salvar score
- `GET /api/v1/scores/analytics` - Análises estatísticas

### Exportação
- `GET /api/v1/export/csv` - Exportar dados em CSV
- `GET /api/v1/export/pdf` - Exportar relatório em PDF

## Autenticação
Todos os endpoints (exceto login/register) requerem token JWT no header:
```
Authorization: Bearer <token>
```

## Respostas
Todas as respostas seguem o padrão:
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```
