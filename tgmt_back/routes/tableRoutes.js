const express = require('express');
const router = express.Router();
const TableController = require('../controllers/tableController');
const auth = require('../middlewares/auth'); // Middleware d'authentification si nécessaire

// Exemple : route pour créer une nouvelle table de jeu
router.post('/', auth, TableController.create);

// Exemple : route pour récupérer toutes les tables de jeu
router.get('/', auth, TableController.list);

// Exemple : route pour récupérer une table de jeu par son ID
router.get('/:id', auth, TableController.show);

// Exemple : route pour mettre à jour une table de jeu par son ID
router.put('/:id', auth, TableController.update);

// Exemple : route pour supprimer une table de jeu par son ID
router.delete('/:id', auth, TableController.remove);

module.exports = router;