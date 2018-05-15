var app = angular.module('aplicacion', ['ngCookies']);

app.controller("navbar", function ($scope, $http, $window, $cookies) {

    var vm = $scope;
    var menu = [
        { opc: 'Home', url: "/", rol: [] },
        { opc: 'Reportes', url: "/reportes", rol: [1, 2] },
        { opc: 'Usuarios', url: "/usuarios", rol: [1] },
        { opc: 'Opreaciones Detenidas', url: "/operaciones", rol: [1, 3] }
    ];

    vm.usuario = {};
    vm.menu = [];

    vm.define = function () {
        vm.usuario = $cookies.getObject('usuario');
        if (vm.usuario) {
            verificarRol(vm.usuario.rol);
        } else {
            $window.location.href = '/login';
        }
    }

    var verificarRol = function (rol) {
        menu.forEach(opc => {
            if (opc.rol.indexOf(rol) > -1 || opc.rol.length === 0) {
                vm.menu.push(opc);
            }
        });
    }

    vm.redirect = function (url) {
        $window.location.href = url;
    }

    vm.closeSesion = function () {
        $cookies.remove('usuario');
        $window.location.href = '/login';
    }
});