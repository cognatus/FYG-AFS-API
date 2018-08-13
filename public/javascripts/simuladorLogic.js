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
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/simulador',
            data: vm.new_transaccion
        }).then(
            function sucess(data) {
                console.log(data);
                alert('Transaccion agregado correctamente');
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }
});