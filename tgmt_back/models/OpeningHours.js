const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openingHoursSchema = new Schema({
  monday: { startTime: String, endTime: String },
  tuesday: { startTime: String, endTime: String },
  wednesday: { startTime: String, endTime: String },
  thursday: { startTime: String, endTime: String },
  friday: { startTime: String, endTime: String },
  saturday: { startTime: String, endTime: String },
  sunday: { startTime: String, endTime: String },
  // Tu pourrais aussi ajouter un champ 'active' pour activer/désactiver les horaires spéciaux
}, { timestamps: true }); // Ajoute createdAt et updatedAt

module.exports = mongoose.model('OpeningHours', openingHoursSchema);