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
          duration,
          participants: [creator] // Ajout du créateur à la liste des participants
      });

      const savedTable = await newGameTable.save();

      // Mise à jour de l'utilisateur pour inclure la nouvelle table
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
  const userId = req.user.userId; // Récupéré via le middleware d'authentification

  console.log("remove called. tableId:", tableId, "userId:", userId); // AJOUTE

  try {
      const gameTable = await GameTable.findById(tableId);
      console.log("gameTable found:", gameTable); // AJOUTE

      if (!gameTable) {
          console.log("Game table not found."); // AJOUTE
          return res.status(404).json({ error: 'Table de jeu non trouvée' });
      }

      // Vérification des autorisations (admin ou créateur)
      const user = await User.findById(userId);
      console.log("User found:", user); // AJOUTE

      if (user.role !== 'admin' && gameTable.creator.toString() !== userId) {
          console.log("User not authorized to delete."); // AJOUTE
          return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cette table.' });
      }

      console.log("Deleting game table..."); // AJOUTE

      // Suppression de la table et mise à jour des références
      await GameTable.findByIdAndDelete(tableId);

      // MISE A JOUR DES UTILISATEURS
      await User.updateMany({ gameTables: tableId }, { $pull: { gameTables: tableId } });

      console.log("Game table deleted successfully."); // AJOUTE
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
      console.log("list called, req.query:", req.query); // AJOUTE CE LOG

    if (gameId) {
      filter.game = gameId;
        console.log("Filtering by gameId:", gameId); // AJOUTE CE LOG
    }

    if (startTime && endTime) {
      filter.$or = [
          { startTime: { $lte: endTime }, endTime: { $gte: startTime } },
          { startTime: { $gte: startTime, $lte: endTime } },
          { endTime: { $gte: startTime, $lte: endTime } }
      ];
        console.log("Filtering by startTime/endTime:", startTime, endTime); // AJOUTE CE LOG
    } else if (startTime) {
      filter.startTime = { $gte: new Date(startTime) };
        console.log("Filtering by startTime:", startTime); // AJOUTE CE LOG
    } else if (endTime) {
      filter.endTime = { $lte: new Date(endTime) };
      console.log("Filtering by endTime:", endTime);
    }

    if (available) {
      filter.open = available === 'true';
      console.log("Filtering by available:", available); // AJOUTE CE LOG
      // On pourrait aussi filtrer sur le nombre de participants
    }
      console.log("Final filter:", filter);

      const gameTables = await GameTable.find(filter)
          .populate('creator', 'username')  // <--- MODIFICATION ICI :  Spécifie 'username'
          .populate('game', 'name')       // <--- et 'name'
          .populate('participants', 'username'); // et potentiellement ici aussi
      
      console.log("gameTables found:", gameTables);
    res.status(200).json( gameTables );

  } catch (err) {
    console.error('Erreur lors de la récupération des tables de jeu :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des tables de jeu' });
  }
};
const joinTable = async (req, res) => {
  const tableId = req.params.id;
  const userId = req.user.userId; // Récupère l'ID de l'utilisateur depuis le token

  try {
      const table = await GameTable.findById(tableId);
      if (!table) {
          return res.status(404).json({ error: 'Table de jeu non trouvée.' });
      }

      // Vérifie si la table est ouverte
      if (!table.open) {
          return res.status(400).json({ error: 'Les inscriptions à cette table sont fermées.' });
      }

      // Vérifier si l'utilisateur est déjà inscrit
      if (table.participants.includes(userId)) {
          return res.status(400).json({ error: 'Vous êtes déjà inscrit à cette table.' });
      }

      // Ajouter l'utilisateur à la liste des participants
      table.participants.push(userId);
      await table.save();

      res.status(200).json({ message: 'Inscription réussie.' });

  } catch (err) {
      console.error("Erreur lors de l'inscription à la table de jeu :", err);
      res.status(500).json({ error: "Erreur lors de l'inscription à la table de jeu." });
  }
};

const leaveTable = async (req, res) => {
  const tableId = req.params.id;
  const userId = req.user.userId; //On recupere l'id

  try {
      const table = await GameTable.findById(tableId);
      if (!table) {
          return res.status(404).json({ error: 'Table de jeu non trouvée.' });
      }

      // Vérifier si l'utilisateur est inscrit
      const participantIndex = table.participants.indexOf(userId);
      if (participantIndex === -1) {
          return res.status(400).json({ error: "Vous n'êtes pas inscrit à cette table." });
      }

      // Retirer l'utilisateur de la liste des participants
      table.participants.splice(participantIndex, 1); //On retire l'id de l'utilisateur du tableau
      await table.save();

      res.status(200).json({ message: 'Désinscription réussie.' });

  } catch (err) {
      console.error("Erreur lors de la désinscription de la table de jeu :", err);
      res.status(500).json({ error: "Erreur lors de la désinscription de la table de jeu." });
  }
};

module.exports = {
    create,
    show,
    update,
    remove,
    list,
    joinTable,
    leaveTable,
};