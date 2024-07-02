const { default: mongoose } = require("mongoose")
const schema = mongoose.Schema

var gameSchema = new schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    category: {type: String, required: true},
    ageMin: {type: Number, required: true},
    difficulty: {type: String, required: true},
    author: {type: String, required: true},
    playerMin: {type: Number, required: true},
    playerMax: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    partytime: {type: Number, required: true},
    rules: {type: String, required: true},
    resourcesLink: {type: Array},
    createdAt: {
        type: Date,
        default: Date.now
    },
    tables: [{
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur qui a créé la table
        startTime: { type: Date, required: true },
        open: { type: Boolean, default: true }, // Indique si la table est ouverte aux inscriptions
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Liste des utilisateurs inscrits à la table
    }]

})

module.exports = mongoose.model('Product', gameSchema)