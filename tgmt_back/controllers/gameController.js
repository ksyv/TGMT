// gameController.js
const Game = require('../models/Game');

exports.searchGames = (req, res) => {
  const { name, type, category, ageMin, difficulty, author, playerMin, playerMax, partytime } = req.query;
  const query = {};

  if (name) query.name = new RegExp(name, 'i');
  if (type) query.type = type;
  if (category) query.category = category;
  if (ageMin) query.ageMin = { $gte: ageMin };
  if (difficulty) query.difficulty = difficulty;
  if (author) query.author = author;
  if (playerMin) query.playerMin = { $gte: playerMin };
  if (playerMax) query.playerMax = { $lte: playerMax };
  if (partytime) query.partytime = { $lte: partytime };

  Game.find(query)
    .then(games => {
      res.status(200).json({
        status: 200,
        message: 'Jeux récupérés avec succès',
        result: games,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des jeux',
        error: error.message,
      });
    });
};
