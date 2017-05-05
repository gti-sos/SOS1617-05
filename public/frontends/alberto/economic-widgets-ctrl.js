angular
            .module("ManagerApp")
            .controller("EconomicWidgetsCtrl", ["$http","$scope", function($http,$scope) {
                console.log("Controller intialized");
                $scope.apikey = "cinco";
                $http
                    .get("/api/v1/economic-situation-stats?apikey=" + $scope.apikey)
                    .then(function(res) {
                        console.log(res.data);
                    /*
                        Highcharts.chart('chart', {
                            series: [{
                                data: res.data.map(function(d) {
                                    return Number(d.data);
                                })
                            }]

                        });*/
                        //Geocharts
                        google.charts.load('current', {
                            'packages': ['geochart']
                        });
                        google.charts.setOnLoadCallback(drawRegionsMap);

                        function drawRegionsMap() {

                            var myData = [['Province', 'gdp']];
                            res.data.forEach(function (d){
                                myData.push([d.province,d.gdp]);
                            });

                            var data = google
                                            .visualization
                                            .arrayToDataTable(myData);

                             var options = {
                              region: 'ES',
                              displayMode: 'markers',
                                colorAxis: {colors: ['green', 'blue']}
                          };

                            var chart = new google.visualization.GeoChart(
                                        document.getElementById('map'));

                            chart.draw(data, options);
                        }

                    });
            }]);
