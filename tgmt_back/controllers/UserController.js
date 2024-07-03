const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const GameTable = require('../models/gameTableModel');

module.exports = {
    // Inscription d'un nouvel utilisateur
    signup: (req, res) => {
        bcrypt.hash(req.body.password, 10)
            .then((hash) => {
                const newUser = new User({
                    email: req.body.email,
                    password: hash,
                });

                return newUser.save();
            })
            .then((user) => {
                return res.status(201).json({
                    status: 201,
                    message: 'User created',
                    result: user,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: 500,
                    message: 'Error when creating user',
                    error: error.message,
                });
            });
    },

    // Connexion de l'utilisateur
    login: (req, res) => {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Authentication failed',
                    });
                }

                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            return res.status(401).json({
                                status: 401,
                                message: 'Wrong password',
                            });
                        }

                        return res.status(200).json({
                            status: 200,
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.SECRET,
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            status: 500,
                            message: 'Error when comparing passwords',
                            error: error.message,
                        });
                    });
            })
            .catch((error) => {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found',
                    error: error.message,
                });
            });
    },

    // Vérification de l'existence de l'utilisateur
    check: (req, res) => {
        const { email } = req.body;

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        status: 404,
                        message: 'User not found',
                    });
                }
                res.status(200).json({
                    status: 200,
                    message: 'User found',
                    result: user,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when checking user',
                    error: error.message,
                });
            });
    },

    // Créer une table de jeu pour un utilisateur spécifique
    createGameTable: (req, res) => {
        const { userId, startTime } = req.body;

        const newGameTable = new GameTable({
            creator: userId, // ID de l'utilisateur créateur
            startTime: new Date(startTime), // Convertir en objet Date
            // Autres champs de la table de jeu à définir
        });

        newGameTable.save()
            .then(savedTable => {
                // Mettre à jour également l'utilisateur pour inclure cette table dans sa liste de gameTables
                return User.findByIdAndUpdate(userId, { $push: { gameTables: savedTable._id } }, { new: true });
            })
            .then(updatedUser => {
                return res.status(201).json({
                    status: 201,
                    message: 'Game table created successfully',
                    result: savedTable,
                });
            })
            .catch(error => {
                return res.status(500).json({
                    status: 500,
                    message: 'Error when creating game table',
                    error: error
                });
            });
    },

    // Récupérer les tables de jeu d'un utilisateur spécifique
    getUserGameTables: (req, res) => {
        const userId = req.params.userId;

        User.findById(userId)
            .populate('gameTables') // Si vous avez une référence à 'gameTables' dans votre modèle User
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        status: 404,
                        message: 'User not found',
                    });
                }
                res.status(200).json({
                    status: 200,
                    message: 'Game tables retrieved successfully',
                    result: user.gameTables,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when getting user game tables',
                    error: error.message,
                });
            });
    },
};