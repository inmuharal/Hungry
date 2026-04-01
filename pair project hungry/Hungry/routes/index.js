const router = require('express').Router();
const Controller = require('../controllers/controller');
const AuthController = require('../controllers/authController');
const { isAuthenticated, isGuest } = require('../middlewares/auth');

// ========================
// AUTH ROUTES
// ========================
router.get('/login', isGuest, AuthController.loginPage);
router.post('/login', isGuest, AuthController.loginProcess);
router.get('/register', isGuest, AuthController.registerPage);
router.post('/register', isGuest, AuthController.registerProcess);
router.get('/logout', AuthController.logout);

// ========================
// PUBLIC ROUTES
// ========================
router.get('/', Controller.landingPage);

// ========================
// PROTECTED ROUTES
// ========================

// Dashboard — Orders + Menu + Driver (eager loading, 2 tables)
router.get('/gobite', isAuthenticated, Controller.dashboard);

// Menu CRUD + Search/Sort
router.get('/menu', isAuthenticated, Controller.menuList);
router.get('/menu/add', isAuthenticated, Controller.addMenuPage);
router.post('/menu/add', isAuthenticated, Controller.addMenuProcess);
router.get('/menu/edit/:id', isAuthenticated, Controller.editMenuPage);
router.post('/menu/edit/:id', isAuthenticated, Controller.editMenuProcess);
router.post('/menu/delete/:id', isAuthenticated, Controller.deleteMenu);

module.exports = router;
