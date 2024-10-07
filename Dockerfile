# Utilise une image Node.js de base
FROM node:18

# Crée un répertoire de travail pour l'application
WORKDIR /usr/src/app

# Copie le fichier app.js dans le conteneur
COPY . .

EXPOSE 3000

# Commande à exécuter lorsque le conteneur démarre
CMD sh -c "npm i && node slave.js"
