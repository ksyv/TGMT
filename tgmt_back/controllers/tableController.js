const GameTable = require('../models/gameTableModel');
const User = require('../models/userModel');

const create = (req, res) => {
    const { creator, startTime } = req.body; // Récupérer les données de la requête

    const newGameTable = new GameTable({
        creator,
        startTime,
        // Autres champs facultatifs à définir depuis req.body
    });

    newGameTable.save()
        .then(savedTable => {
            return User.findByIdAndUpdate(
                creator,
                { $push: { gameTables: savedTable._id } },
                { new: true }
            ).exec();
        })
        .then(updatedUser => {
            res.status(201).json({ gameTable: newGameTable, user: updatedUser });
        })
        .catch(err => {
            console.error('Erreur lors de la création de la table de jeu :', err);
            res.status(500).json({ error: 'Erreur lors de la création de la table de jeu' });
        });
};

const show = (req, res) => {
    const tableId = req.params.id; // Récupérer l'ID de la table à afficher

    GameTable.findById(tableId).exec()
        .then(gameTable => {
            if (!gameTable) {
                return res.status(404).json({ error: 'Table de jeu non trouvée' });
            }
            res.status(200).json({ gameTable });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération de la table de jeu :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la table de jeu' });
        });
};

const update = (req, res) => {
    const tableId = req.params.id; // Récupérer l'ID de la table à mettre à jour
    const updateData = req.body; // Récupérer les données de mise à jour depuis la requête

    GameTable.findByIdAndUpdate(tableId, updateData, { new: true }).exec()
        .then(updatedTable => {
            if (!updatedTable) {
                return res.status(404).json({ error: 'Table de jeu non trouvée' });
            }
            res.status(200).json({ updatedTable });
        })
        .catch(err => {
            console.error('Erreur lors de la mise à jour de la table de jeu :', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la table de jeu' });
        });
};

const remove = (req, res) => {
    const tableId = req.params.id; // Récupérer l'ID de la table à supprimer

    GameTable.findByIdAndDelete(tableId).exec()
        .then(deletedTable => {
            if (!deletedTable) {
                return res.status(404).json({ error: 'Table de jeu non trouvée' });
            }

            // Retirer la référence de cette table dans tous les utilisateurs qui la possèdent
            return User.updateMany({ gameTables: tableId }, { $pull: { gameTables: tableId } }).exec();
        })
        .then(() => {
            res.status(200).json({ deletedTable });
        })
        .catch(err => {
            console.error('Erreur lors de la suppression de la table de jeu :', err);
            res.status(500).json({ error: 'Erreur lors de la suppression de la table de jeu' });
        });
};

const list = (req, res) => {
    GameTable.find().exec()
        .then(gameTables => {
            res.status(200).json({ gameTables });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des tables de jeu :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des tables de jeu' });
        });
};

module.exports = {
    create,
    show,
    update,
    remove,
    list,
};