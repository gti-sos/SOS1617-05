/*global angular*/
/*global EJSC*/

angular
    .module("ManagerApp")
    .controller("AnalyticsCtrl", ["$http", "$scope", function($http, $scope) {

        $scope.apikey = "cinco";

        //$scope.provincesElections = [];
        //$scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.dataElections = {};
        var dataElections = {};

        //$scope.provincesEconomic = [];
        //$scope.year = [];
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
                    $scope.pp.push([$scope.dataElections[i].province,Number($scope.dataElections[i].pp)]);
                    $scope.psoe.push([$scope.dataElections[i].province,Number($scope.dataElections[i].psoe)]);
                    $scope.podemos.push([$scope.dataElections[i].province,Number($scope.dataElections[i].podemos)]);
                    $scope.cs.push([$scope.dataElections[i].province,Number($scope.dataElections[i].cs)]);

                    console.log($scope.dataElections[i].province);
                }

                $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        dataEconomic = res.data;
                        $scope.dataEconomic = dataEconomic;

                        for (var i = 0; i < res.data.length; i++) {
                            $scope.gdp.push([$scope.dataEconomic[i].province,Number($scope.dataEconomic[i].gdp)]);
                            $scope.debt.push([$scope.dataEconomic[i].province,Number($scope.dataEconomic[i].debt)]);

                            console.log($scope.dataEconomic[i].province);
                        }

                        var chart = new EJSC.Chart("containerBoth");
                        
                        var scatterSeries1 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler($scope.pp), {
                                title: "PP",
                                useColorArray: true,
                                color: "rgb(30,144,255)",
                                pointStyle: "box"
                            }
                        );

                        var scatterSeries2 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler($scope.psoe), {
                                title: "PSOE",
                                useColorArray: true,
                                color: "rgb(255,0,0)",
                                pointStyle: "triangle"
                            }
                        );

                        var scatterSeries3 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler($scope.podemos), {
                                title: "PODEMOS",
                                useColorArray: true,
                                color: "rgb(153,0,153)",
                                pointStyle: "circle"
                            }
                        );

                        var scatterSeries4 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler($scope.cs), {
                                title: "C's",
                                useColorArray: true,
                                color: "rgb(255,128,0)",
                                pointStyle: "diamond"
                            }
                        );
                        
                        var scatterSeries5 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler(), {
                                title: "GDP",
                                useColorArray: true,
                                color: "rgb(96,96,96)",
                                pointStyle: "diamond"
                            }
                        );
                        
                        var scatterSeries6 = new EJSC.ScatterSeries(
                            new EJSC.ArrayDataHandler(), {
                                title: "DEBT",
                                useColorArray: true,
                                color: "rgb(255,255,0)",
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
