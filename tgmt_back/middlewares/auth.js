const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid user ID',
            });
        } else {
            next();
        }
    } catch (error){
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}