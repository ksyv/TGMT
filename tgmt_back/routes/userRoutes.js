const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth'); // Middleware d'authentification
const User = require('../models/userModel');
const sendResetMail = require('../middlewares/email.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  User.find({})
      .then(users => {
          res.status(200).json(users);
      })
      .catch(error => {
          res.status(500).json({
              message: 'Erreur lors de la récupération des utilisateurs',
              error: error.message
          });
      });
});

// POST - Inscription d'un nouvel utilisateur
router.post('/signup', UserController.signup);

// POST - Connexion de l'utilisateur
router.post('/login', UserController.login);

// POST - Vérification de l'existence de l'utilisateur
router.post('/check', UserController.check);

// GET - Récupération des informations d'un utilisateur par son ID
router.get('/userinfo/:userId', UserController.getUserInfo);

// Route pour supprimer un utilisateur (accessible uniquement aux administrateurs)
router.delete('/delete/:userId', UserController.deleteUser);

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
                role: user.role,
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

router.put('/:userId/update-role', authMiddleware, UserController.updateUserRole);


// Endpoint pour la récupération de mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Générer un jeton de réinitialisation
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });

        // Inclure le jeton dans la requête pour l'email de réinitialisation
        req.body.token = token;

        // Appeler le middleware pour envoyer l'email
        sendResetMail(req, res, () => {});
    } catch (error) {
        console.log("Error during forgot password process:", error);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
});
// Route pour réinitialiser le mot de passe
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Vérification et traitement du token et du mot de passe
  try {
      // Vérification du token JWT
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const userId = decodedToken.userId;

      // Mise à jour du mot de passe de l'utilisateur
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      res.status(400).json({ message: 'Jeton invalide ou expiré' });
  }
});
router.get('/search', async (req, res) => {
  const term = req.query.term; // Récupère le terme de recherche depuis les query parameters

  try {
    // Utilise une expression régulière pour rechercher le terme dans le nom d'utilisateur, le prénom et le nom
    const users = await User.find({
      $or: [
        { username: { $regex: term, $options: 'i' } }, // 'i' pour la recherche insensible à la casse
        { firstname: { $regex: term, $options: 'i' } },
        { lastname: { $regex: term, $options: 'i' } }
      ]
    });

    res.status(200).json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs' });
  }
});
module.exports = router;
