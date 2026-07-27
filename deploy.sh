#!/bin/bash

echo "🚀 Haciendo reset y git pull en /var/www/dormihogar.pe"
cd /var/www/dormihogar.pe || exit 1

git reset --hard
git clean -fd
git pull origin main

echo "📦 Instalando dependencias..."
npm install

echo "🧹 Eliminando carpeta build..."
sudo rm -rf /var/www/dormihogar.pe/build

echo "🏗️ Ejecutando build..."
npm run build

echo "🔒 Ajustando permisos..."
sudo chown -R www-data:www-data /var/www/dormihogar.pe
sudo chmod -R 777 /var/www/dormihogar.pe

echo "✅ ¡Despliegue completado!"


!/bin/bash