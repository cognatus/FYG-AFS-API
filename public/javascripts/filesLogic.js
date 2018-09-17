/*
 * Aquí empieza modificaciones a la app para poder enviar archivos
*/
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
    this.uploadFileToUrl = function (file, uploadUrl, location, sucursal_clave, rubro) {

        let prom = new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append('file', file);
            resolve(fd);
        });

        prom.then((fd) => {
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { 
                    location: location,
                    sucursal_clave: sucursal_clave,
                    rubro: rubro
                }
            }).then(
                function sucess(data) {
                    alert('Upload correcto');
                },
                function error(err) {
                    alert('Upload incorrecto');
                }
            )
        });
    }
});
/*
 * Aquí terminan las modificaciones a la app para poder enviar archivos
*/


//Las URL con puerto 4000 representan el servidor de arvhivos
//Las URL con puerto 8080 representan el servidor en java de ejecucion de ETL
app.controller("files", function ($scope, $http, $window, $cookies, fileUpload) {

    var vm = $scope;

    vm.dirs = [];
    vm.files = [];
    vm.cargaETL = false;

    //con esto obtenemos los directorios guardados en base de datos
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

    //con esto obtenemos los archivos en servidor
    vm.getFiles = function () {
        var user = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/files',
            params: {
                sucursal_clave: user.sucursal_clave,
                rubro: $window.location.pathname.split('/')[2]
            }
        }).then(
            function sucess(data) {
                vm.files = data.data;
            },
            function error(err) {
                alert('Error obteniendo archivos');
            }
        );
    };

    //con esto guardamos un archivo en servidor
    vm.deleteFile = function (file) {
        var user = $cookies.getObject('usuario');
        var dire = {};
        vm.dirs.forEach(dir => {
            if (dir.rubro === $window.location.pathname.split('/')[2]) {
                console.log(dir);
                dire = dir;
            }
        });
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/files_transfer',
            data: {
                path: dire.carpeta_recoleccion+'\\'+file.archivo,
                file: file
            }
        }).then(
            function sucess(data) {
                console.log(data);
                const index = vm.files.indexOf(file);
                vm.files.splice(index, 1);
            },
            function error(err) {
                alert('Error obteniendo archivos');
            }
        );
    };

    //con esto borramos todos los archivos en servidor
    vm.deleteAll = function () {
        var user = $cookies.getObject('usuario');
        var dire = {};
        vm.dirs.forEach(dir => {
            if (dir.rubro === $window.location.pathname.split('/')[2]) {
                console.log(dir);
                dire = dir;
            }
        });
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/files_mod',
            data: {
                path: dire.carpeta_recoleccion,
                rubro: $window.location.pathname.split('/')[2],
                sucursal_clave: user.sucursal_clave
            }
        }).then(
            function sucess(data) {
                console.log(data)
            },
            function error(err) {
                alert('Error obteniendo archivos');
            }
        );
    };

    //con esto modificamos informacion de los directorios
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

    //con esto subimos archivos
    vm.uploadFile = function (dir) {
        //del directorio donde se va a subir, solo obtenemos el archivo
        var file = dir.file;
        var user = $cookies.getObject('usuario');

        //url de la peticion
        var uploadUrl = "http://localhost:4000/api/files_transfer";
        //el donde se va a guardar base a los directorios
        var location = dir.carpeta_recoleccion.replace(/\\/g, '\\\\');
        //se le pasan las variables base a las configuraciones de un principio de archivo
        fileUpload.uploadFileToUrl(file, uploadUrl, location, user.sucursal_clave, dir.rubro);
    };

    //ejecuta el ETL completo
    vm.ejecutaETL = function (bandera) {
        vm.cargaETL = true;
        var ruta = 'http://localhost:8080/REST-FYG-AFS/resources/etl';
        if (bandera) {
            ruta += '-' + $window.location.pathname.split('/')[2];
        }
        $http({
            method: 'POST',
            url: ruta,
            headers: {
                'Content-Type': 'text/plain'
            },
            data:'asdfdghh890'
        }).then(
            function sucess(data) {
                vm.cargaETL = false;
                console.log(data);
                //alert('ETL finalizado con exito');
            },
            function error(err) {
                vm.cargaETL = false;
                console.log(err);
                //alert('ETL finalizado con exito');
            }
        );
        $window.location.href = '/procesos';
    };
});