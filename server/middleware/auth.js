const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = function authMiddleware(req, res, next) {
  // Token comes in the Authorization header as "Bearer <token>"
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded  // attach user info to the request
    next()              // move on to the actual route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}