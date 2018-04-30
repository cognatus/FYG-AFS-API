var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var sql = require('mssql/msnodesqlv8');

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


router.route('/user')
      .get(function(req, res, next){
        user.login(req, res, next, sql);
      })
      .post(function(req, res, next){
        user.registro(req, res, next, sql);
      })
      .delete(function(req, res, next){
        user.elimina(req, res, next, sql);
      })
      .put(function(req, res, next){
        user.modifica(req, res, next, sql);
      });

module.exports = router;
