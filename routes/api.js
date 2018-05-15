var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var files = require('../controllers/files');
var sql = require('mssql/msnodesqlv8');
//var sql2 = require('mssql/msnodesqlv8');

//config to dbsqlserver
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

  /*var config2 = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver={SQL Server Native Client 11.0};Server={LAPTOP-TFBR1QTP};Database={fyg-afs-sys-final};Trusted_Connection={yes};',
  };
  
  sql2.connect(config2)
    .then(function () {
      console.log('Conectado')
    })
    .catch(function (err) {
      console.log(err);
    });*/

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

/*router.route('/muerte')
  .post(function (req, res, next) {
    var request = new sql2.Request();
    for (let i = 0; i < 300; i++) {

      var query = 'INSERT INTO [dbo].[bitacora]' +
        '([Mensaje]' +
        ',[Archivo]' +
        ',[Error])' +
        'VALUES' +
        '(\'Extraccion y validacion de informacion correcta\''+
      ',\' cliente' + i + '.txt' +
        '\',null);';

      request.query(query, function (err, recordset) {

        if (err) {
          console.log(err);
        } else {
          console.log(recordset);
        }
      });
      if(i === 299) {
        
        res.send('ah ok')
      }
    }
    console.log(query);
  });*/

module.exports = router;
