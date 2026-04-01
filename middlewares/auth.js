const { normalizeRole } = require("../helpers/role");

function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login?error=Please login first");
  }
  next();
}

function isGuest(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/menus");
  }
  next();
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    const rawRole = req.session.role;
    const normalizedRole = normalizeRole(req.session.role);
    if (!roles.includes(rawRole) && !roles.includes(normalizedRole)) {
      return res.redirect("/menus?error=Akses ditolak untuk role kamu");
    }
    next();
  };
}

module.exports = { isLoggedIn, isGuest, authorizeRole };
