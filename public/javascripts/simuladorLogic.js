app.controller("simulador", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    //cliente, giros, tipo validacion
    vm.getInfo = function () {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/simulador'
        }).then(
            function sucess(data) {
                vm.info = data.data;
                console.log(data);
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    //metodo para añadir usuario
    vm.addTransaccion = function () {
        vm.new_transaccion.monto_transacción = parseInt(vm.new_transaccion.monto_transaccion);
        vm.new_transaccion.canal_de_transacción = vm.new_transaccion.Canal;
        vm.new_transaccion.clave_de_transacción = vm.new_transaccion.Clave;
        console.log(vm.new_transaccion)
        $http({
            method: 'POST',
            //url: 'http://localhost:8000/transaction/validate',
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://localhost:3000/api/simulador',
            data: vm.new_transaccion
        }).then(
            function sucess(data) {
                console.log(data);
                let result = data.data; 
                if(result.code >= 0){
                    alert(result.msg);
                }else {
                    alert('Consulta incorrecta: '+result.error);
                }
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }
});