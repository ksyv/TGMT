const express = require('express');
const GameController = require('../controllers/gameController');
const auth = require('../middlewares/auth');
const router = express.Router();

// Middleware pour gérer les images de jeu si nécessaire
const gameImageUpload = require('../middlewares/multer.config');

// GET - Rechercher des jeux par filtres
router.get('/search', GameController.searchGames); // Nouvelle route

// GET - Récupérer tous les jeux
router.get('/', GameController.listGames);

// GET - Récupérer un jeu par son ID
router.get('/:id', GameController.getGameById);

// POST - Créer un nouveau jeu
router.post('/', gameImageUpload, auth, GameController.createGame);

// PUT - Mettre à jour un jeu existant
router.put('/:id', gameImageUpload, auth, GameController.updateGame);

// DELETE - Supprimer un jeu
router.delete('/:id', auth, GameController.deleteGame);

module.exports = router;
