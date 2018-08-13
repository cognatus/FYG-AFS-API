var app = angular.module('aplicacion', ['ngCookies']);

app.controller("navbar", function ($scope, $http, $window, $cookies) {

    var vm = $scope;
    /*En esta variable se usa para el menu ya una vez iniciada sesion
     *la parte de rol es para especificar quienes tienen acceso
     *si todos tienen acceso a cierta pagina entonces no se especifica
     *lo de opc es simplemente el nombre que se muestra
     *y la url es el donde se le redirije al darse click
    */
    var menu = [
        { opc: 'Home', url: "/", rol: [], uso: "0" },
        { opc: 'Reportes', url: "/reportes", rol: [1, 3], uso: "1" },
        { opc: 'Usuarios', url: "/usuarios", rol: [1], uso: "2" },
        { opc: 'Opreaciones Detenidas', url: "/operaciones", rol: [1, 2], uso: "3" },
        { opc: 'Bitacora', url: "/bitacora", rol: [1, 2], uso: "4" }
    ];

    vm.usuario = {};
    vm.menu = [];

    //con este vemos si existe la sesion iniciada
    vm.define = function () {
        vm.usuario = $cookies.getObject('usuario');
        if (vm.usuario) {
            verificarRol(vm.usuario.rol, vm.usuario.prvilegios.split(","));
        } else {
            $window.location.href = '/login';
        }
    }

    //en este verificamos cuales opciones son viables dependiendo del rol de usuario
    var verificarRol = function (rol, usos) {
        menu.forEach(opc => {
            if ((opc.rol.indexOf(rol) > -1 || opc.rol.length === 0) && usos.indexOf(opc.uso) > -1) {
                vm.menu.push(opc);
            }
        });
    }

    //este metodo lo usamos para redirigir dependiendo de la opcion seleccionada
    vm.redirect = function (url) {
        $window.location.href = url;
    }

    //este es para cerrar sesion
    vm.closeSesion = function () {
        $cookies.remove('usuario');
        $window.location.href = '/login';
    }
});