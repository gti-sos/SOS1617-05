 
/*global angular*/
angular
    .module("ManagerApp")
    .controller("ExternalEconomicWidgetsCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.apikey = "cinco";
        $scope.data = {};
        var data = {};
        $scope.gdp = [];
        $scope.debt = [];
        $scope.province = [];
        $scope.provinces = [];

        
        //API externa FIFA World con proxy--->No tiene CORS
       
         $scope.title = [];
         $scope.country_id = [];


   $http
            .get("/economic-situation-stats/externalProxy")
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;
                for (var i = 0; i < res.data.length; i++) {
                    $scope.title.push(Number($scope.data[i]["title"]));
                    $scope.country_id.push(Number($scope.data[i]["country_id"]));
                  //  $scope.year.push(2014);
                    $scope.provinces.push($scope.data[i].$scope.country_id);

                              console.log($scope.data[i]);

                  }
            
      

        console.log("Controller intialized");
        
//MIS DATOS

       $http
            .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;

                for (var i = 0; i < res.data.length; i++) {
                    $scope.province.push(Number($scope.province[i]["province"]))
                    $scope.provinces.push($scope.data[i].$scope.province);
                    $scope.year.push(Number($scope.data[i]["year"]));
                    $scope.gdp.push(Number($scope.data[i]["gdp"]));
                    $scope.debt.push(Number($scope.data[i]["debt"]));
                  
                                        console.log($scope.data[i]);

                }
            
              //Geocharts 
              
                google.charts.load('current', {
                    'mapsApiKey': 'AIzaSyDft-LAnK-6P_m7RTRsbV7-oCLjEYe9ITU',
                    'packages': ['geochart'],
                });
                google.charts.setOnLoadCallback(drawMarkersMap);

                function drawMarkersMap() {

                    var myData = [
                        ['Province', 'gdp', 'debt','country_id']
                    ];
                    res.data.forEach(function(d) {
                        myData.push([d.provinces, Number(d["gdp"]), Number(d["debt"]),Number(d["country_id"])]);
                    });

                    var data = google
                        .visualization
                        .arrayToDataTable(myData);

                    var options = {
                        displayMode: 'markers',
                        colorAxis: {
                            colors: ['green', 'blue']
                        }
                    };

                    var chart = new google.visualization.GeoChart(
                        document.getElementById('chart_div'));

                    chart.draw(data, options);
                }

             });

            });
    }]);
