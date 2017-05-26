/*global angular*/
/*global Highcharts*/

angular
    .module("ManagerApp")
    .controller("UsCtrl", ["$http", "$scope", function($http, $scope) {

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

        //-US Elections data (external API): qué almacenar??? contar cuantos participantes (estados) hay para cada partido y representar dichas cantidades en el pie/donut???
        //Entiendo que cada recurso informa del partido que ganó (obtuvo más escaños) en el estado en el que se indica, RELACIONAR ESO CON LO EQUIVALENTE AQUÍ!!
        //-En USA hay sólo dos partidos...republicano y demócrata. Digamos que los pongo como socialista y conservador, y luego agrupo los pares de partidos
        //españoles de cada lado (izquierda psoe y podemos) y derecha (pp y C's). Una vez hecho esto, representarlo y COMPARAR los tamaños de cada movimiento
        //entre los 2 paises.
        //HAY 50 ESTADOS EN USA     

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
                    .get("/usData?apikey=" + $scope.apikey)
                    .then(function(res) {

                        dataUs = res.data;
                        $scope.dataUs = dataUs;

                        for (var i = 0; i < res.data.length; i++) {

                            console.log();
                        }

                        console.log("Controller intialized");

                        //Posibles librerías: morris.js , chartist.js , 
                        //También se podría usar una cosa como: http://plottablejs.org/examples/mondrian/ así viendo la diferencia entre las areas se apreciaría de anera muy gráfica la diferencia en volumen que hay entre unas elecciones aquí y unas alli.

                        //Highchart: (tipo treemap, completamente diferente a los otros tipos YA usado de esta librería)
                        Highcharts.chart('containerUs', {
                            series: [{
                                type: "treemap",
                                layoutAlgorithm: 'stripes',
                                alternateStartingDirection: true,
                                levels: [{
                                    level: 1,
                                    layoutAlgorithm: 'sliceAndDice',
                                    dataLabels: {
                                        enabled: true,
                                        align: 'left',
                                        verticalAlign: 'top',
                                        style: {
                                            fontSize: '15px',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }],
                                data: [{
                                    id: 'A',
                                    name: 'Conservatism ', //Derecha
                                    color: "#0080FF"
                                }, {
                                    id: 'B',
                                    name: 'Social liberalism', //Izquierda
                                    color: "#FA5858"
                                }, {
                                    name: 'Partido Popular',
                                    parent: 'A',
                                    value: 5
                                }, {
                                    name: 'PSOE',
                                    parent: 'B',
                                    value: 5
                                }, {
                                    name: 'Podemos',
                                    parent: 'B',
                                    value: 3
                                }, {
                                    name: 'C',
                                    parent: 'A',
                                    value: 4
                                }, {
                                    name: 'Republican Party', //Derecha
                                    parent: 'A',
                                    value: 4
                                }, {
                                    name: 'Democratic Party', //Izquierda
                                    parent: 'B',
                                    value: 10
                                }]
                            }],
                            title: {
                                text: 'Parties in the US and in Spain'
                            }
                        });
                    });
            });
    }]);
