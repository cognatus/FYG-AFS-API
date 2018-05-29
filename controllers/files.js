var controller = {};

controller.get_dirs = function (req, res, next, sql) {

    var request = new sql.Request();
    request.query("select * from [dbo].[ejecucion] where sucursal_clave='" + req.query.sucursal_clave + "'", function (err, recordset) {
        if (err || recordset.recordset.length < 1) {
            console.log(err || "No se encontro datos");
            res.status(401).send(err || "No se encontro datos");
        } else {
            var response = recordset.recordset;
            res.json(response);
        }
    });

}

controller.get_files = function (req, res, next, sql) {

    var request = new sql.Request();
    request.query("SELECT [created_at] ,[archivo] ,[sucursal_clave] ,[rubro] FROM [dbo].[archivos] WHERE sucursal_clave='" + req.query.sucursal_clave + "' and rubro = '" + req.query.rubro + "'", function (err, recordset) {
        if (err) {
            console.log(err);
            res.status(401).send(err);
        } else {
            var response = recordset.recordset;
            res.json(response);
        }
    });

}

controller.get_bitacora = function (req, res, next, sql) {

    var request = new sql.Request();
    request.query("SELECT [created_at], [mensaje], [archivo], [error], [sucursal_clave] FROM [dbo].[bitacora] WHERE sucursal_clave='" + req.query.sucursal_clave + "'", function (err, recordset) {
        if (err) {
            console.log(err);
            res.status(401).send(err);
        } else {
            var response = recordset.recordset;
            res.json(response);
        }
    });

}

controller.updateDirs = function (req, res, next, sql) {

    var request = new sql.Request();
    request.query("UPDATE [dbo].[ejecucion]" +
                    "SET [tiempo_ejecucion] = '" + req.body.tiempo_ejecucion +
                    "',[carpeta_recoleccion] = '" + req.body.carpeta_recoleccion +
                    "',[carpeta_fallidos] = '" + req.body.carpeta_fallidos +
                    "',[carpeta_finalizados] = '" + req.body.carpeta_finalizados +
                    "' WHERE rubro = '"+req.body.rubro+"' and sucursal_clave = '"+req.body.sucursal_clave+"';",
        function (err, recordset) {
            console.log(recordset);
            if (err) {
                console.log(err || "No se encontro datos");
                res.status(401).send(err || "No se encontro datos");
            } else {
                var response = recordset.recordset;
                res.json(response);
            }
        });

}

controller.recolec = function (req, res, next, sql) {
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
        '(\'' + req.body.clave +
        '\',\'' + req.body.nombre +
        '\',\'' + req.body.apellido_paterno +
        '\',\'' + req.body.apellido_materno +
        '\',' + req.body.edad +
        ',\'' + req.body.domicilio +
        '\',\'' + req.body.puesto +
        '\',\'' + req.body.correo +
        '\',\'' + req.body.telefono +
        '\',\'' + req.body.contrasenia +
        '\',\'' + req.body.rol +
        '\',\'' + req.body.sucursal_clave +
        '\');';
    request.query(query, function (err, recordset) {

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(recordset);
        }
    });
}

module.exports = controller;