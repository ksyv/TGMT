const GameTable = require('../models/gameTableModel');
const User = require('../models/userModel');
const Game = require('../models/gameModel'); // Importe le modèle Game


const create = async (req, res) => {
    const { creator, startTime, game, endTime, duration } = req.body;

    try {
        // Vérification de l'existence de l'utilisateur créateur
        const user = await User.findById(creator);
        if (!user) {
            return res.status(400).json({ error: "L'utilisateur créateur n'existe pas." });
        }

        // Vérification de l'existence du jeu
        const gameExists = await Game.findById(game);
        if (!gameExists) {
            return res.status(400).json({ error: "Le jeu spécifié n'existe pas." });
        }

        // Vérification des chevauchements de tables (même jeu, même heure)
        const overlappingTable = await GameTable.findOne({
            game: game,
            $or: [
                { startTime: { $lte: endTime }, endTime: { $gte: startTime } }, // Cas général
                { startTime: { $gte: startTime, $lte: endTime } }, // startTime à l'intérieur
                { endTime: { $gte: startTime, $lte: endTime } }   // endTime à l'intérieur
            ]
        });

        if (overlappingTable) {
            return res.status(400).json({ error: "Une table de jeu existe déjà pour ce jeu à cette heure." });
        }
        
        // Vérification de la durée minimale
        if(duration < gameExists.partytime){
            return res.status(400).json({ error: "La durée ne peut pas être inférieure à la durée minimale prévue pour ce jeu." });
        }
        // Création de la nouvelle table de jeu
        const newGameTable = new GameTable({
            creator,
            startTime,
            game,
            endTime,
            duration
        });

        const savedTable = await newGameTable.save();

        // Mise à jour de l'utilisateur pour inclure la nouvelle table (si nécessaire)
        await User.findByIdAndUpdate(creator, { $push: { gameTables: savedTable._id } });

        res.status(201).json({ gameTable: savedTable });

    } catch (err) {
        console.error('Erreur lors de la création de la table de jeu :', err);
        res.status(500).json({ error: 'Erreur lors de la création de la table de jeu', details: err.message });
    }
};

const show = async (req, res) => {
    const tableId = req.params.id;

    try {
        const gameTable = await GameTable.findById(tableId).populate('creator game participants'); // Populate pour récupérer les détails
        if (!gameTable) {
            return res.status(404).json({ error: 'Table de jeu non trouvée' });
        }
        res.status(200).json({ gameTable });
    } catch (err) {
        console.error('Erreur lors de la récupération de la table de jeu :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la table de jeu' });
    }
};

const update = async (req, res) => {
  const tableId = req.params.id;
  const updateData = req.body;
  const userId = req.userId; // Récupéré via le middleware d'authentification

  try {
    const gameTable = await GameTable.findById(tableId);

    if (!gameTable) {
      return res.status(404).json({ error: 'Table de jeu non trouvée' });
    }

    // Vérification des autorisations (admin ou créateur)
    const user = await User.findById(userId); // Assurez-vous que ce `User` est importé
    if (user.role !== 'admin' && gameTable.creator.toString() !== userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette table.' });
    }

    // Vérif de chevauchement
    const overlappingTable = await GameTable.findOne({
        game: updateData.game || gameTable.game, // Utilise le nouveau jeu si fourni, sinon l'ancien
        _id: { $ne: tableId }, // Exclut la table actuelle de la recherche
        $or: [
          { startTime: { $lte: updateData.endTime || gameTable.endTime}, endTime: { $gte: updateData.startTime || gameTable.startTime } }, // Cas général
          { startTime: { $gte: updateData.startTime || gameTable.startTime, $lte: updateData.endTime || gameTable.endTime} }, // startTime à l'intérieur
          { endTime: { $gte: updateData.startTime || gameTable.startTime, $lte: updateData.endTime || gameTable.endTime } }   // endTime à l'intérieur
        ]
    });

    if (overlappingTable) {
      return res.status(400).json({ error: "Une table de jeu existe déjà pour ce jeu à cette heure." });
    }

    // Empêche la modification du créateur et du jeu si l'utilisateur n'est pas admin
    if (user.role !== 'admin') {
        delete updateData.creator;
        delete updateData.game;
    }

    // Mise à jour des données de la table
    Object.assign(gameTable, updateData); // Met à jour la table *avant* la validation
    await gameTable.validate();          // Validation explicite
    const updatedTable = await gameTable.save(); // On sauvegarde les changements validés
    res.status(200).json({ updatedTable });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la table de jeu :', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la table de jeu', details: err.message });
  }
};

const remove = async (req, res) => {
    const tableId = req.params.id;
    const userId = req.userId; // Récupéré via le middleware d'authentification

    try {
        const gameTable = await GameTable.findById(tableId);
        if (!gameTable) {
            return res.status(404).json({ error: 'Table de jeu non trouvée' });
        }

        // Vérification des autorisations (admin ou créateur)
        const user = await User.findById(userId);  // Assurez-vous d'importer le modèle `User`.
        if (user.role !== 'admin' && gameTable.creator.toString() !== userId) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette table.' });
        }

        // Suppression de la table et mise à jour des références
        await GameTable.findByIdAndDelete(tableId);
        await User.updateMany({ gameTables: tableId }, { $pull: { gameTables: tableId } });

        res.status(200).json({ message: 'Table de jeu supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la table de jeu :', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la table de jeu' });
    }
};

const list = async (req, res) => {
    try {
      const { gameId, startTime, endTime, available } = req.query;
      const filter = {};
  
      if (gameId) {
        filter.game = gameId;
      }
  
      if (startTime && endTime) {
        // Filtre pour trouver les tables qui se chevauchent avec la plage horaire spécifiée
        filter.$or = [
            { startTime: { $lte: endTime }, endTime: { $gte: startTime } }, // Cas général
            { startTime: { $gte: startTime, $lte: endTime } }, // startTime à l'intérieur
            { endTime: { $gte: startTime, $lte: endTime } }   // endTime à l'intérieur
        ];
      } else if (startTime) {
        filter.startTime = { $gte: new Date(startTime) };
      } else if (endTime) {
        filter.endTime = { $lte: new Date(endTime) };
      }
  
      if (available) {
        filter.open = available === 'true'; // Convertit la chaîne en booléen
        // On pourrait aussi filtrer sur le nombre de participants :
        // if (available === 'true') { filter.participants.length < capacité maximale du jeu }
      }
  
      const gameTables = await GameTable.find(filter).populate('creator game participants');
      res.status(200).json({ gameTables });
    } catch (err) {
      console.error('Erreur lors de la récupération des tables de jeu :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des tables de jeu' });
    }
  };

module.exports = {
    create,
    show,
    update,
    remove,
    list,
};