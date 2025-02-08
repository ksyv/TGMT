const express = require('express');
const router = express.Router();
const TableController = require('../controllers/tableController');
const auth = require('../middlewares/auth'); // Middleware d'authentification si nécessaire

// Exemple : route pour créer une nouvelle table de jeu
router.post('/', auth, TableController.create);

// Exemple : route pour récupérer toutes les tables de jeu
router.get('/', TableController.list);

// Exemple : route pour récupérer une table de jeu par son ID
router.get('/:id', auth, TableController.show);

// Exemple : route pour mettre à jour une table de jeu par son ID
router.put('/:id', auth, TableController.update);

// Exemple : route pour supprimer une table de jeu par son ID
router.delete('/:id', auth, TableController.remove);

// Route pour récupérer les tables d'un jeu spécifique (publique)
router.get('/', TableController.list); // Pas de middleware d'authentification ici !

module.exports = router;