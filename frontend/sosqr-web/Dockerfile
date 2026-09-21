FROM node:22-alpine

WORKDIR /app

# Cache de dependências do Node
COPY package*.json ./
RUN npm install

EXPOSE 5173

# Subir com flag --host para permitir acesso fora do contêiner
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]