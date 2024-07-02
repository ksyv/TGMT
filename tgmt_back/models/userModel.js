const { default: mongoose } = require("mongoose")
const schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

var userSchema = new schema({
    username: {type: String, required: false},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    telephone: {type: String, required: false},
    createdAt: {
        type: Date,
        default: Date.now
    },
    gameTables: [{ type: Schema.Types.ObjectId, ref: 'GameTable' }] // Référence aux tables de jeu créées par cet utilisateur
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
