FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

COPY . .

EXPOSE 3000

# Vamos remover o Turbopack por enquanto para garantir estabilidade no Docker
# Substituímos 'next dev' por uma chamada que ignore o turbo se necessário
CMD ["npm", "run", "dev"]