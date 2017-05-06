angular
            .module("ManagerApp")
            .controller("EconomicWidgetsCtrl", ["$http","$scope", function($http,$scope) {
                
                $scope.apikey="cinco";
                $scope.categories = [];
                $scope.gdp = [];
                $scope.debt = [];
                $scope.data={};
                var data ={};
                
                $http
                    .get("/api/v1/economic-situation-stats?apikey=" + $scope.apikey)
                    .then(function(res) {

            data=res.data;
            $scope.data = data;
            
            for(var i=0; i<res.data.length; i++){
                $scope.categories.push($scope.data[i].province + "-" + $scope.data[i].year);
                $scope.gdp.push(Number($scope.data[i].gdp));
                $scope.debt.push(Number($scope.data[i].dbt));
               
               console.log($scope.data[i].province);
            }
                    });
                console.log("Controller intialized");
   $http
                    .get("/api/v1/economic-situation-stats?apikey=" + $scope.apikey)
                    .then(function(res) {

     Highcharts.chart('container', {
    title: {
                    text: 'Highcharts'
    },
    chart: {
        type: 'area'
    },
    xAxis: {
        categories: $scope.categories
        
    },
    legend: {
                    layout: 'vertical',
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    verticalAlign: 'top',
                    align: 'right',
                    y: 60,
                    x: -60
    },
    tooltip: {
        formatter: function (){
            return '<b>' + this.series.province + '</b><br/>' +
                       (this.x) + ': ' + this.y;
        } 
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
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
                        //Geocharts
                        google.charts.load('current', {
                            'packages': ['geochart']
                        });
                        google.charts.setOnLoadCallback(drawRegionsMap);

                        function drawRegionsMap() {

                            var myData = [['Province', 'Gdp','Year']];
                            res.data.forEach(function (d){
                                myData.push([d.province, Number(d.gdp), Number(d.year)]);
                            });

                            var data = google
                                            .visualization
                                            .arrayToDataTable(myData);

                             var options = {
                                region: 'ES',
                               displayMode: 'markers',
                                colorAxis: {colors: ['green', 'blue','yellow']}
                          };

                            var chart = new google.visualization.GeoChart(
                                        document.getElementById('map'));

                            chart.draw(data, options);
                        }

                    });
            }]);
