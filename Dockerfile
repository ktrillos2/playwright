# Establecer la imagen base
FROM node:20-bullseye

# Crear el directorio de trabajo
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci --verbose

# Instalar dependencias del sistema necesarias para Playwright y Chromium
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -qO - https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg \
    && mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ \
    && wget -q https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y libxshmfence1 libgbm1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgtk-3-0 libpango-1.0-0 libcairo2 libasound2 libx11-xcb1 libxfixes3 libxrender1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Añadir Playwright al package.json antes de copiarlo, luego:
# Instalar Playwright y asegurarse de que Chromium está listo para usar
RUN npx playwright install chromium

# Copiar el resto de los archivos necesarios para la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
