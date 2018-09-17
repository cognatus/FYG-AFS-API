app.controller("procesos", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.results = [];
    vm.carga = true;

    //este metodo obtiene la bitacora
    vm.getProcesos = function () {
        var user = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/getProcesses',
        }).then(
            function sucess(data) {
                vm.results = data.data;
                console.log(vm.results)
                vm.carga = false;
            },
            function error(err) {
                vm.carga = false;
                alert('Error obteniendo resultados');
            }
        );
    };
});