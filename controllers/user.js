var controller = {};

controller.login = function (req, res, next, sql) {
    
    var request = new sql.Request();
    request.query('select * from [dbo].[empleados]', function (err, recordset) {

        if (err){
            console.log(err);
            res.send(err);
        }else{
            res.send(recordset);
        }

    });

}

controller.registro = function (req, res, next, sql) {
    var request = new sql.Request();
    var query = 'INSERT INTO [dbo].[empleados]' +
        '([clave]' +
        ',[nombres]' +
        ',[apellido_paterno]' +
        ',[apellido_materno]' +
        ',[edad]' +
        ',[domicilio]' +
        ',[puesto]' +
        ',[correo]' +
        ',[telefono]' +
        ',[contrasenia]' +
        ',[rol]' +
        ',[sucursal_clave])' +
        'VALUES' +
        '(\''+ req.body.clave+
        '\',\''+ req.body.nombre +
        '\',\''+ req.body.apellido_paterno +
        '\',\''+ req.body.apellido_materno +
        '\','+ req.body.edad +
        ',\''+ req.body.domicilio +
        '\',\''+ req.body.puesto +
        '\',\''+ req.body.correo +
        '\',\''+ req.body.telefono +
        '\',\''+ req.body.contrasenia +
        '\',\''+ req.body.rol +
        '\',\''+ req.body.sucursal_clave +
        '\');';
    console.log(query)
    request.query(query, function (err, recordset) {

        if (err){
            console.log(err);
            res.send(err);
        }else{
            res.send(recordset);
        }
    });
}

controller.modifica = function (req, res, next, sql) {


}

controller.elimina = function (req, res, next, sql) {


}

module.exports = controller;