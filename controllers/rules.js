var controller = {};

controller.getRules = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    var myPromise = new Promise(function(resolve, reject){
        request.query('SELECT [idGiros],[Giro] FROM [dbo].[giros]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.giros = consulta;
                resolve(consulta);
            }
        });
     })

    myPromise.then(function(result) {
        
        request.query('SELECT [idtipo], [rubro], [empresa_clave] FROM [dbo].[tipo_de_transaccion]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.tipo_de_transaccion = consulta;
                return consulta;
            }
        });

    }, function(err) {
        console.log(err);
    }).then(function(result) {
        
        request.query('SELECT [idTipo_validacion], [nombre_validacion], [Tipo_de_transaccion_idTipo] FROM [dbo].[tipo_validacion]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.validaciones = consulta;
                return consulta;
            }
        });

    }, function(err) {
        console.log(err);
    }).then(function(result) {
        
        request.query('SELECT re.idReglas_estaticas, re.Metodo, r.idregla, r.regla, r.tipo_de_transaccion_idtipo, r.FK_idGiros, rh.Valor_esperado FROM [dbo].[reglas_estaticas] re INNER JOIN [dbo].[reglas_estaticas_has_reglas] rh  on rh.Reglas_estaticas_idReglas_estaticas = re.idReglas_estaticas INNER JOIN [dbo].[reglas] r on rh.Reglas_idRegla = r.idregla', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.reglas = consulta;
                return consulta;
            }
        });

    }, function(err) {
        console.log(err);
    }).then(function(result) {
        
        request.query('SELECT * FROM [dbo].[reglas_estaticas]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.hojas = consulta;
                return consulta;
            }
        });

    }, function(err) {
        console.log(err);
    }).then(function(result) {

        request.query('SELECT [idregla], [regla], [tipo_de_transaccion_idtipo], [FK_idGiros] FROM [dbo].[reglas]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.reglas_general = consulta;
                var aux = [];

                for (let i = 0; i < response.reglas_general.length; i++) {
                    let element = response.reglas_general[i];

                    request.query('SELECT [idRangos], [Limitador], [Valor], [Reglas_idRegla] FROM [dbo].[rangos] WHERE [Reglas_idRegla] = '+element.idregla, function (err, recordset) {
                        consulta = recordset.recordset;
                        if (err || consulta.length < 1) {
                            console.log(err || "Consutla incorrecta");
                            res.status(401).send(err || "Consutla incorrecta");
                        } else {
                            element.rangos = consulta;
                            aux.push(element);
                            if(aux.length === response.reglas_general.length) {
                                response.reglas_general = aux;
                                res.json(response);
                            }
                        }
                    });
                };
            }
        });

    }, function(err) {
        console.log(err);
    });
    

}

controller.getTransactions = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    var myPromise = new Promise(function(resolve, reject){
        request.query('SELECT t.*, c.Numero_TDD, c.Numero_cuenta, c.Estatus as cliente_estatus, tv.nombre_validacion FROM [dbo].[transacciones] t INNER JOIN dbo.cliente c on t.Cliente_idCliente = c.idCliente INNER JOIN dbo.tipo_validacion tv on tv.idTipo_validacion = t.idTipo_validacion_FK WHERE t.validada IS NULL', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                res.json(consulta);
            }
        });
     });

}

controller.getTransactionsHistory = function (req, res, next, sql, sql2) {

    console.log(req.query.id);

    var request = sql.request();
    var request2 = sql2.request();
    var response = {};

    request2.query("SELECT t.[fecha_información] as Fecha_informacion, t.[clave_de_transacción] as idTransacciones, t.[descripción_transacción] as Descripcion, t.[tipo_transaccion] as nombre_validacion, t.[canal_de_transacción], t.[cve_usuario], t.[no_tarjeta] as Numero_TDD, t.[tipo_de_movimiento], t.[moneda], t.[ciudad], t.[monto_transacción] as Monto, CONCAT(c.nombre_o_razon_social, ' ', c.apellido_paterno, ' ', c.apellido_materno) as nombre_cliente FROM [dbo].[transaccional] t INNER JOIN [dbo].cliente c ON c.numero_de_cliente = t.cliente_numero_de_cliente WHERE t.cliente_numero_de_cliente = '"+req.query.id+"'", function (err, recordset) {
        consulta = recordset.recordset;
        console.log(consulta);
        console.log(err);
        if (err || consulta.length < 1) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            res.json(consulta);
        }
    });

}

