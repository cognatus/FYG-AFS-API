var controller = {};

controller.getFields = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    request.query("SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[transaccional]')", function (err, recordset) {
        console.log(recordset);
        consulta = recordset.recordset;
        if (err || consulta.length < 1) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            res.json(consulta);
        }
    });

}

controller.generateReport = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    console.log("SELECT "+req.body.fields+" FROM [dbo].[transaccional]");

    request.query("SELECT "+req.body.fields.toString()+" FROM [dbo].[transaccional]", function (err, recordset) {
        console.log(recordset);
        consulta = recordset.recordset;
        if (err || consulta.length < 1) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            response.info = consulta;
            response.campos = req.body.fields;
            res.json(response);
        }
    });

}

module.exports = controller;