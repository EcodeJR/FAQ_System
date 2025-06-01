module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
      console.log('Role middleware error: User is not an admin');
    }
    next();
  };