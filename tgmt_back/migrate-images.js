// migrate-images.js
const mongoose = require('mongoose');
const Game = require('./models/gameModel'); // Adapte le chemin si nécessaire
require('dotenv').config(); // Pour charger les variables d'environnement

// NOUVELLE FONCTION pour construire l'URL absolue
function buildAbsoluteUrl(relativePath) {
  // Remplace avec l'URL de TON backend Render + /images/
  const baseUrl = 'https://tgmt-backend.onrender.com/images/';
  return baseUrl + relativePath.substring(relativePath.lastIndexOf("/") + 1); //Garde uniquement le nom de l'image
}

async function updateImageUrls() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.DATABASE); // Utilise process.env.DATABASE
    console.log('Connecté à MongoDB');

    // Récupère tous les jeux
    const games = await Game.find({});

    // Parcours chaque jeu
    for (const game of games) {
      // Vérifie si le champ image existe et n'est pas vide
      if (game.image && typeof game.image === 'string') { // Vérifie que c'est une chaîne
        //const prefixToRemove = 'http://localhost:3000'; //  SUPPRIMER
        //game.image = game.image.slice(prefixToRemove.length); // SUPPRIMER

        // Nouvelle URL absolue :
        game.image = buildAbsoluteUrl(game.image); //  <--  Utilise la fonction

        await game.save();
        console.log(`URL de l'image mise à jour pour le jeu : ${game.name}`);
      } else {
        console.log(`Le jeu ${game.name} n'a pas d'URL d'image définie.`);
      }
    }

    console.log('Migration terminée !');


  } catch (error) {
    console.error('Erreur lors de la migration :', error);
  } finally{
    mongoose.disconnect(); // Déconnexion DANS TOUS LES CAS
  }
}

updateImageUrls();