controller.getClientInfo = function (req, res, next, sql, sql2) {

    console.log(req.query.id);

    var request = sql.request();
    var request2 = sql2.request();
    var response = {};

    request2.query("SELECT * FROM [dbo].[cliente] WHERE numero_de_cliente = '"+req.query.id+"'", function (err, recordset) {
        consulta = recordset.recordset;
        console.log(consulta);
        console.log(err);
        if (err || consulta.length < 1) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            res.json(consulta);
        }
    });

}

controller.getHistoricTransactions = function (req, res, next, sql, sql2) {

    var request = sql.request();
    var request2 = sql2.request();
    var response = {};
    var rango = date_format_between();

    var myPromise = new Promise(function(resolve, reject){
        request2.query("SELECT * FROM [dbo].[transaccional] WHERE [fecha_información] between '"+rango.early+"' and '"+rango.last+"'", function (err, recordset) {
            consulta = recordset.recordset;
            console.log(consulta);
            if (err) {
                console.log(err);
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.frecuencia = consulta.length;
                resolve(consulta);
            }
        });
     });

    myPromise.then(function(result) {
        
        request.query("SELECT * FROM [dbo].[transacciones] WHERE [Fecha_informacion] between '"+rango.early+"' and '"+rango.last+"'", function (err, recordset) {
            consulta = recordset.recordset;
            console.log(consulta);
            if (err) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.frecuencia += consulta.length;
                res.json(response);
            }
        });

    }, function(err) {
        console.log(err);
    })
}

controller.aprobarTransaccion = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    request.query("UPDATE [dbo].[transacciones] SET [validada] = 1 WHERE [idTransacciones] = '"+req.body.id+"'", function (err, recordset) {
        if (err) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            res.json(recordset);
        }
    });

}

controller.bloquearCliente = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    request.query("UPDATE [dbo].[cliente] SET [Estatus] = 'BLOQUEADO' WHERE [idCliente] = "+req.body.id, function (err, recordset) {
        if (err) {
            console.log(err || "Consutla incorrecta");
            res.status(401).send(err || "Consutla incorrecta");
        } else {
            res.json(consulta);
        }
    });

}

controller.getInfoSimulador = function (req, res, next, sql) {

    var request = sql.request();
    var response = {};

    var myPromise = new Promise(function(resolve, reject){
        request.query('SELECT [idGiros],[Giro] FROM [dbo].[giros]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.giros = consulta;
                resolve(consulta);
            }
        });
     })

    myPromise.then(function(result) {
        
        request.query('SELECT * FROM [dbo].[cliente]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.clientes = consulta;
                return consulta;
            }
        });

    }, function(err) {
        console.log(err);
    }).then(function(result) {
        
        request.query('SELECT [idTipo_validacion], [nombre_validacion], [Tipo_de_transaccion_idTipo] FROM [dbo].[tipo_validacion]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                response.validaciones = consulta;
                res.json(response);
            }
        });

    }, function(err) {
        console.log(err);
    });

}

