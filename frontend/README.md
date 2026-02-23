# iVisa - Sistema de Gestão de Inspeções Sanitárias 🏥

Solução Fullstack desenvolvida para o desafio técnico da IVISA-RIO, focada na digitalização de inspeções sanitárias, garantindo imutabilidade de dados e facilidade de uso para fiscais.

## 🚀 Como Executar o Projeto

Devido a otimizações de performance e compatibilidade com os binários nativos do Next.js 15 (Turbopack/LightningCSS), a recomendação é rodar o Backend via Docker e o Frontend localmente. Mas o docker-compose permite a execução dos 2 projetos como um monolito.
A documentação do backend está presente no endereço localhost:8000/docs

### 1. Backend (Docker)
Na raiz do projeto, execute:
```bash
docker-compose up backend

ou

```bash
docker-compose up --build -d
```


### Frontend(local)
```bash
cd frontend
npm install
npm run dev
```

### Credenciais de Acesso
Usuário: fiscal

Senha: ivisa123