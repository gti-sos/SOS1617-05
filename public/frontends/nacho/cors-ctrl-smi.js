/*global angular*/
/*global Highcharts*/
angular
    .module("ManagerApp")
    .controller("SmiCtrl", ["$http", "$scope", function($http, $scope) {

        // https://www.highcharts.com/docs/chart-and-series-types/chart-types

        //Cant use types: column, column 
        //https://www.highcharts.com/docs/chart-and-series-types/line-chart

        //This controller works with SMI (José) data using CORS HEADERS

        //Elections data
        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};

        //SMI data
        $scope.smiVariation = [];
        $scope.dataSMI = {};
        var dataSMI = {};

        var sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field]);
                } :
                function(x) {
                    return x[field];
                };

            reverse = !reverse ? 1 : -1;

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            };
        };

        //Add code here to import SMI data (CORS):
        $http
            .get("https://sos1617-02.herokuapp.com/api/v1/smi-stats?apikey=rXD8D2b1vP")
            .then(function(res) {


                dataSMI = res.data;
                $scope.dataSMI = dataSMI;
                //data.sort(sort_by('province', true, parseInt));

                for (var i = 0; i < $scope.dataSMI.length; i++) {
                    $scope.smiVariation.push(Number($scope.dataSMI[i]["smi-year-variation"]));
                }


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

                        console.log("Controller intialized");

                        //Highcharts
                        Highcharts.chart('containerSMI', {
                            title: {
                                text: "Spain's 2016 elections results and Minimum Interprofessional Salary"
                            },
                            xAxis: { //Estas serían las provincias (SÓLO ES OBLIGATORIO QUE SE MUESTREN TODAS EN UN ÚNICO WIDGET)
                                categories: $scope.province
                                    //['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Granada', 'Cordoba', 'Almeria', 'Huelva', 'Cadiz', 'Jaen', 'Malaga']
                            },
                            series: [{
                                name: 'pp',
                                data: $scope.pp
                            }, {
                                name: 'podemos',
                                data: $scope.podemos
                            }, {
                                name: 'psoe',
                                data: $scope.psoe
                            }, {
                                name: 'cs',
                                data: $scope.cs
                            }, {
                                name: 'SMI Year Variation',
                                data: $scope.smiVariation
                            }]

                        });
                    });
            });
    }]);
