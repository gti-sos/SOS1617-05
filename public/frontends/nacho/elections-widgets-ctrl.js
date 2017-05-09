angular
    .module("ManagerApp")
    .controller("ElectionsWidgetsCtrl", ["$http", "$scope", function($http, $scope) {

        // http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked-percent/

        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};
        var sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field])
                } :
                function(x) {
                    return x[field]
                };

            reverse = !reverse ? 1 : -1;

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }
        $http
            .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
            .then(function(res) {

                data = res.data;
                $scope.data = data;
                data.sort(sort_by('province', true, parseInt));

                //ESTO PARA QUÉ WIDGET ES?
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
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent',

                        }
                    },



                    //Estas serían para cada una de las provincias los valores que toma cada name, que son los partidos
                    series: [{
                        name: 'pp',
                        data: $scope.pp.
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


                //Geocharts
                google.charts.load('current', {
                    'mapsApiKey': 'AIzaSyDft-LAnK-6P_m7RTRsbV7-oCLjEYe9ITU',
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
                        //CONSULTAR: https://developers.google.com/chart/interactive/docs/gallery/geochart
                        displayMode: 'markers',
                        colorAxis: {
                            colors: ['blue', 'purple']
                        }
                    };

                    var chart = new google.visualization.GeoChart(
                        document.getElementById('map'));

                    chart.draw(data, options);
                }

                //EJSchart (puede ser un donut/pastel con colores, uno por cada partido político. Suponiendo que x sea la suma de escaños totales, cada porción 
                //representará la parte de x que ha ganado cada uno de los cuatro partidos, y así se tendrían todos los recursos con todos los datos en uso.)
                //debería poner aquí algo de EJSchart o ya con que esté en la carpeta aquella vale?

                /*var chart = new EJSC.Chart("myChart");
                chart.addSeries(new EJSC.AreaSeries(
                    new EJSC.ArrayDataHandler([
                        [1, 1],
                        [2, 2],
                        [3, 3],
                        [4, 2],
                        [5, 3]
                    ]))); */
                /*
                                var chart8a = new EJSC.Chart("myChart", {});

                                var series1 = chart8a.addSeries(new EJSC.PieSeries(
                                    new EJSC.ArrayDataHandler([

                                        /*[151, "pp"], //pp
                                        [73, "podemos"], //podemos
                                        [82, "psoe"], //psoe
                                        [30, "cs"], //cs 

                                        [1, "pp"], //pp
                                        [2, "podemos"], //podemos
                                        [3, "psoe"], //psoe
                                        [40, "cs"], //cs
                                    ]), {
                                        onAfterDataAvailable: function(chart, series) {
                                            chart.selectPoint(series.__points[0], true);
                                        }
                                    }
                                ));

                                series1.onPieceNeedsColor = function(point, series, chart) {
                                    var colors = [
                                        null,
                                        'rgb(0,0,255)', //pp
                                        'rgb(102,0,102)', //podemos
                                        'rgb(255,0,0)', //psoe
                                        'rgb(255,128,0)', //cs
                                    ];
                                    return colors[point.x];
                                }; */

                var chart = new EJSC.Chart("myChart", {
                    show_legend: false,
                    title: 'DoughnutSeries'
                });

                //var sum = [1, 2, 3].reduce(add, 0);
                function add(a, b) {
                    return a + b;
                }
                var series1 = chart.addSeries(new EJSC.DoughnutSeries(
                    new EJSC.ArrayDataHandler([
                        [$scope.pp.reduce(add, 0), "pp"], //pp
                        [$scope.podemos.reduce(add, 0), "podemos"], //podemos
                        [$scope.psoe.reduce(add, 0), "psoe"], //psoe
                        [$scope.cs.reduce(add, 0), "cs"], //cs
                    ]), {
                        opacity: 30, //default: 50
                        doughnutOffset: .2, //default: .5
                        position: "topRight", //default: "center"
                        height: "50%", //default: "100%"
                        width: "50%" //default: "100%"
                    }
                ));
                var series2 = chart.addSeries(new EJSC.DoughnutSeries(
                    new EJSC.ArrayDataHandler([
                        [151, "pp"], //pp
                        [73, "podemos"], //podemos
                        [82, "psoe"], //psoe
                        [30, "cs"], //cs
                    ]), {
                        opacity: 80, //default: 50
                        doughnutOffset: .7, //default: .5
                        position: "bottomLeft", //default: "center"
                        height: "70%", //default: "100%"
                        width: "70%", //default: "100%"
                        onAfterDataAvailable: function(chart, series) {
                            chart.selectPoint(series.__points[0], true);
                        }

                    }
                ));
                //Si intento cambiarle el color como a la versión PIE no se muestra el grafo
                /*series1.onPieceNeedsColor = function(point, series, chart) {
                    var colors = [
                        null,
                        'rgb(0,0,255)', //pp
                        'rgb(102,0,102)', //podemos
                        'rgb(255,0,0)', //psoe
                        'rgb(255,128,0)', //cs
                    ];
                    return colors[point.x];
                };
                series2.onPieceNeedsColor = function(point, series, chart) {
                    var colors = [
                        'rgb(0,0,255)', //pp
                        'rgb(102,0,102)', //podemos
                        'rgb(255,0,0)', //psoe
                        'rgb(255,128,0)', //cs
                    ];
                    return colors[point.x];
                };*/
            });
    }]);
