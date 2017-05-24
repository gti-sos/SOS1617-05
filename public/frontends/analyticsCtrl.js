/*global angular*/
/*global EJSC*/

angular
    .module("ManagerApp")
    .controller("AnalyticsCtrl", ["$http", "$scope", function($http, $scope) {

        $scope.apikey = "cinco";

        $scope.provincesElections = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.dataElections = {};
        var dataElections = {};

        $scope.provincesEcononomic = [];
        $scope.year = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.dataEconomic = {};
        var dataEconomic = {};


        $http
            .get("/api/v1/elections-voting-stats?apikey=" + $scope.apikey)
            .then(function(res) {

                dataElections = res.data;
                $scope.dataElections = dataElections;

                for (var i = 0; i < res.data.length; i++) {
                    $scope.provincesElections.push($scope.dataElections[i].province);
                    $scope.year.push(Number($scope.dataElections[i].year));
                    $scope.pp.push(Number($scope.dataElections[i].pp));
                    $scope.podemos.push(Number($scope.dataElections[i].podemos));
                    $scope.psoe.push(Number($scope.dataElections[i].psoe));
                    $scope.cs.push(Number($scope.dataElections[i].cs));

                    console.log($scope.data[i].province);
                }

                $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        dataEconomic = res.data;
                        $scope.dataEconomic = dataEconomic;

                        for (var i = 0; i < res.data.length; i++) {
                            $scope.year.push($scope.data[i].year);
                            $scope.provincesEconomic.push($scope.dataEconomic[i].province + "-" + $scope.data[i].year);
                            $scope.gdp.push(Number($scope.dataEconomic[i]["gdp"]));
                            $scope.debt.push(Number($scope.dataEconomic[i]["debt"]));

                            console.log($scope.data[i].province + " " + $scope.data[i].year);
                        }

                        var chart = new EJSC.Chart("containerBoth");
                        
                        var scatterSeries1 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [.5, .7],
                                [1, 4],
                                [2, 5],
                                [5, 6],
                                [5.2, 2.33],
                                [6, 8],
                                [9, 5],
                                [9.2, 4],
                                [10, 7.2]
                            ]), {
                                title: "PP",
                                useColorArray: true,
                                color: "rgb(30,144,255)",
                                pointStyle: "box"
                            }
                        );

                        var scatterSeries2 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [.7, .5],
                                [4, 1],
                                [5, 2],
                                [6, 5],
                                [2.33, 5.2],
                                [8, 6],
                                [5, 9],
                                [4, 9.2],
                                [7.2, 10]
                            ]), {
                                title: "PSOE",
                                useColorArray: true,
                                color: "rgb(255,0,0)",
                                pointStyle: "triangle"
                            }
                        );

                        var scatterSeries3 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [7.8, 4],
                                [5.4, .4],
                                [5.2, 5.6],
                                [9, .6],
                                [3.9, 2.33],
                                [7, 2],
                                [4.5, 8],
                                [.2, 6.2],
                                [7, .2]
                            ]), {
                                title: "PODEMOS",
                                useColorArray: true,
                                color: "rgb(153,0,153)",
                                pointStyle: "circle"
                            }
                        );

                        var scatterSeries4 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [4, 7.9],
                                [1, 10],
                                [5.6, 5],
                                [.6, 8],
                                [2.3, 3.3],
                                [2, 2.6],
                                [8, 4.5],
                                [6.2, 6],
                                [10, 9]
                            ]), {
                                title: "C's",
                                useColorArray: true,
                                color: "rgb(255,128,0)",
                                pointStyle: "diamond"
                            }
                        );
                        
                        var scatterSeries5 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [4, 7.9],
                                [1, 10],
                                [5.6, 5],
                                [.6, 8],
                                [2.3, 3.3],
                                [2, 2.6],
                                [8, 4.5],
                                [6.2, 6],
                                [10, 9]
                            ]), {
                                title: "GDP",
                                useColorArray: true,
                                color: "rgb(96,96,96)",
                                pointStyle: "diamond"
                            }
                        );
                        
                        var scatterSeries6 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler([
                                [4, 7.9],
                                [1, 10],
                                [5.6, 5],
                                [.6, 8],
                                [2.3, 3.3],
                                [2, 2.6],
                                [8, 4.5],
                                [6.2, 6],
                                [10, 9]
                            ]), {
                                title: "DEBT",
                                useColorArray: true,
                                color: "rgb(255,255,255)",
                                pointStyle: "diamond"
                            }
                        );
                        
                        chart.addSeries(scatterSeries1);
                        chart.addSeries(scatterSeries2);
                        chart.addSeries(scatterSeries3);
                        chart.addSeries(scatterSeries4);
                        chart.addSeries(scatterSeries5);
                        chart.addSeries(scatterSeries6);

                        chart.addSeries(new EJSC.TrendSeries(scatterSeries1, "linear", { //PP
                            color: "rgb(30,144,255)"
                        }));

                        chart.addSeries(new EJSC.TrendSeries(scatterSeries2, "linear", { //PSOE
                            color: "rgb(132,129,91)"
                        }));

                        chart.addSeries(new EJSC.TrendSeries(scatterSeries3, "linear", {//PODEMOS
                            color: "rgb(74,26,44)"
                        }));

                        chart.addSeries(new EJSC.TrendSeries(scatterSeries4, "linear", {//C'S
                            color: "rgb(142,53,87)"
                        }));
                        
                        chart.addSeries(new EJSC.TrendSeries(scatterSeries5, "linear", {//GDP
                            color: "rgb(142,53,87)"
                        }));
                        
                        chart.addSeries(new EJSC.TrendSeries(scatterSeries6, "linear", {//DEBT
                            color: "rgb(142,53,87)"
                        }));
                    });
            });
    }]);
