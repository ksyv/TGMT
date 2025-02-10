const express = require('express');
const router = express.Router();
const openingHoursController = require('../controllers/openingHoursController'); // Adapte le chemin
const auth = require('../middlewares/auth'); // Pour protéger la route de mise à jour

router.get('/', openingHoursController.getOpeningHours); // Route publique pour récupérer les horaires
router.put('/', auth, openingHoursController.updateOpeningHours); // Route protégée pour mettre à jour les horaires (admin)

module.exports = router;