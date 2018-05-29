app.controller("bitacora", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.results = [];
    vm.carga = true;

    //este metodo obtiene la bitacora
    vm.getBitacora = function () {
        var user = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/bitacora',
            params: {
                sucursal_clave: user.sucursal_clave
            }
        }).then(
            function sucess(data) {
                vm.results = data.data;
                vm.carga = false;
            },
            function error(err) {
                vm.carga = false;
                alert('Error obteniendo resultados');
            }
        );
    };
});