app.controller("transacciones_detenidas", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.transacciones = [];

    vm.getInfo = function () {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/transactions'
        }).then(
            function sucess(data) {
                vm.transacciones = data.data;
                console.log(vm.transacciones);
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.aprobarTransaccion = function (id) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/transactions',
            data: {id: id}
        }).then(
            function sucess(data) {
                alert('validada')
                console.log(data);
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.bloquearCliente = function (id) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/client_transactions',
            data: {id: id}
        }).then(
            function sucess(data) {
                alert('bloqueado')
                console.log(data);
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

});