angular
    .module("ManagerApp")
    .controller("ElectionsWidgetsCtrl", ["$http", "$scope", function($http, $scope) {

        // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked-percent/

        $scope.apikey = "cinco";
        $scope.categories = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.data = {};
        var data = {};

        $http
            .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
            .then(function(res) {

                data = res.data;
                $scope.data = data;

                for (var i = 0; i < res.data.length; i++) {
                    $scope.categories.push($scope.data[i].province + "-" + $scope.data[i].year);
                    $scope.gdp.push(Number($scope.data[i].gdp));
                    $scope.debt.push(Number($scope.data[i].dbt));

                    console.log($scope.data[i].province);
                }

                console.log("Controller intialized");




                Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Stacked column chart'
                    },
                    xAxis: { //Estas serían las provincias (SÓLO ES OBLIGATORIO QUE SE MUESTREN TODAS EN UN ÚNICO WIDGET)
                        categories: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Granada', 'Cordoba', 'Almeria', 'Huelva', 'Cadiz', 'Jaen', 'Malaga']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: "Spain's 2016 general elections voting results"
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent'
                        }
                    },



                    //Estas serían para cada una de las provincias los valores que toma cada name, que son los partidos
                    series: [{
                        name: 'pp',
                        data: [17, 4, 7, 5, 3, 2, 4, 2, 3, 2, 4]
                    }, {
                        name: 'podemos',
                        data: [6, 9, 5, 4, 1, 1, 0, 1, 2, 2, 2]
                    }, {
                        name: 'psoe',
                        data: [8, 5, 3, 3, 2, 2, 2, 2, 3, 2, 3]
                    }, {
                        name: 'cs',
                        data: [5, 4, 2, 0, 1, 1, 1, 0, 1, 0, 2]
                    }]
                });

                //Geocharts
                google.charts.load('current', {
                    'packages': ['geochart']
                });
                google.charts.setOnLoadCallback(drawRegionsMap);

                function drawRegionsMap() {

                    var myData = [ //no tienen que estar todos los campos
                        ['Province', 'podemos', 'Year']
                    ];
                    res.data.forEach(function(d) {
                        myData.push([d.province, Number(d.podemos), Number(d.year)]);
                    });

                    var data = google
                        .visualization
                        .arrayToDataTable(myData);

                    var options = {
                        region: 'ES',
                        displayMode: 'markers',
                        colorAxis: {
                            colors: ['green', 'blue', 'yellow']
                        }
                    };

                    var chart = new google.visualization.GeoChart(
                        document.getElementById('map'));

                    chart.draw(data, options);
                }

            });
    }]);
