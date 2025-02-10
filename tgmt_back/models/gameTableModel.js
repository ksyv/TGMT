const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameTableSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ajout de 'required'
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true }, // Ajout de 'required'
    startTime: { type: Date, required: true, default: Date.now }, // Ajout d'une valeur par défaut
    endTime: { type: Date, required: true },
    duration: {type: Number, required: true},
    open: { type: Boolean, default: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: { type: Number, required: true }, // Ajoute ce champ
});

// Validation personnalisée pour endTime
gameTableSchema.path('endTime').validate(function(value) {
    return this.startTime <= value; // 'this' fait référence au document en cours de validation
}, 'La date et l\'heure de fin doivent être postérieures à la date et l\'heure de début.');

module.exports = mongoose.model('GameTable', gameTableSchema);