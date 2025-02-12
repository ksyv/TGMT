// migrate-images.js
const mongoose = require('mongoose');
const Game = require('./models/gameModel'); // Adapte le chemin si nécessaire
require('dotenv').config(); // Pour charger les variables d'environnement

// Fonction pour supprimer une partie d'une chaîne
function removePrefix(originalString, prefixToRemove) {
    if (originalString.startsWith(prefixToRemove)) {
        return originalString.slice(prefixToRemove.length);
    }
    return originalString; // Retourne la chaîne originale si le préfixe n'est pas trouvé
}

async function updateImageUrls() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.DATABASE);
    console.log('Connecté à MongoDB');

    // Récupère tous les jeux
    const games = await Game.find({});

    // Parcours chaque jeu
    for (const game of games) {
      // Vérifie si le champ image existe et n'est pas vide
      if (game.image) {
          const prefixToRemove = 'http://localhost:3000'; // Adapte si URL de base différente en local
          game.image = removePrefix(game.image, prefixToRemove);
          await game.save();
          console.log(`URL de l'image mise à jour pour le jeu : ${game.name}`);
      } else {
        console.log(`Le jeu ${game.name} n'a pas d'URL d'image définie.`);
      }
    }

    console.log('Migration terminée !');
    mongoose.disconnect(); // Déconnexion

  } catch (error) {
    console.error('Erreur lors de la migration :', error);
    mongoose.disconnect();
  }
}

updateImageUrls();