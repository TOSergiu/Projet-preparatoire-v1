# Projet-preparatoire-v1

## Nom du cours: Projet d'approfondissement en sciences informatiques

## Numéro de groupe: A02

## Membres du groupe:

-Sergiu Todoran 
-Geoffroy Reniers
-Wu Zhuolin

## Date: 25/11/2025

## Intitulé du projet: Création de site internet 

## Le but du projet est de créer un site internet s'inspirant du site "FixMyStreet.brussels"(http://fixmystreet.brussels/) pour Ottignies-Louvain-la-Neuve. 

## Technologies utilisées: HTML, CSS, JavaScript, NodeJS, MongoDB et Gherkin

## Installation et exécution du projet

-Prérequis à installer dans le terminal:
    -Utilisez la commande suivante afin d'installer tout les modules requis: npm install
        Cela installera notamment :
        express — serveur web
        ejs — moteur de templates
        dotenv — variables d'environnement
        bcrypt — hachage des mots de passe
        cookie-session / express-session — gestion des sessions
        mongoose (si utilisé) — gestion de la base de données
        ainsi que tous les autres modules listés dans package.json

-Pour démarrer le site: 
    -node main.js: cette phrase apparaitera dans le terminal:  
        Serveur démarré sur http://localhost:3000. Cliquez sur le lien pour ouvrir le site 

-Pour executer les tests:
    -Ecrivez dans le terminal: npm install --save-dev cross-env
    -Puis exécutez les tests avec cette commande: npm test
    

### Description des fichiers:

-Views:

    -Home: Page d’accueil du site, avec un bouton pour signaler un incident.

    -Incident: page permettant de commencer le signalement d’un incident.

    -Log_in: page de connexion.

    -Sign_up: page de création de compte.

    -Fonctionnalités communes entre les fichiers: Dans chaque page on retrouve un bouton en haut à droite pour accéder à la page de connexion ou de création de compte lorsque l'on est déjà sur la page de connexion. Dans chaque page à l'exception de la page Home, on peut retourner au début du site en cliquant le logo "Street SOS"

-main.js: Point d’entrée du serveur Node.js. Contient la configuration du serveur et les routes principales.

-checkInput.js: Contient les fonctions de validation des données (nom, mot de passe, email, etc.).

-Dossier tests/:
    -home.test.js : teste les routes liées à la page d’accueil.
    -incident.test.js : teste la validité du nom, mot de passe et email pour un incident.
    -log_in.test.js : teste les règles nécessaires pour la connexion.
    -main.test.js : vérifie que le serveur démarre correctement.
    -searchbar.test.js : teste que la barre de recherche renvoie bien les résultats attendus.
    -sign_up.test.js : teste les prérequis pour la création d’un compte.
    -user.test.js : vérifie que nom, mot de passe et email respectent les contraintes définies.
