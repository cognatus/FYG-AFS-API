app.controller("usuarios", function ($scope, $http, $window, $cookies) {

    var vm = $scope;

    vm.usuarios = [];
    vm.usuario = {};
    vm.new_usuario = {};
    //Esta variable muestra entre el formulario regular y el de añadir
    vm.add = false;

    //muetra el usuario en especifico seleccionado
    vm.showUser = function (user) {
        vm.usuario = user;
        vm.add = false;
    }

    //Obtenemos la lista de todos los usuarios vase al rol 
    vm.getUsers = function (rol) {
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/user',
            params: {
                sucursal_clave: vm.userLog.sucursal_clave,
                rol: rol
            }
        }).then(
            function sucess(data) {
                vm.usuarios = data.data;
                vm.usuario = data.data[0];
                //esto es para poner la clase de active a la parte del diseño
                switch (rol) {
                    case 1:
                        vm.adm = 'active'; vm.pdf = ''; vm.pdl = '';
                        break;
                    case 2:
                        vm.adm = ''; vm.pdf = 'active'; vm.pdl = '';
                        break;
                    case 3:
                        vm.adm = ''; vm.pdf = ''; vm.pdl = 'active';
                        break;
                }
                vm.add = false;
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    //para modificar usuarios
    vm.updateUser = function (user) {
        $http({
            method: 'PUT',
            url: 'http://localhost:3000/api/user',
            data: user
        }).then(
            function sucess(data) {
                console.log(data)
                alert('Usuario modificado correctamente');
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    //para borrar usuarios
    vm.deleteUser = function (user) {
        console.log(user);
        $http({
            method: 'DELETE',
            url: 'http://localhost:3000/api/user',
            params: { clave: user.clave }
        }).then(
            function sucess(data) {
                console.log(data)
                alert('Usuario eliminado correctamente');
                //una vez borrado el usuario lo buscamos en la lista y lo quitamos
                const index = vm.usuarios.indexOf(user);
                vm.usuarios.splice(index, 1);
                vm.usuario = vm.usuarios[0];
                //si se elimino a sí mismo, cerramos su sesion
                if (vm.userLog.clave === user.clave) {
                    $cookies.remove('usuario');
                    $window.location.href = '/login';
                }
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    //reseteamos el formulario de añadir
    vm.prepareAdd = function () {
        vm.add = true;
        vm.new_usuario.apellido_paterno = "";
        vm.new_usuario.apellido_materno = "";
        vm.new_usuario.clave = "";
        vm.new_usuario.contrasenia = "";
        vm.new_usuario.correo = "";
        vm.new_usuario.domicilio = "";
        vm.new_usuario.edad = 0;
        vm.new_usuario.nombres = "";
        vm.new_usuario.puesto = "";
        vm.new_usuario.sucursal_clave = "";
        vm.new_usuario.telefono = "";
        if (vm.adm == 'active') {
            vm.new_usuario.rol = 1;
        } else if (vm.pdf == 'active') {
            vm.new_usuario.rol = 2;
        } else {
            vm.new_usuario.rol = 3;
        }
    }

    //metodo para añadir usuario
    vm.addUser = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/user',
            data: vm.new_usuario
        }).then(
            function sucess(data) {
                console.log(data);
                //lo añadimos a la lista de usuarios actuales
                vm.usuarios.push(vm.new_usuario);
                vm.usuario = vm.new_usuario;
                vm.add = false;
                alert('Usuario agregado correctamente');
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }
});