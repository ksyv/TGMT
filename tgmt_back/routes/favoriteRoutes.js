const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Endpoint pour marquer un jeu comme favori
router.post('/', async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ userId, gameId });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Game is already a favorite' });
    }

    const newFavorite = new Favorite({ userId, gameId });
    await newFavorite.save();

    res.status(201).json({ message: 'Game marked as favorite' });
  } catch (err) {
    console.error('Error marking game as favorite:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint pour ajouter un jeu aux favoris de l'utilisateur actuel
router.post('/add-to-favorites', async (req, res) => {
  const { userId, gameId } = req.body; // Assure-toi que userId est récupéré correctement

  try {
    const existingFavorite = await Favorite.findOne({ userId, gameId });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Game is already a favorite' });
    }

    const newFavorite = new Favorite({ userId, gameId });
    await newFavorite.save();

    res.status(201).json({ message: 'Game added to favorites' });
  } catch (err) {
    console.error('Error adding game to favorites:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const favorites = await Favorite.find({ userId: userId }).populate('gameId').exec();
    res.send(favorites);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching favorites' });
  }
});
router.post('/is-favorite', async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ userId, gameId });

    if (existingFavorite) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (err) {
    console.error('Error checking favorite status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/remove-from-favorites', async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    const deletedFavorite = await Favorite.findOneAndDelete({ userId, gameId });

    if (!deletedFavorite) {
      return res.status(400).json({ message: 'Game is not in favorites' });
    }

    res.status(200).json({ message: 'Game removed from favorites' });
  } catch (err) {
    console.error('Error removing game from favorites:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
