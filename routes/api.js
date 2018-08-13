var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var files = require('../controllers/files');
var rules = require('../controllers/rules');
var sql = require('mssql/msnodesqlv8');

//config to dbsqlserver a la base de datos fyg-afs-admin
//esto con windows authentication
var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={LAPTOP-TFBR1QTP};Database={fyg-afs-admin};Trusted_Connection={yes};',
};

var config2 = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={LAPTOP-TFBR1QTP};Database={fyg-afs-sys-final};Trusted_Connection={yes};',
};

var db = new sql.ConnectionPool(config);
var db2 = new sql.ConnectionPool(config2);

db.connect()
.then(pool => {
  console.log('Conectado a admin')
  return pool
})
.catch(err => {
  console.log(err);
});
db2.connect()
.then(pool => {
  console.log('Conectado a final')
  return pool
})
.catch(err => {
  console.log(err);
});

/*
sql.connect(config)
  .then(function () {
    console.log('Conectado')
  })
  .catch(function (err) {
    console.log(err);
  });*/

//En las siguientes, definimos las rutas del API con sus respetivos metodos y pasandoles la conexion a la DB

router.route('/login')
  .post(function (req, res, next) {
    user.login(req, res, next, db);
  })
  .delete(function (req, res, next) {
    req.session.usuario = undefined;
  });

router.route('/user')
  .get(function (req, res, next) {
    user.getUsers(req, res, next, db);
  })
  .post(function (req, res, next) {
    user.registro(req, res, next, db);
  })
  .delete(function (req, res, next) {
    user.elimina(req, res, next, db);
  })
  .put(function (req, res, next) {
    user.modifica(req, res, next, db);
  });

router.route('/files_recolec')
  .get(function (req, res, next) {
    files.get_dirs(req, res, next, db);
  })
  .post(function (req, res, next) {
    files.recolec(req, res, next, db);
  })
  .put(function (req, res, next) {
    files.updateDirs(req, res, next, db);
  });

router.route('/files')
  .get(function (req, res, next) {
    files.get_files(req, res, next, db);
  })

router.route('/rules')
  .get(function (req, res, next) {
    rules.getRules(req, res, next, db);
  });

router.route('/add_rules')
  .post(function (req, res, next) {
    rules.addRubro(req, res, next, db);
  });

router.route('/transactions')
  .get(function (req, res, next) {
    rules.getTransactions(req, res, next, db);
  })
  .post(function (req, res, next) {
    rules.aprobarTransaccion(req, res, next, db);
  });

router.route('/client_transactions')
  .get(function (req, res, next) {
    rules.getHistoricTransactions(req, res, next, db, db2);
  })
  .post(function (req, res, next) {
    rules.bloquearCliente(req, res, next, db);
  });

router.route('/simulador')
  .post(function (req, res, next) {
    rules.simulateTransaction(req, res, next, db, db2);
  })
  .get(function (req, res, next) {
    rules.getInfoSimulador(req, res, next, db);
  })

router.route('/bitacora')
  .get(function (req, res, next) {
    files.get_bitacora(req, res, next, db);
  })

module.exports = router;
