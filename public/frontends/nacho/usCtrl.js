/*global angular*/
/*global Highcharts*/
/*global EJSC*/

angular
    .module("ManagerApp")
    .controller("ElectionsWidgetsCtrl", ["$http", "$scope", function($http, $scope) {

        // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked-percent/

        //Spain Elections data (My API)
        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};

        //US Elections data (external API): qué almacenar??? contar cuantos participantes (estados) hay para cada partido y representar dichas cantidades en el pie/donut???
        //Entiendo que cada recurso informa del partido que ganó (obtuvo más escaños) en el estado en el que se indica, RELACIONAR ESO CON LO EQUIVALENTE AQUÍ!!
        $scope.dataUs = {};
        var dataUs = {};


        $http
            .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
            .then(function(res) {

                data = res.data;
                $scope.data = data;
                //data.sort(sort_by('province', true, parseInt));

                for (var i = 0; i < res.data.length; i++) {
                    $scope.province.push($scope.data[i].province);
                    $scope.year.push(Number($scope.data[i].year));
                    $scope.pp.push(Number($scope.data[i].pp));
                    $scope.podemos.push(Number($scope.data[i].podemos));
                    $scope.psoe.push(Number($scope.data[i].psoe));
                    $scope.cs.push(Number($scope.data[i].cs));

                    console.log($scope.data[i].province);
                }

                $http
                    .get("https://zlzlap7j50.execute-api.us-east-1.amazonaws.com/prod")
                    .then(function(res) {

                        dataUs = res.data;
                        $scope.dataUs = dataUs;

                        for (var i = 0; i < res.data.length; i++) {
                        
                            console.log();
                        }

                        console.log("Controller intialized");

//Posibles librerías: morris.js , chartist.js , 
//También se podría usar una cosa como: http://plottablejs.org/examples/mondrian/ así viendo la diferencia entre las areas se apreciaría de anera muy gráfica la diferencia en volumen que hay entre unas elecciones aquí y unas alli.




                    });
            });
    }]);
