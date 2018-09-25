var controller = {};

controller.getFields = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};
    var table = getTable(req.query.table);

    request.query("SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].["+table+"]')", function (err, recordset) {
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
    var table = getTable(req.body.table);

    request.query("SELECT "+req.body.fields.toString()+" FROM [dbo].["+table+"]", function (err, recordset) {
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

var getTable = function (ref) {
    var table = '';
    switch (ref) {
        case '0':
            table = "transaccional"
            break;
        case '1':
            table = "atm"
            break;
        case '2':
            table = "cliente"
            break;
        case '3':
            table = "credito"
            break;
        case '4':
            table = "fondos_de_inversion"
            break;
        case '5':
            table = "liquidacion_de_prosa"
            break;
        case '6':
            table = "productos_por_cliente"
            break;
        default:
            table = "transaccional"
            break;
    }
    return table;
}

module.exports = controller;