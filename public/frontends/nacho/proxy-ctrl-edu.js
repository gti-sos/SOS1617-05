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
        $scope.edu = [];
        $scope.dataEdu = {};
        var dataEdu = {};

        //Add code here to import EDUCATION data (proxy):
        $http
            .get("/education?apikey=" + $scope.apikey)
            .then(function(res) {

                dataEdu = res.data;
                $scope.dataEdu = dataEdu;

                for (var i = 0; i < $scope.dataEdu.length; i++) {
                    $scope.edu.push([$scope.dataEdu[i].country.toString(), $scope.dataEdu[i]["education-primary-per-capita"]]);
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
                            $scope.pp.push([$scope.data[i].province.toString(), Number($scope.data[i].pp)]);
                            $scope.podemos.push([$scope.data[i].province.toString(), Number($scope.data[i].podemos)]);
                            $scope.psoe.push([$scope.data[i].province.toString(), Number($scope.data[i].psoe)]);
                            $scope.cs.push([$scope.data[i].province.toString(), Number($scope.data[i].cs)]);

                            console.log($scope.data[i].province);
                        }

                        console.log("Controller intialized");



                        //var sum = [1, 2, 3].reduce(add, 0);
                        function add(a, b) {
                            return a[1] + b[1];
                        }
                        // Create the chart
                        Highcharts.chart('containerEDU', {
                            chart: {
                                type: 'pie'
                            },
                            title: {
                                text: "Spain's 2016 elections results combined with education stats"
                            },
                            subtitle: {
                                text: 'Click the slices to see more info.'
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.name}: {point.y:.1f}'
                                    }
                                }
                            },

                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> <br/>'
                            },
                            series: [{
                                name: 'Parties',
                                colorByPoint: true,
                                data: [{
                                    color: 'blue',
                                    name: 'PP',
                                    y: $scope.pp.reduce(add, 0),
                                    drilldown: 'PP'
                                }, {
                                    color: 'red',
                                    name: 'PSOE',
                                    y: $scope.psoe.reduce(add, 0),
                                    drilldown: 'PSOE'
                                }, {
                                    color: 'orange',
                                    name: "C's",
                                    y: $scope.cs.reduce(add, 0),
                                    drilldown: "C's"
                                }, {
                                    color: 'purple',
                                    name: 'Podemos',
                                    y: $scope.podemos.reduce(add, 0),
                                    drilldown: 'Podemos'
                                }, {
                                    color: 'gray',
                                    name: 'Primary education (p/c)',
                                    y: $scope.edu,
                                    drilldown: 'Primary education (p/c)'
                                }]
                            }],
                            drilldown: {
                                series: [{
                                    name: 'PP',
                                    id: 'PP',
                                    data: $scope.pp
                                }, {
                                    name: 'PSOE',
                                    id: 'PSOE',
                                    data: $scope.podemos
                                }, {
                                    name: "C's",
                                    id: "C's",
                                    data: $scope.cs
                                }, {
                                    name: 'Podemos',
                                    id: 'Podemos',
                                    data: $scope.podemos
                                }, {
                                    name: 'Primary education (p/c)',
                                    id: 'Primary education (p/c)',
                                    data: $scope.edu
                                }]
                            }
                        });
                    });
            });
    }]);
