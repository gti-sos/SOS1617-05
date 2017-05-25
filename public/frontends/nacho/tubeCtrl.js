/*global angular*/
/*global Plotly*/

angular
    .module("ManagerApp")
    .controller("TubeCtrl", ["$http", "$scope", function($http, $scope) {

        // ep: http://marquisdegeek.com/api/tube/
        //id: containerTube

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

        //Zalando's data
        $scope.countryCode = [];
        $scope.shopUrl = [];
        $scope.dataZalando = {};
        var dataZalando = {};



        //Add code here to import zalando's data:
        $http
            .get("http://marquisdegeek.com/api/tube/")
            .then(function(res) {

                console.log("Getting Zalando data");
                dataZalando = res.data;
                $scope.dataZalando = dataZalando;

                for (var i = 0; i < $scope.dataZalando.length; i++) {
                    $scope.countryCode.push($scope.dataZalando[i].countryCode);
                    $scope.shopUrl.push($scope.dataZalando[i].shopUrl);
                    console.log($scope.dataZalando[i].countryCode);
                }


                $http
                    .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
                    .then(function(res) {

                        console.log("Getting Elections data");
                        data = res.data;
                        $scope.data = data;

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


                        var data = [{
                            type: 'scattergeo',
                            mode: 'markers+text',
                            text: [
                                'Montreal', 'Toronto', 'Vancouver', 'Calgary', 'Edmonton',
                                'Ottawa', 'Halifax', 'Victoria', 'Winnepeg', 'Regina'
                            ],
                            lon: [-73.57, -79.24, -123.06, -114.1, -113.28, -75.43, -63.57, -123.21, -97.13, -104.6],
                            lat: [
                                45.5, 43.4, 49.13, 51.1, 53.34, 45.24,
                                44.64, 48.25, 49.89, 50.45
                            ],
                            marker: {
                                size: 7,
                                color: [
                                    '#bebada', '#fdb462', '#fb8072', '#d9d9d9', '#bc80bd',
                                    '#b3de69', '#8dd3c7', '#80b1d3', '#fccde5', '#ffffb3'
                                ],
                                line: {
                                    width: 1
                                }
                            },
                            name: 'Canadian cities',
                            textposition: [
                                'top right', 'top left', 'top center', 'bottom right', 'top right',
                                'top left', 'bottom right', 'bottom left', 'top right', 'top right'
                            ],
                        }];

                        var layout = {
                            title: 'SOS1617-05 Integrations ©',
                            font: {
                                family: 'Droid Serif, serif',
                                size: 6
                            },
                            titlefont: {
                                size: 16
                            },
                            geo: {
                                scope: 'europe',
                                resolution: 50,
                                lonaxis: {
                                    'range': [-130, -55]
                                },
                                lataxis: {
                                    'range': [40, 70]
                                },
                                showrivers: true,
                                rivercolor: '#fff',
                                showlakes: true,
                                lakecolor: '#fff',
                                showland: true,
                                landcolor: '#EAEAAE',
                                countrycolor: '#d3d3d3',
                                countrywidth: 1.5,
                                subunitcolor: '#d3d3d3'
                            }
                        };

                        Plotly.newPlot('containerZalando', data, layout);


                    });
            });
    }]);





