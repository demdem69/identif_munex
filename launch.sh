
#!/bin/bash

# Script de lancement EOD Master pour macOS / Linux
echo "------------------------------------------"
echo "   EOD MASTER - DEMARRAGE LOCAL (UNIX)    "
echo "------------------------------------------"

# Vérification de Node.js
if ! command -v node &> /dev/null
then
    echo "ERREUR: Node.js n'est pas installé."
    echo "Veuillez l'installer depuis https://nodejs.org/"
    exit
fi

# Installation/Mise à jour des dépendances
echo "Vérification des outils (Vite, React)..."
npm install

# Lancement du serveur
echo "Lancement du serveur sur http://localhost:5173 ..."
npm run dev
