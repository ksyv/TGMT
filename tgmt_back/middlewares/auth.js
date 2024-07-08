const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userId = decodedToken.userId; // Assurez-vous que userId est correctement défini
    console.log("Utilisateur authentifié avec l'ID:", req.userId); // Ajout d'un log pour vérifier l'ID utilisateur
    next();
  } catch (error) {
    console.log("Erreur d'authentification:", error); // Log en cas d'erreur
    return res.status(401).json({
      status: 401,
      message: 'Authentification échouée'
    });
  }
};
