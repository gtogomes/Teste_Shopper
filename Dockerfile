# Usando uma imagem Node.js oficial
FROM node:18

# Criando o diretório de trabalho
WORKDIR /usr/src/app

# Copiando os arquivos de dependências
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante dos arquivos
COPY . .

# Compilando o TypeScript
RUN npm run build

# Expondo a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "node", "dist/server.js" ]
