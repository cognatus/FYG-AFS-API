app.controller("transacciones_detenidas", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.transacciones = [];
    vm.historicoTransacciones = [];
    vm.clientInfo = {};

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

    vm.getTransactionsHistory = function (id) {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/transactions_history?id='+id
        }).then(
            function sucess(data) {
                console.log(data);
                vm.historicoTransacciones = data.data;
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.getClientInfo = function (id) {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/client_info?id='+id
        }).then(
            function sucess(data) {
                console.log(data)
                vm.clientInfo = data.data[0];
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.aprobarTransaccion = function (transaccion) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/transactions',
            data: {id: transaccion.idTransacciones}
        }).then(
            function sucess(data) {
                const index = vm.transacciones.indexOf(transaccion);
                vm.transacciones.splice(index, 1);
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