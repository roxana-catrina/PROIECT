const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // înlocuiește cu process.env.JWT_SECRET în producție

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token lipsă sau invalid' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Token invalid sau expirat' });
  }
};
