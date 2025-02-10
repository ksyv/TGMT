const express = require('express');
const router = express.Router();
const TableController = require('../controllers/tableController');
const auth = require('../middlewares/auth'); // Middleware d'authentification si nécessaire

//route pour créer une nouvelle table de jeu
router.post('/', auth, TableController.create);

//route pour récupérer toutes les tables de jeu
router.get('/', TableController.list);

//route pour récupérer une table de jeu par son ID
router.get('/:id', auth, TableController.show);

//route pour mettre à jour une table de jeu par son ID
router.put('/:id', auth, TableController.update);

//route pour supprimer une table de jeu par son ID
router.delete('/:id', auth, TableController.remove);

// Route pour récupérer les tables d'un jeu spécifique (publique)
router.get('/', TableController.list); // Pas de middleware d'authentification ici !

// Route pour s'inscrire
router.post('/:id/join', auth, TableController.joinTable); 

//route pour se désinscrire
router.post('/:id/leave', auth, TableController.leaveTable); 

module.exports = router;