const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
    res.status(200).send('Users endpoint. Use /signup, /login, /check, etc.');
});
// POST - Inscription d'un nouvel utilisateur
router.post('/signup', UserController.signup);

// POST - Connexion de l'utilisateur
router.post('/login', UserController.login);

// POST - Vérification de l'existence de l'utilisateur
router.post('/check', UserController.check);

// POST - Création d'une table de jeu pour un utilisateur spécifique
router.post('/create-game-table', UserController.createGameTable);

// GET - Récupération des tables de jeu d'un utilisateur spécifique
router.get('/:userId/game-tables', UserController.getUserGameTables);

module.exports = router;