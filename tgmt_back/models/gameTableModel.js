const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameTableSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur qui a créé cette table
    game: { type: Schema.Types.ObjectId, ref: 'Game' }, // Référence au jeu associé à cette table (si besoin)
    startTime: { type: Date, required: true },
    open: { type: Boolean, default: true }, // Indique si la table est ouverte aux inscriptions
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Liste des utilisateurs inscrits à la table
});

module.exports = mongoose.model('GameTable', gameTableSchema);