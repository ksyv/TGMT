const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérifie si l'en-tête Authorization est présent
    if (req.headers.authorization) {
      // Sépare le token de l'en-tête Authorization
      const token = req.headers.authorization.split(' ')[1];
      // Vérifie et décrypte le token JWT
      const decodedToken = jwt.verify(token, process.env.SECRET);
      // Assigne l'ID utilisateur décodé à req.userId pour une utilisation ultérieure
      req.userId = decodedToken.userId;
    }

    // Passe au prochain middleware
    next();
  } catch (error) {
    // Log l'erreur d'authentification dans la console
    console.log("Erreur d'authentification:", error);

    // Retourne une réponse HTTP 401 Unauthorized avec un message d'erreur approprié
    return res.status(401).json({
      status: 401,
      message: 'Authentification échouée'
    });
  }
};
