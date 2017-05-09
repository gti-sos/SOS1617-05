/*global google*/
/*global angular*/
/*global Highcharts*/
angular
    .module("ManagerApp")
    .controller("EconomicWidgetsCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.apikey = "cinco";
        $scope.data = {};
        var data = {};
        $scope.categories = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.year = [];
        $http
            .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;

                for (var i = 0; i < res.data.length; i++) {
                    $scope.year.push($scope.data[i].year);
                    $scope.categories.push($scope.data[i].province + "-" + $scope.data[i].year);
                    $scope.gdp.push(Number($scope.data[i]["gdp"]));
                    $scope.debt.push(Number($scope.data[i]["debt"]));

                    console.log($scope.data[i].province + " " + $scope.data[i].year);
                }
            });
        console.log("Controller intialized");

        $http
            .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
            .then(function(res) {
                //HighCharts
                Highcharts.chart('container', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'gdp,debt and year of provinces in Spain'
                    },
                    xAxis: {
                        categories: $scope.categories,
                        title: {
                            text: 'province-year',
                            align: 'high'
                        },
                    },

                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Euros',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: 'millions'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            },

                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 80,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    series: [{
                        name: 'gdp ',
                        data: $scope.gdp
                    }, {
                        name: 'debt',
                        data: $scope.debt

                    }]
                });
                //Geocharts 
                google.charts.load('current', {
                    'mapsApiKey': 'AIzaSyDft-LAnK-6P_m7RTRsbV7-oCLjEYe9ITU',
                    'packages': ['geochart'],
                });
                google.charts.setOnLoadCallback(drawMarkersMap);

                function drawMarkersMap() {

                    var myData = [
                        ['Province', 'gdp', 'debt']
                    ];
                    res.data.forEach(function(d) {
                        myData.push([d.province, Number(d["gdp"]), Number(d["debt"])]);
                    });

                    var data = google
                        .visualization
                        .arrayToDataTable(myData);

                    var options = {
                        region: 'ES',
                        displayMode: 'markers',
                        colorAxis: {
                            colors: ['green', 'blue']
                        }
                    };

                    var chart = new google.visualization.GeoChart(
                        document.getElementById('chart_div'));

                    chart.draw(data, options);
                }



                //dygraphs
                $(document).ready(function() {
                    

                    var myData2 = [];
                    res.data.forEach(function(d) {
                        myData2.push([Number(d.year), Number(d.gdp), Number(d.debt)]);
                    });


                    var g = new Dygraph(document.getElementById("graph"), myData2, {

                        labels: ["year", "gdp", "dbt"],
                        legend: 'always',
                        title: "Comparative chart of gdp and debt in Spain\n",
                        showRoller: true,
                        rollPeriod: 1,
                        animatedZooms: true,
                        ylabel: 'Euros',
                        fillGraph: false

                       

                    });
                    function restorePositioning(g) {
                    g.updateOptions({
                   dateWindow: null,
                     valueRange: null
                });
                    }
         document.getElementById("restore").onclick = function() {
      restorePositioning(g);
      };


                });

            });
    }]);
