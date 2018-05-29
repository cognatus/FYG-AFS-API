var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var files = require('../controllers/files');
var sql = require('mssql/msnodesqlv8');

//config to dbsqlserver a la base de datos fyg-afs-admin
//esto con windows authentication
var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={LAPTOP-TFBR1QTP};Database={fyg-afs-admin};Trusted_Connection={yes};',
};

sql.connect(config)
  .then(function () {
    console.log('Conectado')
  })
  .catch(function (err) {
    console.log(err);
  });

//En las siguientes, definimos las rutas del API con sus respetivos metodos y pasandoles la conexion a la DB

router.route('/login')
  .post(function (req, res, next) {
    user.login(req, res, next, sql);
  })
  .delete(function (req, res, next) {
    req.session.usuario = undefined;
  });

router.route('/user')
  .get(function (req, res, next) {
    user.getUsers(req, res, next, sql);
  })
  .post(function (req, res, next) {
    user.registro(req, res, next, sql);
  })
  .delete(function (req, res, next) {
    user.elimina(req, res, next, sql);
  })
  .put(function (req, res, next) {
    user.modifica(req, res, next, sql);
  });

router.route('/files_recolec')
  .get(function (req, res, next) {
    files.get_dirs(req, res, next, sql);
  })
  .post(function (req, res, next) {
    files.recolec(req, res, next, sql);
  })
  .put(function (req, res, next) {
    files.updateDirs(req, res, next, sql);
  });

router.route('/files')
  .get(function (req, res, next) {
    files.get_files(req, res, next, sql);
  })

router.route('/bitacora')
  .get(function (req, res, next) {
    files.get_bitacora(req, res, next, sql);
  })

module.exports = router;
