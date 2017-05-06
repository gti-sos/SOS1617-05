/*global google*/
/*global angular*/
/*global Highcharts*/
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

                  
                        $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        //Geocharts 
                        google.charts.load('current', {
                            'packages': ['geochart']
                        });
                        google.charts.setOnLoadCallback(drawMarkersMap);

                        function drawMarkersMap() {

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
                                        document.getElementById('chart_div'));

                            chart.draw(data, options);
                        }

                   
                    //HighCharts
     Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Economic Situatuion Stats in Spain'
    },


    yAxis: {
        title: {
            text: 'EUROS'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            pointStart: 2006
        }
    },

    series: [{
        name: 'gdp',
        data: $scope.gdp
    }, {
        name: 'debt',
        data: $scope.debt
     
    }]
     });

});
            }]);
