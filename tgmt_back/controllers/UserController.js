const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const GameTable = require('../models/gameTableModel');

module.exports = {
    // Inscription d'un nouvel utilisateur
    signup: (req, res) => {
        const { username, firstname, lastname, email, password, telephone } = req.body;
    
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    return res.status(400).json({
                        status: 400,
                        message: 'L\'utilisateur existe déjà',
                    });
                }
    
                bcrypt.hash(password, 10)
                    .then(hash => {
                        const newUser = new User({
                            username: username,
                            firstname: firstname,
                            lastname: lastname,
                            email: email,
                            password: hash,
                            telephone: telephone
                        });
    
                        newUser.save()
                            .then(savedUser => {
                                res.status(201).json({
                                    status: 201,
                                    message: 'Utilisateur créé avec succès',
                                    result: savedUser,
                                });
                            })
                            .catch(error => {
                                res.status(500).json({
                                    status: 500,
                                    message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
                                    error: error.message,
                                });
                            });
                    })
                    .catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: 'Erreur lors du hashage du mot de passe',
                            error: error.message,
                        });
                    });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Erreur lors de la vérification de l\'utilisateur existant',
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

                        const token = jwt.sign(
                            { userId: user._id },
                            process.env.SECRET,
                            { expiresIn: '24h' }
                        );

                        return res.status(200).json({
                            status: 200,
                            message: 'Authentication successful',
                            userId: user._id,
                            token: token,
                            role: user.role, // Retourner le rôle de l'utilisateur
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
    // GET - Récupération des informations d'un utilisateur par son ID
    getUserInfo: (req, res) => {
        const userId = req.params.userId;

        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        status: 404,
                        message: 'User not found',
                    });
                }
                res.status(200).json({
                    status: 200,
                    message: 'User info retrieved successfully',
                    role: user.role,
                    result: user,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when getting user info',
                    error: error.message,
                });
            });
    },
    // Récupérer un utilisateur par son ID
    getUserById: (userId) => {
        return User.findById(userId);
    },
    updateUser: async (req, res) => {
        console.log("Méthode updateUser appelée");
        const userId = req.userId; // Supposons que l'ID de l'utilisateur est accessible via req.userId
        console.log("ID utilisateur:", userId);
        const { username, firstname, lastname, email, telephone, password } = req.body;
        console.log("Données reçues:", req.body);
    
        try {
            // Trouver l'utilisateur par ID
            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'Utilisateur non trouvé',
                });
            }
            console.log("Utilisateur trouvé:", user);
    
            // Mettre à jour les champs
            user.username = username || user.username;
            user.firstname = firstname || user.firstname;
            user.lastname = lastname || user.lastname;
            user.email = email || user.email;
            user.telephone = telephone || user.telephone;
    
            // Si un mot de passe est fourni, le hacher avant de mettre à jour
            if (password) {
                user.password = await bcrypt.hash(password, 10);
                console.log("Mot de passe haché:", user.password);
            }
    
            // Sauvegarder l'utilisateur mis à jour
            await user.save();
            console.log("Utilisateur mis à jour:", user);
    
            // Retourner les informations mises à jour de l'utilisateur
            res.status(200).json({
                status: 200,
                message: 'Informations utilisateur mises à jour avec succès',
                result: user,
            });
        } catch (error) {
            console.log("Erreur lors de la mise à jour:", error);
            res.status(500).json({
                status: 500,
                message: 'Erreur lors de la mise à jour des informations utilisateur',
                error: error.message,
            });
        }
    },
    updateUserRole: async (req, res) => {
        const userId = req.params.userId;
        const { role } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Mettre à jour le rôle de l'utilisateur
            user.role = role || user.role;

            // Sauvegarder l'utilisateur mis à jour
            await user.save();

            res.status(200).json({ message: 'User role updated successfully', user });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    },

    // Supprimer un utilisateur par son ID
    deleteUser: async (req, res) => {
        try {
            let userId = req.params.userId; // Récupère l'ID depuis les paramètres de l'URL
            let isAdmin = false;
    
            // Vérifie si un rôle est présent dans le token
            if (req.user && req.user.role) {
                isAdmin = req.user.role === 'admin';
            }
    
            // Si l'ID utilisateur n'est pas fourni dans l'URL, utiliser l'ID du token
            if (!userId && req.userId) {
                userId = req.userId;
            }
            
            // Vérification des autorisations
            if (!isAdmin && userId !== req.userId) {
                return res.status(403).json({
                status: 403,
                message: "Vous n'êtes pas autorisé à effectuer cette action.",
                });
            }
    
            // Vérifier si l'utilisateur existe
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                status: 404,
                message: 'Utilisateur non trouvé',
                });
            }
    
            // Supprimer les données associées à l'utilisateur (à adapter en fonction de ta structure de données)
            // Par exemple, si tu as une collection 'GameTable' :
            await GameTable.deleteMany({ creator: userId });
    
            // Supprimer l'utilisateur
            await User.findByIdAndDelete(userId);
    
            res.status(200).json({
                status: 200,
                message: 'Compte utilisateur et données associées supprimés avec succès',
            });
        } catch (error) {
            console.error('Erreur lors de la suppression du compte utilisateur:', error);
            res.status(500).json({
                status: 500,
                message: 'Erreur lors de la suppression du compte utilisateur',
                error: error.message,
            });
        }
    },
    

};
