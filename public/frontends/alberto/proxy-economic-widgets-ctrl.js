
/*global angular*/
/*global Highcharts*/
angular
    .module("ManagerApp")
    .controller("ProxyEconomicWidgetsCtrl", ["$http", "$scope", function($http, $scope) {
        $scope.apikey = "cinco";
        $scope.data = {};
        var data = {};
        $scope.categories = [];
        $scope.gdp = [];
        $scope.debt = [];
        $scope.year = [];

        
        //API Alberto Grupo 01 con proxy
       
        $scope.male_unemployment_ratio = [];
        $scope.female_unemployment_ratio = [];

   $http
            .get("/economic-situation-stats/proxy")
            .then(function(res) {
                console.log(res.data);
                data = res.data;
                $scope.data = data;
                for (var i = 0; i < res.data.length; i++) {
                    $scope.year.push(Number($scope.data[i]["year"]));
                    $scope.categories.push($scope.data[i].year);
                $scope.male_unemployment_ratio.push(Number($scope.data[i]["male_unemployment_ratio"]));
                $scope.female_unemployment_ratio.push(Number($scope.data[i]["female_unemployment_ratio"]));

                  }
                console.log($scope.data[i]);
            
      

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
                }
                    console.log($scope.data[i]);
            
                //HighCharts
                Highcharts.chart('containerProxy', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'gdp,debt and year of provinces in Spain and male_unemployment_ratio,female_unemployment_ratio'
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
                            text: 'Euros and Ratio',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    plotOptions: {
                        column: {
                            
                            dataLabels: {
                                enabled: true
                            },

                        }
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
                        name: 'male_unemployment_ratio',
                        data: $scope.male_unemployment_ratio
                    },
                    {
                        name:'female_unemployment_ratio',
                        data: $scope.female_unemployment_ratio
                    }]
                });
               
            

            });
            });
   
    }]);
