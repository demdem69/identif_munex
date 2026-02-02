
@echo off
title EOD Master - Lanceur Local
echo ------------------------------------------
echo    EOD MASTER - DEMARRAGE LOCAL (WIN)    
echo ------------------------------------------

:: Vérification de Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe.
    echo Veuillez l'installer depuis https://nodejs.org/
    pause
    exit
)

:: Installation des dépendances si nécessaire
if not exist "node_modules\" (
    echo Installation des outils de developpement...
    call npm install
)

:: Lancement du serveur
echo Lancement du serveur sur http://localhost:5173 ...
npx vite --open

pause
