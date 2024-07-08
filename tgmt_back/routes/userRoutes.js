const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth'); // Middleware d'authentification
const User = require('../models/userModel');

router.get('/', (req, res) => {
    res.status(200).send('Users endpoint. Use /signup, /login, /check, etc.');
});

// POST - Inscription d'un nouvel utilisateur
router.post('/signup', UserController.signup);

// POST - Connexion de l'utilisateur
router.post('/login', UserController.login);

// POST - Vérification de l'existence de l'utilisateur
router.post('/check', UserController.check);

// GET - Récupération des informations d'un utilisateur par son ID
router.get('/userinfo/:userId', UserController.getUserInfo);

// Middleware d'authentification pour les routes suivantes
router.use(authMiddleware);

// GET - Récupération des informations de l'utilisateur actuellement authentifié
router.get('/current', authMiddleware, (req, res) => {
    const userId = req.userId; // Obtenez l'ID de l'utilisateur à partir du middleware d'authentification

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
            // Retournez les informations pertinentes de l'utilisateur
            res.status(200).json({
                _id: user._id,
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                telephone: user.telephone,
                // Ajoutez d'autres champs si nécessaire
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des informations utilisateur', error);
            res.status(500).json({ message: "Erreur serveur" });
        });
});

// POST - Création d'une table de jeu pour un utilisateur spécifique
router.post('/create-game-table', UserController.createGameTable);

// GET - Récupération des tables de jeu d'un utilisateur spécifique
router.get('/:userId/game-tables', UserController.getUserGameTables);

router.put('/current', authMiddleware, UserController.updateUser);

module.exports = router;