controller.simulateTransaction = function (req, res, next, sql, sql2) {
    var request = sql.request();
    var data = req.body;

    var myPromise = new Promise(function(resolve, reject){
        request.query("INSERT INTO [dbo].[transacciones]" +
            "([idTransacciones]" +
            ",[Cliente_idCliente]" +
            ",[Fecha_informacion]" +
            ",[Canal]" +
            ",[Clave]" +
            ",[Giro]" +
            ",[Moneda]" +
            ",[Banco_destino]" +
            ",[Cuenta_destino]" +
            ",[Pais_destino]" +
            ",[Ciudad_destino]" +
            ",[Beneficiario]" +
            ",[Corresponsal]" +
            ",[Monto]" +
            ",[Ubicacion]" +
            ",[Estatus]" +
            ",[idTipo_validacion_FK])" +
        "VALUES" +
            "('"+data.idTransacciones+"'" +
            ",'"+data.Cliente_idCliente+"'" +
            ",'"+date_format()+"'" +
            ",'"+data.Canal+"'" +
            ",'"+data.Clave+"'" +
            ",'"+data.Giro+"'" +
            ",'"+data.Moneda+"'" +
            ",'"+data.Banco_destino+"'" +
            ",'"+data.Cuenta_destino+"'" +
            ",'"+data.Pais_destino+"'" +
            ",'"+data.Ciudad_destino+"'" +
            ",'"+data.Beneficiario+"'" +
            ",'"+data.Corresponsal+"'" +
            ",'"+data.Monto+"'" +
            ",'"+data.Ubicacion+"'" +
            ",'"+data.Estatus+"'" +
            ",'"+data.idTipo_validacion_FK+"')", function (err, recordset) {
            if (err) {
                console.log(err);
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                resolve(recordset);
            }
        });
        resolve('ah ok');

    });

    var resultRule = {};

    myPromise.then(function(result) {
//        request.query("SELECT re.[idregla] ,re.[regla] ,ra.Limitador ,ra.Valor FROM [dbo].[reglas] re INNER JOIN [dbo].[rangos] ra on ra.Reglas_idRegla = re.idregla WHERE [FK_idGiros] = "+data.Giro+" AND [tipo_de_transaccion_idtipo] = '"+data.idTipo_validacion_FK+"'", function (err, recordset) {
        request.query("SELECT re.[idregla] ,re.[regla] ,ra.Limitador ,ra.Valor FROM [dbo].[reglas] re INNER JOIN [dbo].[rangos] ra on ra.Reglas_idRegla = re.idregla WHERE [FK_idGiros] = "+data.Giro+" AND [tipo_de_transaccion_idtipo] = 2", function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log(err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                request.query("SELECT re.Metodo, rh.Valor_esperado FROM [dbo].[reglas_estaticas] re INNER JOIN [dbo].[reglas_estaticas_has_reglas] rh  on rh.Reglas_estaticas_idReglas_estaticas = re.idReglas_estaticas INNER JOIN [dbo].[reglas] r on rh.Reglas_idRegla = r.idregla WHERE idregla = '"+consulta[0].idregla+"'", function (err, recordset) {
                    consulta2 = recordset.recordset;
                    if (err || consulta2.length < 1) {
                        console.log(err || "Consutla incorrecta");
                        res.status(401).send(err || "Consutla incorrecta");
                    } else {
                        var rangos_aux = {};
                        for (let i = 0; i < consulta.length; i++) {
                            const element = consulta[i];

                            switch (element.Limitador) {
                                case 'Bajo':
                                    rangos_aux.bajo = element.Valor;
                                    break;

                                case 'Medio':
                                    rangos_aux.medio = element.Valor;
                                    break;

                                case 'Alto':
                                    rangos_aux.alto = element.Valor;
                                    break;
                            }
                        }
                        resultRule = rules(data.Monto, rangos_aux.bajo, rangos_aux.medio, rangos_aux.alto);
                        request.query("UPDATE [dbo].[transacciones] SET [Descripcion] = '"+resultRule.Descripcion+"', [critizidad] = '"+resultRule.critizidad+"' WHERE [idTransacciones] = '"+data.idTransacciones+"'", function (err, recordset) {
                            if (err) {
                                console.log(err);
                                res.status(401).send(err);
                            } else {
                                request.query("SELECT re.[idregla], re.[regla], ra.Limitador, ra.Valor FROM [dbo].[reglas] re INNER JOIN [dbo].[rangos] ra on ra.Reglas_idRegla = re.idregla WHERE [FK_idGiros] = "+data.Giro+" AND [tipo_de_transaccion_idtipo] = 1", function (err, recordset) {
                                    consulta = recordset.recordset;
                                    if (err || consulta.length < 1) {
                                        console.log(err || "Consutla incorrecta");
                                        res.status(401).send(err || "Consutla incorrecta");
                                    } else {
                                        request.query("SELECT re.Metodo, rh.Valor_esperado FROM [dbo].[reglas_estaticas] re INNER JOIN [dbo].[reglas_estaticas_has_reglas] rh  on rh.Reglas_estaticas_idReglas_estaticas = re.idReglas_estaticas INNER JOIN [dbo].[reglas] r on rh.Reglas_idRegla = r.idregla WHERE idregla = '"+consulta[0].idregla+"'", function (err, recordset) {
                                            consulta2 = recordset.recordset;
                                            if (err || consulta2.length < 1) {
                                                console.log(err || "Consutla incorrecta");
                                                res.status(401).send(err || "Consutla incorrecta");
                                            } else {
                                                var rangos_aux = {};
                                                for (let i = 0; i < consulta.length; i++) {
                                                    const element = consulta[i];
                        
                                                    switch (element.Limitador) {
                                                        case 'Bajo':
                                                            rangos_aux.bajo = element.Valor;
                                                            break;
                        
                                                        case 'Medio':
                                                            rangos_aux.medio = element.Valor;
                                                            break;
                        
                                                        case 'Alto':
                                                            rangos_aux.alto = element.Valor;
                                                            break;
                                                    }
                                                }
                        
                                                var request2 = sql2.request();
                                                var response = {};
                                                var rango = date_format_between();
                        
                                                request2.query("SELECT * FROM [dbo].[transaccional] WHERE [cliente_numero_de_cliente] = '"+data.Cliente_idCliente+"' AND [fecha_información] between '"+rango.early+"' and '"+rango.last+"'", function (err, recordset) {
                                                    console.log("SELECT * FROM [dbo].[transaccional] WHERE [cliente_numero_de_cliente] = '"+data.Cliente_idCliente+"' AND [fecha_información] between '"+rango.early+"' and '"+rango.last+"'")
                                                    consulta = recordset.recordset;
                                                    if (err) {
                                                        console.log(err);
                                                        reject(err);
                                                        res.status(401).send(err || "Consutla incorrecta");
                                                    } else {
                                                        response.frecuencia = consulta.length;
                                                        request.query("SELECT * FROM [dbo].[transacciones] WHERE [Cliente_idCliente] = '"+data.Cliente_idCliente+"' AND [Fecha_informacion] between '"+rango.early+"' and '"+rango.last+"'", function (err, recordset) {
                                                            consulta = recordset.recordset;
                                                            if (err) {
                                                                console.log(err || "Consutla incorrecta");
                                                                res.status(401).send(err || "Consutla incorrecta");
                                                            } else {
                                                                response.frecuencia += consulta.length;
                                                                var resultRule2 = rules(response.frecuencia, rangos_aux.bajo, rangos_aux.medio, rangos_aux.alto);
                                                                request.query("UPDATE [dbo].[transacciones] SET [Descripcion] = 'Monto: "+resultRule.Descripcion+", Frecuencia: "+resultRule2.Descripcion+"', [critizidad] = 'Monto: "+resultRule.critizidad+", Frecuencia: "+resultRule2.critizidad+"' WHERE [idTransacciones] = '"+data.idTransacciones+"'", function (err, recordset) {
                                                                    
                                                                    if (err || consulta.length < 1) {
                                                                        console.log(err || "Consutla incorrecta");
                                                                        res.status(401).send(err || "Consutla incorrecta");
                                                                    } else {
                                                                        res.json(recordset);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                        
                                                
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    
    });
    
}

controller.addRubro = function (req, res, next, sql) {
    var request = sql.request();
    var response = {};
    var validacion = req.body.validacion;
    var data = validacion.new;
    var reglaLength = req.body.reglas_lenth;

    console.log(validacion)
    console.log(data)
    console.log(reglaLength)

    var myPromise = new Promise(function(resolve, reject){
        request.query("INSERT INTO [dbo].[reglas]" +
            "([idregla]" +
            ",[regla]" +
            ",[tipo_de_transaccion_idtipo]" +
            ",[FK_idGiros])" +
        " VALUES " +
            "("+(reglaLength+1)+"" +
            ",'"+data.nombre+"'" +
            ","+validacion.idTipo_validacion+"" +
            ","+data.giro+")", function (err, recordset) {
            if (err) {
                console.log('Regla',err);
                reject(err);
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                resolve(recordset);
            }
        });

    });

    myPromise.then(function(result) {

        request.query('SELECT * FROM [dbo].[rangos]', function (err, recordset) {
            consulta = recordset.recordset;
            if (err || consulta.length < 1) {
                console.log('Rangos',err || "Consutla incorrecta");
                res.status(401).send(err || "Consutla incorrecta");
            } else {
                request.query("INSERT INTO [dbo].[rangos]" +
                    "([idRangos]" +
                    ",[Limitador]" +
                    ",[Valor]" +
                    ",[Reglas_idRegla])" +
                "VALUES" +
                    "("+(consulta.length+1)+"" +
                    ",'Bajo'" +
                    ","+data.bajo+"" +
                    ","+(reglaLength+1)+")", function (err, recordset) {
                    if (err) {
                        reject(err);
                        res.status(401).send(err || "Consutla incorrecta");
                    } else {
                        request.query("INSERT INTO [dbo].[rangos]" +
                            "([idRangos]" +
                            ",[Limitador]" +
                            ",[Valor]" +
                            ",[Reglas_idRegla])" +
                        "VALUES" +
                            "("+(consulta.length+2)+"" +
                            ",'Medio'" +
                            ","+data.medio+"" +
                            ","+(reglaLength+1)+")", function (err, recordset) {
                            if (err) {
                                reject(err);
                                res.status(401).send(err || "Consutla incorrecta");
                            } else {
                                request.query("INSERT INTO [dbo].[rangos]" +
                                    "([idRangos]" +
                                    ",[Limitador]" +
                                    ",[Valor]" +
                                    ",[Reglas_idRegla])" +
                                "VALUES" +
                                    "("+(consulta.length+3)+"" +
                                    ",'Alto'" +
                                    ","+data.alto+"" +
                                    ","+(reglaLength+1)+")", function (err, recordset) {
                                    if (err) {
                                        reject(err);
                                        res.status(401).send(err || "Consutla incorrecta");
                                    } else {
                                        request.query("INSERT INTO [dbo].[reglas_estaticas_has_reglas]" +
                                            "([Reglas_estaticas_idReglas_estaticas]" +
                                            ",[Reglas_idRegla]" +
                                            ",[Valor_esperado])" +
                                        "VALUES" +
                                            "("+data.hoja+"" +
                                            ","+(reglaLength+1)+"" +
                                            ",'N/A')", function (err, recordset) {
                                            if (err) {
                                                reject(err);
                                                res.status(401).send(err || "Consutla incorrecta");
                                            } else {
                                                res.json('ah ok');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        
    
    });
    
}

function date_format () {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function date_format_between() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    return {early: (year + "-" + month + "-" + day + " 00:00:00"), last: (year + "-" + month + "-" + day + " 23:59:59")}
}

function rules(monto, bajo, medio, alto) {
    var response = {};
    console.log(monto, bajo, medio, alto)
    if (monto >= 0 && monto < bajo) {
        response.Descripcion = 'N/A';
        response.critizidad = 'N/A';
        console.log('Sin riesgo');
    } else if (monto >= bajo && monto < medio) {
        response.Descripcion = 'Se sobrepaso un poco';
        response.critizidad = 'Baja';
        console.log('Riesgo Bajo');
    } else if (monto >= medio && monto < alto) {
        response.Descripcion = 'Se sobrepaso del promedio';
        response.critizidad = 'Media';
        console.log('Riesgo Medio');
    } else if (monto >= alto) {
        response.Descripcion = 'Se sobrepaso mucho del promedio';
        response.critizidad = 'Alta';
        console.log('Riesgo Alto');
    } 

    return response;
}

module.exports = controller;