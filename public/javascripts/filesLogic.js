app.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

app.service('fileUpload', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl, location) {

        let prom = new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append('file', file);
            resolve(fd);
        });

        prom.then((fd) => {
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: {location: location}
            }).then(
                function sucess(data) {
                },
                function error(err) {
                    alert('Upload incorrecto');
                }
            )
        });
    }
});

app.controller("files", function ($scope, $http, $window, $cookies, fileUpload) {

    var vm = $scope;

    vm.dirs = [];

    vm.getDirs = function () {
        var user = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/files_recolec',
            params: {
                sucursal_clave: user.sucursal_clave
            }
        }).then(
            function sucess(data) {
                vm.dirs = data.data;
            },
            function error(err) {
                alert('Error obteniendo dirs');
            }
        );
    };

    vm.updateDir = function (item) {
        var user = $cookies.getObject('usuario');
        $http({
            method: 'PUT',
            url: 'http://localhost:3000/api/files_recolec',
            data: {
                sucursal_clave: user.sucursal_clave,
                tiempo_ejecucion: item.tiempo_ejecucion,
                carpeta_recoleccion: item.carpeta_recoleccion,
                carpeta_fallidos: item.carpeta_fallidos,
                carpeta_finalizados: item.carpeta_finalizados,
                rubro: item.rubro
            }
        }).then(
            function sucess(data) {
                console.log(data)
            },
            function error(err) {
                alert('Error obteniendo dirs');
            }
        );
    };

    vm.uploadFile = function (dir) {
        var file = dir.file;

        var uploadUrl = "http://localhost:4000/api/files_transfer";
        var location = dir.carpeta_recoleccion.replace(/\\/g, '\\\\');
        fileUpload.uploadFileToUrl(file, uploadUrl, location);
    };
});