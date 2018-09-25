//Las URL con puerto 4000 representan el servidor de arvhivos
//Las URL con puerto 8080 representan el servidor en java de ejecucion de ETL
app.controller("reportes", function ($scope, $http, $window, $cookies) {

    var vm = $scope;
    var doc = new jsPDF();
    vm.fields = [];
    vm.fieldCheck = [];
    vm.campos = [];
    vm.info = [];
    vm.reportShow = false;
    vm.cargando = false;
    vm.tableinfo = "0";

    vm.getFields = function () {
        vm.fields = [];
        vm.campos = [];
        vm.info = [];
        vm.fieldCheck = [];
        vm.userLog = $cookies.getObject('usuario');
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/reports_fields?table='+vm.tableinfo
        }).then(
            function sucess(data) {
                vm.fields = data.data;
            },
            function error(err) {
                console.log(err);
                alert('Consulta incorrecta');
            }
        )
    }

    vm.addField = function (field) {
        vm.fieldCheck.push(field);
    }

    vm.generateReport = function() {
        vm.cargando = true;
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/generate_report',
            data: {fields: vm.fieldCheck, table: vm.tableinfo}
        }).then(
            function sucess(data) {
                vm.campos = data.data.campos;
                vm.info = data.data.info;
                vm.reportShow = true;
                vm.cargando = false;
            },
            function error(err) {
                console.log(err);
                vm.cargando = false;
                alert('Consulta incorrecta');
            }
        )
    }

    vm.generatePdf = function() {
        var source = window.document.getElementById('pdfGenerator');
        doc.fromHTML(
            source,
            15,
            15,
            { 
                'elementHandlers': {}
            });
        
        doc.save("dataurlnewwindow.pdf");

    }

});