# Establecer la imagen base
FROM ghcr.io/puppeteer/puppeteer:22.0.0

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo .env
COPY .env.production .env

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm ci

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación
USER root
RUN npm run build

# Cambiar de nuevo al usuario no root (puppeteer)
USER pptruser

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]