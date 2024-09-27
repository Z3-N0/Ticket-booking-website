function verifyAdminApiKey(req, res, next) {
    const adminApiKey = req.headers['x-api-key'];
    
    if (adminApiKey === process.env.ADMIN_API_KEY) {
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  }
  
  module.exports = { verifyAdminApiKey };
  