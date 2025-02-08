// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("authMiddleware called"); // Ajout
  console.log("req.headers:", req.headers); // Ajout
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      console.log("Token:", token); // Ajout
      const decodedToken = jwt.verify(token, process.env.SECRET);
      console.log("Decoded token:", decodedToken); // Ajout
      req.user = { userId: decodedToken.userId }; // Ajoute userId à req.user
      if (decodedToken.role) {
        req.user.role = decodedToken.role; // Ajoute le rôle, si présent, à req.user
      }
    }
    next(); // APPEL À next() DANS TOUS LES CAS
  } catch (error) {
    console.log("authMiddleware - Error:", error); // LOG
    next(); // APPEL À next() MÊME EN CAS D'ERREUR
  }
};
