const GameTable = require('../models/gameTableModel');
const User = require('../models/userModel');
const Game = require('../models/gameModel');
const OpeningHours = require('../models/OpeningHours'); // Assure-toi d'avoir ce modèle !

const create = async (req, res) => {
    const { creator, startTime, game, endTime, duration, maxParticipants } = req.body;

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

        // Récupération des horaires d'ouverture
          const openingHours = await OpeningHours.findOne(); // On récupère les horaires.
          if (!openingHours) {
              // Gère le cas où il n'y a pas d'horaires
              return res.status(500).json({ error: "Horaires d'ouverture non définis." });
          }

          // Validation des horaires
          const start = new Date(startTime);
          const end = new Date(endTime);
          const dayOfWeek = start.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // Récupère le jour de la semaine en anglais et en minuscule

          const daySchedule = openingHours[dayOfWeek];

          if (!daySchedule) {
              return res.status(400).json({ error: `Aucun horaire prévu pour le ${dayOfWeek}.` });
          }

          const [startHour, startMinute] = daySchedule.startTime.split(':');
          const [endHour, endMinute] = daySchedule.endTime.split(':');

          const openingTime = new Date(start); // Crée une copie pour ne pas modifier startTime
          openingTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0); // Définit l'heure d'ouverture

          const closingTime = new Date(start); //Crée une copie
          closingTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
            // Gère le cas où l'heure de fermeture est le lendemain
          if (closingTime < openingTime) {
              closingTime.setDate(closingTime.getDate() + 1);
          }
            //Si on est le lendemain, on verifie que l'heure de fin est bien le lendemain aussi
            if(start.getDate() !== end.getDate()){
                if(end.getDate() -1 !== start.getDate()){
                  return res.status(400).json({ error: 'La date de fin doit être le lendemain de la date de début si le créneau est à cheval sur minuit.' });
                }
            }
          if (start < openingTime || end > closingTime) {
            return res.status(400).json({ error: `La table doit être réservée pendant les heures d'ouverture (${daySchedule.startTime} - ${daySchedule.endTime}).` });
          }

        // Vérification de la durée minimale (après la validation des horaires)
        if(duration < gameExists.partytime){
            return res.status(400).json({ error: "La durée ne peut pas être inférieure à la durée minimale prévue pour ce jeu." });
        }
        // Vérification du nombre de participants
        if (maxParticipants < gameExists.playerMin || maxParticipants > gameExists.playerMax) {
            return res.status(400).json({ error: `Le nombre maximum de participants doit être compris entre ${gameExists.playerMin} et ${gameExists.playerMax}.` });
        }


        // Création de la nouvelle table de jeu
        const newGameTable = new GameTable({
            creator,
            startTime: start, // Utilise l'objet Date
            game,
            endTime: end, // Utilise l'objet Date
            duration,
            participants: [creator],
            maxParticipants, // Ajoute le champ
            open: true,
        });

        const savedTable = await newGameTable.save();

        // Mise à jour de l'utilisateur
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
        const gameTable = await GameTable.findById(tableId)
            .populate('creator', 'username')
            .populate('game', 'name playerMin playerMax image')
            .populate('participants', 'username');

        if (!gameTable) {
            return res.status(404).json({ error: 'Table de jeu non trouvée' });
        }
        res.status(200).json(gameTable); // Renvoie directement l'objet

    } catch (err) {
        console.error('Erreur lors de la récupération de la table de jeu :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la table de jeu' });
    }
};

