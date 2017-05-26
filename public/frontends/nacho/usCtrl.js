/*global angular*/
/*global Highcharts*/

angular
    .module("ManagerApp")
    .controller("UsCtrl", ["$http", "$scope", function($http, $scope) {

        // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked-percent/

        //Spain Elections data (My API)
        $scope.apikey = "cinco";
        $scope.ppValue = 0;
        $scope.podemosValue = 0;
        $scope.psoeValue = 0;
        $scope.csValue = 0;
        $scope.data = {};
        var data = {};

        //-US Elections data (external API): qué almacenar??? contar cuantos participantes (estados) hay para cada partido y representar dichas cantidades en el pie/donut???
        //Entiendo que cada recurso informa del partido que ganó (obtuvo más escaños) en el estado en el que se indica, RELACIONAR ESO CON LO EQUIVALENTE AQUÍ!!
        //-En USA hay sólo dos partidos...republicano y demócrata. Digamos que los pongo como socialista y conservador, y luego agrupo los pares de partidos
        //españoles de cada lado (izquierda psoe y podemos) y derecha (pp y C's). Una vez hecho esto, representarlo y COMPARAR los tamaños de cada movimiento
        //entre los 2 paises.
        //HAY 50 ESTADOS EN USA     
        $scope.rpValue = 0;
        $scope.dpValue = 0;
        $scope.dataUs = {};
        var dataUs = {};


        $http
            .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
            .then(function(res) {

                data = res.data;
                $scope.data = data;
                //data.sort(sort_by('province', true, parseInt));

                for (var i = 0; i < res.data.length; i++) {
                    $scope.ppValue = $scope.ppValue + Number($scope.data[i].pp);
                    $scope.psoeValue = $scope.psoeValue + Number($scope.data[i].psoe);
                    $scope.podemosValue = $scope.podemosValue + Number($scope.data[i].podemos);
                    $scope.csValue = $scope.csValue + Number($scope.data[i].cs);
                }

                $http
                    .get("/usData?apikey=" + $scope.apikey)
                    .then(function(res) {

                        dataUs = res.data;
                        $scope.dataUs = dataUs;

                        for (var i = 0; i < res.data.length; i++) { //HAY ALGÚN PARTIDO QUE NO SEA ALGUNO DE ESTOS 2 EN EL JSON QUE SE DEVUELVE???
                            console.log("Entra al bucle usData...PARTY: ",$scope.dataUs[i][7]);
                            
                            if ($scope.dataUs[i]['party'] == "DEM") {
                                $scope.dpValue = $scope.dpValue + 1;
                            }
                            else if ($scope.dataUs[i]['party'] == "REP") {
                                $scope.rpValue = $scope.rpValue + 1;
                            }
                        }

                        //Quizas no los representa porque son número muy grandes...PROBAR CON PORCENTAJES!!!
                        console.log("Controller intialized. Values... ");
                        console.log("PP: ", $scope.ppValue);
                        console.log("PSOE: ", $scope.psoeValue);
                        console.log("C's: ", $scope.csValue);
                        console.log("PODEMOS: ", $scope.podemosValue);
                        console.log("DEM: ", $scope.dpValue);
                        console.log("REP: ", $scope.rpValue);

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
                                    value: $scope.ppValue
                                }, {
                                    name: 'PSOE',
                                    parent: 'B',
                                    value: $scope.psoeValue
                                }, {
                                    name: 'Podemos',
                                    parent: 'B',
                                    value: $scope.podemosValue
                                }, {
                                    name: 'C',
                                    parent: 'A',
                                    value: $scope.csValue
                                }, {
                                    name: 'Republican Party', //Derecha
                                    parent: 'A',
                                    value: $scope.rpValue
                                }, {
                                    name: 'Democratic Party', //Izquierda
                                    parent: 'B',
                                    value: $scope.dpValue
                                }]
                            }],
                            title: {
                                text: 'Parties in the US and in Spain'
                            }
                        });
                    });
            });
    }]);
