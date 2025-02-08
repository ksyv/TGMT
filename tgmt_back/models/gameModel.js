const { default: mongoose } = require("mongoose")
const schema = mongoose.Schema

var gameSchema = new schema({
    name: {type: String, required: true}, // Nom du jeu
    type: {type: String, required: true}, // Type de jeu (plateau, cartes, etc.)
    category: {type: String, required: true}, // Catégorie du jeu (stratégie, chance, etc.)
    ageMin: {type: Number, required: true}, // Âge minimum pour jouer
    difficulty: {type: String, required: true}, // Difficulté du jeu
    author: {type: String, required: true}, // Auteur du jeu
    playerMin: {type: Number, required: true}, // Nombre minimum de joueurs
    playerMax: {type: Number, required: true}, // Nombre maximum de joueurs
    description: {type: String, required: true}, // Description du jeu
    image: {type: String, required: true}, // URL de l'image du jeu
    partytime: {type: Number, required: true}, // Durée d'une partie en minutes
    rules: {type: String, required: true}, // lien vers Règles du jeu
    resourcesLink: {type: Array},  // Liens vers des ressources externes (autres version des règles, vidéos, etc.)
    createdAt: { // Date de création de la fiche du jeu
        type: Date,
        default: Date.now
    },
    tables: [{ // Liste des tables de jeu créées pour ce jeu
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur qui a créé la table
        startTime: { type: Date, required: true }, // Date et heure de début de la table
        open: { type: Boolean, default: true }, // Indique si la table est ouverte aux inscriptions
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Liste des utilisateurs inscrits à la table
    }]

})

module.exports = mongoose.model('Game', gameSchema)