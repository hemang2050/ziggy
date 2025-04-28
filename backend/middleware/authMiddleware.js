import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Note: header names are case-insensitive
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id; // Attach user ID to request object
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
    