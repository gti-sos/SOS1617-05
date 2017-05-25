/*global angular*/

angular
    .module("ManagerApp")
    .controller("ZalandoCtrl", ["$http", "$scope", function($http, $scope) {

        // ep: https://shop-public-api.perimeter.zalan.do/domains

        //Elections data
        $scope.apikey = "cinco";
        $scope.province = [];
        $scope.year = [];
        $scope.pp = [];
        $scope.podemos = [];
        $scope.psoe = [];
        $scope.cs = [];
        $scope.data = {};
        var data = {};

        //Zalando's data
        $scope.countryCode = [];
        $scope.shopUrl = [];
        $scope.dataZalando = {};
        var dataZalando = {};



        //Add code here to import zalando's data:
        $http
            .get("https://shop-public-api.perimeter.zalan.do/domains")
            .then(function(res) {

                console.log("Getting Zalando data");
                dataZalando = res.data;
                $scope.dataZalando = dataZalando;

                for (var i = 0; i < $scope.dataZalando.length; i++) {
                    $scope.countryCode.push($scope.dataZalando[i].countryCode);
                    $scope.shopUrl.push($scope.dataZalando[i].shopUrl);
                    console.log($scope.dataZalando[i].countryCode);
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

                        
                    });
            });
    }]);
