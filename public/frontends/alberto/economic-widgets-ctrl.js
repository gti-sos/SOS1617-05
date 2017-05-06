angular
            .module("ManagerApp")
            .controller("EconomicWidgetsCtrl", ["$http","$scope", function($http,$scope) {
                $scope.apikey = "cinco";
                $scope.data = {};
                var data = {};
                $scope.categorias = [];
                $scope.gdp = [];
                $scope.debt = [];
                $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        console.log(res.data);
                        data = res.data;
                        $scope.data=data;
                        
                        for(var i=0;i<res.data.length;i++){
                            $scope.categorias.push($scope.data[i].province);
                            $scope.gdp.push(Number($scope.data[i]["gdp"]));
                            $scope.debt.push(Number($scope.data[i]["debt"]));
                            
                            console.log($scope.data[i].province + " " + $scope.data[i].year);
                        }
                    });
                                    console.log("Controller intialized");

                    /*
                        Highcharts.chart('chart', {
                            series: [{
                                data: res.data.map(function(d) {
                                    return Number(d.data);
                                })
                            }]

                        });*/
                        $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        //Geocharts
                        google.charts.load('current', {
                            'packages': ['geochart']
                        });
                        google.charts.setOnLoadCallback(drawRegionsMap);

                        function drawRegionsMap() {

                            var myData = [['Province','gdp','debt']];
                            res.data.forEach(function (d){
                                myData.push([d.province,Number(d["gdp"]),Number(d["debt"])]);
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
