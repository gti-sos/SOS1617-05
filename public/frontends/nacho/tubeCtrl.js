/*global angular*/
/*global Plotly*/

angular
    .module("ManagerApp")
    .controller("TubeCtrl", ["$http", "$scope", function($http, $scope) {

        // ep: http://marquisdegeek.com/api/tube/
        //id: containerTube
        //Se puede hacer función auxiliar que devuelva longitud/latitud de determinado punto en un mapa.

        //Elections data: NO MOSTRAR TODOS...CUALES?? (VER GEOCHART)
        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};

        //London's tube data
        $scope.name = [];
        $scope.latitude = [];
        $scope.longitude = [];
        $scope.dataTube = {};
        var dataTube = {};

        //Add code here to import zalando's data:
        $http
            .get("https://marquisdegeek.com/api/tube/")
            .then(function(res) {

                console.log("Getting London's tube data");
                dataTube = res.data;
                $scope.dataTube = dataTube;

                for (var i = 0; i < $scope.dataTube.length; i++) {
                    $scope.name.push($scope.dataTube[i].name);
                    $scope.latitude.push($scope.dataTube[i].latitude);
                    $scope.longitude.push($scope.dataTube[i].longitude);
                    console.log($scope.dataTube[i].name);
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
                            text: $scope.name,
                            lon: $scope.longitude,
                            lat: $scope.latitude,
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
                                /*scope ( enumerated : "world" | "usa" | "europe" | "asia" | "africa" | "north america" | "south america" ) */
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

                        Plotly.newPlot('containerTube', data, layout);


                    });
            });
    }]);
