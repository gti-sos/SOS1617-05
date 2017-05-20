
/*global angular*/
/*global Highcharts*/
angular
    .module("ManagerApp")
    .controller("CorsEconomicWidgetsCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.apikey = "cinco";
        $scope.data = {};
        var data = {};
        $scope.categories = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.year = [];

        
        //API Ivan Grupo 03 con Cors
       
         $scope.riskpoverty = [];
         $scope.inveducation = [];
         $scope.population = [];
        

   $http
            .get("https://sos1617-03.herokuapp.com/api/v2/investmentseducation/?apikey=apisupersecreta")
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;
                for (var i = 0; i < res.data.length; i++) {
                    $scope.year.push(Number($scope.data[i]["year"]));
                    $scope.categories.push($scope.data[i].year);
                    $scope.population.push(Number($scope.data[i]["population"]));
                    $scope.riskpoverty.push(Number($scope.data[i]["riskpoverty"]));
                    $scope.inveducation.push(Number($scope.data[i]["inveducation"]));
                 
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
            
                //HighCharts
                Highcharts.chart('container', {
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'gdp,debt and year of provinces in Spain,population,riskpoverty and inveducation'
                    },
                    xAxis: {
                        categories: $scope.categories,
                        title: {
                            text: 'year',
                            align: 'high'
                        },
                    },

                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Euros ',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    plotOptions: {
                        area: {
                            
                            dataLabels: {
                                enabled: false
                            },

                        }
                    },
                    tooltip: {
                        valueSuffix: 'millions'
                    },
                    legend: {
                        
                       //layout: 'vertical',
                        align: 'high',
                        horizontalAlign: 'top',
                        x: 0,
                        y: 25,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: false
                    },
                    series: [{
                        name: 'gdp ',
                        data: $scope.gdp
                    }, {
                        name: 'debt',
                        data: $scope.debt

                    },{
                        name:'population',
                        data: $scope.population
                    },{
                        name: 'riskpoverty',
                        data:  $scope.riskpoverty
                    },
                    {
                        name:'inveducation',
                        data:  $scope.inveducation 
                    }]
                });
               
            

            });
            });
   
    }]);
