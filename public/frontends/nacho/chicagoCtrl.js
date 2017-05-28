/*global angular*/
/*global Morris*/


angular
    .module("ManagerApp")
    .controller("ChicagoCtrl", ["$http", "$scope", function($http, $scope) {

        function label(a) {
            var res = "";
            if (Number(a) > 300) {
                console.log("label...over 300");
                res = "$ divided by 100";
            }
            else {
                res = "Seats";
            }
            return res;
        }

        function amount(a) {
            var res;
            if (Number(a) > 300) {
                console.log("amount...over 300");
                res = (a / 100).toString();
            }
            else {
                res = a.toString();
            }
            return res;
        }

        // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked-percent/

        //LA CUARTA (LA DE ZALANDO ES LA TERCERA) PUEDE SER LA DE CHICAGO (https://data.cityofchicago.org/resource/ydr8-5enu.json?) EN UN GRÁFICO DE BARRAS. Una barra para cada partido y despues una barra 
        //para cada "algo" (por ejemplo: AVE, ST, BVD, RD, etc...) de los datos del json que muestre el gasto (por ejemplo) en ese algo.
        //O también, dado que los recursos tienen fecha, mostrar los gastos en cada año.

        //Spain Elections data (My API)
        $scope.apikey = "cinco";
        $scope.ppValue = 0;
        $scope.podemosValue = 0;
        $scope.psoeValue = 0;
        $scope.csValue = 0;
        $scope.data = {};
        var data = {};

        $scope.st = 0;
        $scope.ave = 0;
        $scope.pl = 0;
        $scope.blvd = 0;
        $scope.ct = 0;
        $scope.pkwy = 0;
        $scope.rd = 0;
        $scope.ter = 0;
        $scope.dr = 0;
        $scope.dataChicago = {};
        var dataChicago = {};


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
                    .get("https://data.cityofchicago.org/resource/ydr8-5enu.json?") //AL ACCEDER A EST URL ME DICE: 301 Moved Permanently !!!!!!
                    .then(function(res) {

                        dataChicago = res.data;
                        $scope.dataChicago = dataChicago;
                        for (var i = 0; i < res.data.length; i++) { //HAY ALGÚN PARTIDO QUE NO SEA ALGUNO DE ESTOS 2 EN EL JSON QUE SE DEVUELVE???
                            if ($scope.dataChicago[i]._suffix == 'ST') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.st = $scope.st + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'AVE') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.ave = $scope.ave + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'PL') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.pl = $scope.pl + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'BLVD') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.blvd = $scope.blvd + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'CT') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.ct = $scope.ct + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'PKWY') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.pkwy = $scope.pkwy + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'RD') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.rd = $scope.rd + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'TER') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.ter = $scope.ter + Number($scope.dataChicago[i]._amount_paid);
                            }
                            else if ($scope.dataChicago[i]._suffix == 'DR') {
                                console.log("dato: ", $scope.dataChicago[i]._amount_paid);

                                $scope.dr = $scope.dr + Number($scope.dataChicago[i]._amount_paid);
                            }
                        }

                        //Quizas no los representa porque son número muy grandes...PROBAR CON PORCENTAJES!!!
                        console.log("Controller intialized. Values... ");
                        console.log("PP: ", $scope.ppValue);
                        console.log("PSOE: ", $scope.psoeValue);
                        console.log("C's: ", $scope.csValue);
                        console.log("PODEMOS: ", $scope.podemosValue);
                        console.log("ST: ", $scope.st);
                        console.log("PL: ", $scope.pl);
                        console.log("PKWY: ", $scope.pkwy);
                        console.log("TER: ", $scope.ter);

                        //Posibles librerías: morris.js , chartist.js , 

                        new Morris.Bar({
                            element: 'containerChicago',
                            data: [{
                                y: 'PP',
                                a: $scope.ppValue
                            }, {
                                y: 'PSOE',
                                a: $scope.psoeValue
                            }, {
                                y: "C's",
                                a: $scope.csValue
                            }, {
                                y: 'POD',
                                a: $scope.podemosValue
                            }, {
                                y: 'ST', //SE PODRÍA PONER OTRA SERÍA PARA LOS 9 suffix CON OTRO DE LOS VALORES NUMÉRICOS QUE HAY EN EL JSON!
                                a: $scope.st/100
                            }, {
                                y: 'PL',
                                a: $scope.pl/100
                            }, {
                                y: 'AVE',
                                a: $scope.ave/100
                            }, {
                                y: 'RD',
                                a: $scope.rd/100
                            }, {
                                y: 'CT',
                                a: $scope.ct/100
                            }, {
                                y: 'PK', /*'PKWY',*/
                                a: $scope.pkwy/100
                            }, {
                                y: "BLVD",
                                a: $scope.blvd/100
                            }, {
                                y: 'TER',
                                a: $scope.ter/100
                            }, {
                                y: 'DR',
                                a: (($scope.dr/100).toString() + " $")
                            }],
                            /*xkey: 'y',
                            ykeys: ['a', 'b'],
                            labels: ['Series A', 'Series B']*/
                            xkey: 'y',
                            ykeys: ['a', 'b'],
                            labels: []
                        });
                    });
            });
    }]);
