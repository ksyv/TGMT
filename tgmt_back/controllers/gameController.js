const { json } = require('express');
const Game = require('../models/gameModel');
const User = require('../models/userModel');
const fs = require('fs')

module.exports = {
    // Récupérer tous les jeux
    listGames: (req, res) => {
        Game.find()
            .then(games => {
                res.status(200).json({
                    status: 200,
                    message: 'Games retrieved successfully',
                    result: games,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when retrieving games',
                    error: error.message,
                });
            });
    },

    // Récupérer un jeu par son ID
    getGameById: (req, res) => {
        const gameId = req.params.id;

        Game.findById(gameId)
            .then(game => {
                if (!game) {
                    return res.status(404).json({
                        status: 404,
                        message: 'Game not found',
                    });
                }
                res.status(200).json({
                    status: 200,
                    message: 'Game retrieved successfully',
                    result: game,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when retrieving game',
                    error: error.message,
                });
            });
    },

    // Créer un nouveau jeu
    createGame: (req, res) => {
        if (!req.file) {
            return res.status(500).json({
                status: 500,
                message: 'Image is required',
            });
        }
        var game= req.body;
        delete game._id;

        var newGame = new Game({
            ...game,
            image : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        newGame.save()
            .then(savedGame => {
                res.status(201).json({
                    status: 201,
                    message: 'Game created successfully',
                    result: savedGame,
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when creating game',
                    error: error.message,
                });
            });
    },

    // Mettre à jour un jeu existant
    updateGame: (req, res) => {
        const gameId = req.params.id;
        var gameData = req.body;

        if (req.file) {
            // Mise à jour avec une nouvelle image
            Game.findById(gameId, { image: 1 })
                .then(foundGame => {
                    if (!foundGame) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Game not found',
                        });
                    }

                    // Supprimer l'ancienne image
                    const oldImage = foundGame.image.split('/images/')[1];
                    fs.unlinkSync(`public/images/${oldImage}`);

                    // Mettre à jour avec la nouvelle image
                    gameData.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    return Game.findByIdAndUpdate(gameId, gameData, { new: true });
                })
                .then(updatedGame => {
                    if (!updatedGame) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Game not found',
                        });
                    }
                    res.status(200).json({
                        status: 200,
                        message: 'Game updated successfully',
                        result: updatedGame,
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        status: 500,
                        message: 'Error when updating game',
                        error: error.message,
                    });
                });
        } else {
            // Mise à jour sans nouvelle image
            Game.findByIdAndUpdate(gameId, gameData, { new: true })
                .then(updatedGame => {
                    if (!updatedGame) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Game not found',
                        });
                    }
                    res.status(200).json({
                        status: 200,
                        message: 'Game updated successfully',
                        result: updatedGame,
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        status: 500,
                        message: 'Error when updating game',
                        error: error.message,
                    });
                });
        }
    },

    // Supprimer un jeu
    deleteGame: (req, res) => {
        const gameId = req.params.id;

        Game.findByIdAndDelete(gameId)
            .then(deletedGame => {
                if (!deletedGame) {
                    return res.status(404).json({
                        status: 404,
                        message: 'Game not found',
                    });
                }
                res.status(200).json({
                    status: 200,
                    message: 'Game deleted successfully',
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: 'Error when deleting game',
                    error: error.message,
                });
            });
    },
};