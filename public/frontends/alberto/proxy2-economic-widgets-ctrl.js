
/*global angular*/
/*global Highcharts*/
angular
    .module("ManagerApp")
    .controller("Proxy2EconomicWidgetsCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.apikey = "cinco";
        $scope.data = {};
        var data = {};
        $scope.categories = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.year = [];

        
        //API Grupo 07 con proxy
       
        $scope.averageSalary = [];
        $scope.minimumSalary = [];
        $scope.riskOfPoverty = [];

        

   $http
            .get("/economic-situation-stats/proxy2")
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;
                for (var i = 0; i < res.data.length; i++) {
                    $scope.year.push(Number($scope.data[i]["year"]));
                    $scope.categories.push($scope.data[i].year);
                $scope.averageSalary.push(Number($scope.data[i]["averageSalary"]));
                $scope.minimumSalary.push(Number($scope.data[i]["minimumSalary"]));
                $scope.riskOfPoverty.push(Number($scope.data[i]["riskOfPoverty"]));
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
                    $scope.year.push(Number($scope.data[i]["year"]));
                    $scope.categories.push($scope.data[i].year);
                    $scope.gdp.push(Number($scope.data[i]["gdp"]));
                    $scope.debt.push(Number($scope.data[i]["debt"]));
                                        console.log($scope.data[i]);

                }
                    console.log($scope.data[i]);
            
                //HighCharts
                 $(document).ready(function() {
                    

                    var myData2 = [];
                    res.data.forEach(function(d) {
                        myData2.push([Number(d.year), Number(d.gdp), Number(d.debt),
                        Number(d.averageSalary),Number(d.minimumSalary),Number(d.riskOfPoverty)]);
                    });
                    


                    var g = new Dygraph(document.getElementById("graphProxy"), myData2, {

                        labels: ["year", "gdp", "dbt","averageSalary","minimumSalary","riskOfPoverty"],
                        legend: 'always',
                        title: "Comparative chart of gdp, debt, averageSalary, minimumSalary and riskOfPoverty in Spain\n",
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
            });
   
    }]);