const update = async (req, res) => {
    const tableId = req.params.id;
    const updateData = req.body;
    const userId = req.user.userId; // Récupéré via le middleware d'authentification

    try {
        const gameTable = await GameTable.findById(tableId);

        if (!gameTable) {
            return res.status(404).json({ error: 'Table de jeu non trouvée' });
        }

        // Vérification des autorisations (admin ou créateur)
        const user = await User.findById(userId);
        if (user.role !== 'admin' && gameTable.creator.toString() !== userId) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette table.' });
        }

        // Vérif de la durée minimale
        if(updateData.duration && updateData.duration < gameTable.game.partytime){
            return res.status(400).json({ error: "La durée ne peut pas être inférieure à la durée minimale prévue pour ce jeu." });
        }

        // Vérif du nombre de participants
        if (updateData.maxParticipants && (updateData.maxParticipants < gameTable.game.playerMin || updateData.maxParticipants > gameTable.game.playerMax)) {
            return res.status(400).json({ error: `Le nombre maximum de participants doit être compris entre ${gameTable.game.playerMin} et ${gameTable.game.playerMax}.` });
        }

        // Récupération des horaires d'ouverture pour la validation (si startTime ou endTime sont modifiés)
        if(updateData.startTime || updateData.endTime){
            const openingHours = await OpeningHours.findOne();
            if (!openingHours) {
                return res.status(500).json({ error: "Horaires d'ouverture non définis." });
            }

            const start = new Date(updateData.startTime || gameTable.startTime); // Utilise les nouvelles valeurs ou les anciennes
            const end = new Date(updateData.endTime || gameTable.endTime);
            const dayOfWeek = start.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const daySchedule = openingHours[dayOfWeek];

            if (!daySchedule) {
                return res.status(400).json({ error: `Aucun horaire prévu pour le ${dayOfWeek}.` });
            }

            const [startHour, startMinute] = daySchedule.startTime.split(':');
            const [endHour, endMinute] = daySchedule.endTime.split(':');

            const openingTime = new Date(start);
            openingTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

            const closingTime = new Date(start);
            closingTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);
            if (closingTime < openingTime) {
                closingTime.setDate(closingTime.getDate() + 1);
            }
              if(start.getDate() !== end.getDate()){
                if(end.getDate() -1 !== start.getDate()){
                  return res.status(400).json({ error: 'La date de fin doit être le lendemain de la date de début si le créneau est à cheval sur minuit.' });
                }
            }

            if (start < openingTime || end > closingTime) {
                return res.status(400).json({ error: `La table doit être réservée pendant les heures d'ouverture (${daySchedule.startTime} - ${daySchedule.endTime}).` });
            }
        }

        // Vérif de chevauchement
        const overlappingTable = await GameTable.findOne({
            game: updateData.game || gameTable.game,
            _id: { $ne: tableId },
            $or: [
                { startTime: { $lte: updateData.endTime || gameTable.endTime}, endTime: { $gte: updateData.startTime || gameTable.startTime } },
                { startTime: { $gte: updateData.startTime || gameTable.startTime, $lte: updateData.endTime || gameTable.endTime} },
                { endTime: { $gte: updateData.startTime || gameTable.startTime, $lte: updateData.endTime || gameTable.endTime } }
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
      const filter  = {};
  
      if (gameId) {
        filter.game = gameId;
      }
  
      if (startTime && endTime) {
        filter.$or = [
          { startTime: { $lte: endTime }, endTime: { $gte: startTime } },
          { startTime: { $gte: startTime, $lte: endTime } },
          { endTime: { $gte: startTime, $lte: endTime } }
        ];
      } else if (startTime) {
        filter.startTime = { $gte: new Date(startTime) };
      } else if (endTime) {
        filter.endTime = { $lte: new Date(endTime) };
      } else {
        filter.startTime = { $gte: new Date() };
      }
  
      if (available) {
          // Simplification :  Si available est défini, on filtre.  Pas besoin de conversion en booléen.
          filter.open = available === 'true';  // Convertit 'true'/'false' en booléen
      }
  
      const gameTables = await GameTable.find(filter)
        .populate('creator', 'username')
        .populate('game', 'name playerMin playerMax image')
        .populate('participants', 'username')
        .sort({ startTime: 1 });
  
      res.status(200).json(gameTables); // Simplification : envoie directement le tableau
  
    } catch (err) {
      console.error('Erreur lors de la récupération des tables de jeu :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des tables de jeu' });
    }
  };

const joinTable = async (req, res) => {
    const tableId = req.params.id;
    const userId = req.user.userId;

    try {
        const table = await GameTable.findById(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table de jeu non trouvée.' });
        }

        if (!table.open) {
            return res.status(400).json({ error: 'Les inscriptions à cette table sont fermées.' });
        }

        if (table.participants.includes(userId)) {
            return res.status(400).json({ error: 'Vous êtes déjà inscrit à cette table.' });
        }

        // Vérification du nombre maximum de participants
        if (table.participants.length >= table.maxParticipants) {
            return res.status(400).json({ error: 'Le nombre maximum de participants est atteint.' });
        }

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