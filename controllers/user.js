var controller = {};

controller.login = function (req, res, next, sql) {

    var request = sql.request();
    
    request.query("select * from [dbo].[empleados] where correo='" + req.body.correo + "' and contrasenia='" + req.body.contrasenia + "'", function (err, recordset) {
        if (err || recordset.recordset.length < 1) {
            console.log(err || "Datos de Login incorrectos");
            res.status(401).send(err || "Datos de Login incorrectos");
        } else {
            var response = recordset.recordset[0];
            delete response.contrasenia;
            res.json(response);
        }
    });

}

controller.getUsers = function (req, res, next, sql) {

    var request = sql.request();
    request.query("select * from [dbo].[empleados] where sucursal_clave='" + req.query.sucursal_clave + "' and rol=" + req.query.rol, function (err, recordset) {
        if (err || recordset.recordset.length < 1) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            var response = recordset.recordset;
            res.json(response);
        }
    });

}

controller.registro = function (req, res, next, sql) {
    var request = sql.request();
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
        ',[prvilegios]' +
        ',[sucursal_clave])' +
        'VALUES' +
        '(\'' + req.body.clave +
        '\',\'' + req.body.nombres +
        '\',\'' + req.body.apellido_paterno +
        '\',\'' + req.body.apellido_materno +
        '\',' + req.body.edad +
        ',\'' + req.body.domicilio +
        '\',\'' + req.body.puesto +
        '\',\'' + req.body.correo +
        '\',\'' + req.body.telefono +
        '\',\'' + req.body.contrasenia +
        '\',' + req.body.rol +
        ',\'' + req.body.prvilegios +
        '\',\'' + req.body.sucursal_clave +
        '\');';
    request.query(query, function (err, recordset) {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(recordset);
        }
    });
}

controller.modifica = function (req, res, next, sql) {
    var request = sql.request();
    var query = "UPDATE [dbo].[empleados] SET" +
        "[nombres] ='" + req.body.nombres +
        "',[apellido_paterno] ='" + req.body.apellido_paterno +
        "',[apellido_materno] ='" + req.body.apellido_materno +
        "',[edad] =" + req.body.edad +
        ",[domicilio] ='" + req.body.domicilio +
        "',[puesto] ='" + req.body.puesto +
        "',[correo] ='" + req.body.correo +
        "',[telefono] ='" + req.body.telefono +
        "',[contrasenia] ='" + req.body.contrasenia +
        "',[rol] =" + req.body.rol +
        ",[prvilegios] ='" + req.body.prvilegios +
        "',[sucursal_clave] ='" + req.body.sucursal_clave +
        "' WHERE [clave] = '" + req.body.clave + "';"
    request.query(query, function (err, recordset) {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(recordset);
        }
    });

}

controller.elimina = function (req, res, next, sql) {

    var request = sql.request();
    var query = "DELETE FROM [dbo].[empleados]" +
        " WHERE clave = '"+req.query.clave+"';"
    request.query(query, function (err, recordset) {
        if (err) {
            console.log(err || "Consulta incorrecta");
            res.status(500).send(err || "Consutla incorrecta");
        } else {
            res.send(recordset);
        }
    });

}

module.exports = controller;