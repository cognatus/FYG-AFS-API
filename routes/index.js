var express = require('express');
var router = express.Router();

//el middleware de validacion para los que tienen sesion
const validateSession = function (req, res, next) {
  if (req.cookies.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

//el middleware de validacion para los que NO tienen sesion
const validateNoSession = function (req, res, next) {
  if (!req.cookies.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* Estos son las URL de las paginas con las respectivas views que se muestran
  a todos se les pasa el titulo de dicha pagina
*/
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

router.get('/archivos/:rubro', validateSession, function (req, res, next) {
  res.render('archivos', { title: 'Archivos' });
});

router.get('/bitacora', validateSession, function (req, res, next) {
  res.render('bitacora', { title: 'Bitacora' });
});

module.exports = router;
