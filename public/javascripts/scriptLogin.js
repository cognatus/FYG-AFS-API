var app = angular.module("aplicacion", ['ngCookies']);

app.controller("login", function ($scope, $http, $window, $cookies) {
    $scope.correo = "";
    $scope.contrasenia = "";

    //este metodo hace login y guarda la informacion en una cookie
    $scope.loguea = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/login',
            data: {
                correo: $scope.correo,
                contrasenia: $scope.contrasenia
            }
        }).then(
            function sucess(data) {
                $cookies.putObject('usuario', data.data);
                $window.location.href = '/inicio';
            },
            function error(err) {
                alert('Login incorrecto');
            }
        )
    }
});