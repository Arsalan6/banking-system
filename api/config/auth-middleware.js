const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'token missing' });
try {
 const decoded = jwt.verify(token, process.env.SECRET_KEY);
 req.customerId = decoded.customerId;
 next();
 } catch (error) {
 res.status(401).json({
    success: 0,
    response: 200,
    message: 'Authentication failed',
    data: {},
  });
 }
 };

module.exports = verifyToken;