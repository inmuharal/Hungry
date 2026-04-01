// Middleware: Hanya user yang sudah login yang bisa akses
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect("/login");
}

// Middleware: User yang sudah login tidak boleh akses login/register lagi
function isGuest(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect("/gobite");
    }
    next();
}

module.exports = { isAuthenticated, isGuest };
