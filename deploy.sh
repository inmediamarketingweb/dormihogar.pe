# #!/bin/bash

# echo "🚀 Haciendo reset y git pull en /var/www/dormihogar.pe"
# cd /var/www/dormihogar.pe || exit 1

# git reset --hard
# git clean -fd
# git pull origin main

# echo "📦 Instalando dependencias..."
# npm install

# echo "🧹 Eliminando carpeta build..."
# sudo rm -rf /var/www/dormihogar.pe/build

# echo "🏗️ Ejecutando build..."
# npm run build

# echo "🔒 Ajustando permisos..."
# sudo chown -R www-data:www-data /var/www/dormihogar.pe
# sudo chmod -R 777 /var/www/dormihogar.pe

# echo "✅ ¡Despliegue completado!"


#!/bin/bash

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

TOTAL_STEPS=7
STEP=0

progress() {
    STEP=$((STEP+1))
    local width=40
    local filled=$((STEP * width / TOTAL_STEPS))
    local empty=$((width - filled))

    printf "\n${BLUE}["
    printf "%0.s█" $(seq 1 $filled)
    printf "%0.s░" $(seq 1 $empty)
    printf "] %d%%${NC}\n" $((STEP * 100 / TOTAL_STEPS))

    echo -e "${YELLOW}$1${NC}"
}

START=$(date +%s)

cd /var/www/dormihogar.pe || exit 1

progress "🧹 Limpiando repositorio..."
git reset --hard
git clean -fd

progress "📥 Descargando cambios..."

echo
echo "Archivos que serán modificados:"
git fetch origin
git diff --name-only HEAD origin/main
echo

git pull origin main

progress "📦 Instalando dependencias..."
npm install

progress "🗑️ Eliminando build..."
sudo rm -rf build

progress "🏗️ Generando build..."
npm run build

progress "🔒 Ajustando permisos..."
sudo chown -R www-data:www-data .
sudo chmod -R 777 .

progress "✅ Finalizando..."

END=$(date +%s)
echo
echo -e "${GREEN}✔ Deploy completado en $((END-START)) segundos${NC}"
