angular
    .module("ManagerApp")
    .controller("EducationCtrl", ["$http", "$scope", function($http, $scope) {

        // https://www.highcharts.com/docs/chart-and-series-types/chart-types

        //Cant use types: column, line, column
        //https://www.highcharts.com/docs/chart-and-series-types/error-bar-series
        //This controller works with EDUCATION (Marcus) data using proxy


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

        //Education data
        $scope.edu= [];
        $scope.dataEdu = {};
        var dataEdu = {};

        //Add code here to import EDUCATION data (proxy):
        $http
            .get("/education?apikey=" + $scope.apikey)
            .then(function(res) {

                dataEdu = res.data;
                $scope.dataEdu = dataEdu;

                for (var i = 0; i < $scope.dataEdu.length; i++) {
                    $scope.edu.push($scope.dataEdu[i]["education-primary-per-capita"]);
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

                        Highcharts.chart('container', {
                            chart: {
                                zoomType: 'xy'
                            },
                            title: {
                                text: "Spain's 2016 elections results combined with education stats"
                            },
                            xAxis: [{
                                categories: $scope.province
                            }],
                            yAxis: [{ // Primary yAxis
                                labels: {
                                    format: '{value} °C',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                title: {
                                    text: 'Temperature',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                }
                            }, { // Secondary yAxis
                                title: {
                                    text: 'Rainfall',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                labels: {
                                    format: '{value} mm',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                opposite: true
                            }],

                            tooltip: {
                                shared: true
                            },

                            series: [{
                                name: 'PP seats',
                                type: 'column',
                                yAxis: 1,
                                data: $scope.pp,
                                tooltip: {
                                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} mm</b> '
                                }
                            }, {
                                name: 'Temperature',
                                type: 'spline',
                                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                                tooltip: {
                                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}°C</b> '
                                }
                            }]
                        });

                        //Highcharts
                        Highcharts.chart('container', {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'Stacked column chart'
                            },
                            xAxis: { //Estas serían las provincias (SÓLO ES OBLIGATORIO QUE SE MUESTREN TODAS EN UN ÚNICO WIDGET)
                                categories: $scope.province
                                    //['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Granada', 'Cordoba', 'Almeria', 'Huelva', 'Cadiz', 'Jaen', 'Malaga']
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: "Spain's 2016 general elections voting results"
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                                shared: false
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'percent',
                                }
                            },

                            //Estas serían para cada una de las provincias los valores que toma cada name, que son los partidos
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
                            }]
                        });


                    });
            });




    }]);
