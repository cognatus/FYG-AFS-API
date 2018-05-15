var express = require('express');
var router = express.Router();

const validateSession = function (req, res, next) {
  if (req.cookies.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

const validateNoSession = function (req, res, next) {
  if (!req.cookies.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', validateNoSession, function (req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/inicio', validateSession, function (req, res, next) {
  res.render('inicio', { title: 'Inicio' });
});

router.get('/usuarios', validateSession, function (req, res, next) {
  res.render('usuarios', { title: 'Usuarios' });
});

router.get('/configuracion', validateSession, function (req, res, next) {
  res.render('configuracion', { title: 'Configuracion' });
});

module.exports = router;
