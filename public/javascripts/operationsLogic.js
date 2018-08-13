//Las URL con puerto 4000 representan el servidor de arvhivos
//Las URL con puerto 8080 representan el servidor en java de ejecucion de ETL
app.controller("operaciones", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.dirs = [];

    vm.getRules = function () {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/rules'
        }).then(
            function sucess(data) {
                var res = data.data;
                vm.giros = res.giros;
                vm.validaciones = res.validaciones;
                vm.reglas = res.reglas;
                vm.reglas_general = res.reglas_general;
                vm.hojas = res.hojas;
                vm.tipo_de_transaccion = res.tipo_de_transaccion;
                console.log(res)
                /*for (let i = 0; i < res.validaciones.length; i++) {
                    for (let j = 0; j < res.reglas.length; j++) {
                        console.log(res.validaciones[i].idTipo_validacion);
                        console.log(res.reglas[j].tipo_de_transaccion_idtipo);
                        console.log(res.reglas[j].regla);
                        if(res.validaciones[i].idTipo_validacion === res.reglas[j].tipo_de_transaccion_idtipo){
                            console.log('iguales', res.reglas[j].regla);
                        }     
                    }               
                }*/
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.add_rubro = function(validacion){
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/add_rules',
            data: {validacion: validacion, reglas_lenth: vm.reglas_general.length}
        }).then(
            function sucess(data) {
                console.log(data);
                alert('Rubro agregado correctamente');
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        );
    }

    vm.add_regla = function(){
        vm.dirs.push({id: (vm.dirs.length+1),
            nombre:  vm.regla_new_nombre,
            tipo: vm.regla_new_tipo,
            reglas: []
        })
        regla_new=false
    }
});