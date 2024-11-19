# Usar la imagen oficial de Node.js
FROM node:16

# Crear y configurar el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos del proyecto
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código al contenedor
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar la app
CMD ["node", "index.js"]
