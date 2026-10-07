module.exports = (req, res, next) => {
  req.session.user = req.session.user || { id: 1, name: "Admin" };
  res.locals.user = req.session.user;
  next();
};
