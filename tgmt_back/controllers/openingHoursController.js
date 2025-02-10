const OpeningHours = require('../models/OpeningHours');

const getOpeningHours = async (req, res) => {
    try {
      let hours = await OpeningHours.findOne(); // Récupère les horaires.  On suppose qu'il n'y a qu'un seul document.
          console.log("Horaires récupérés (avant création éventuelle) :", hours); // AJOUTE
  
          if (!hours) {
            // S'il n'y a pas encore d'horaires, on en crée un avec des valeurs par défaut.
              hours = new OpeningHours({
                monday: { startTime: "09:00", endTime: "23:00" },
                tuesday: { startTime: "09:00", endTime: "23:00" },
                wednesday: { startTime: "09:00", endTime: "23:00" },
                thursday: { startTime: "09:00", endTime: "23:00" },
                friday: { startTime: "09:00", endTime: "23:00" },
                saturday: { startTime: "09:00", endTime: "23:00" },
                sunday: { startTime: "14:00", endTime: "22:00" } // Valeurs par défaut
              });
  
              await hours.save();
              console.log("Horaires créés par défaut :", hours); // AJOUTE
          }
  
          console.log("Horaires renvoyés :", hours); // AJOUTE
      res.status(200).json(hours); // Renvoie l'objet DIRECTEMENT
  
    } catch (error) {
      console.error("Erreur lors de la récupération des horaires:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des horaires." });
    }
  };

const updateOpeningHours = async (req, res) => {
    try {
        const updatedHours = await OpeningHours.findOneAndUpdate({}, req.body, { new: true, upsert: true }); //Crée si ça n'existe pas
        res.status(200).json(updatedHours);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour des horaires." });
    }
};

module.exports = {
    getOpeningHours,
    updateOpeningHours
};
