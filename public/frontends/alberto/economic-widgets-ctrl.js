/*global google*/
/*global angular*/
/*global Highcharts*/
angular
            .module("ManagerApp")
            .controller("EconomicWidgetsCtrl", ["$http","$scope", function($http,$scope) {
                $scope.apikey = "cinco";
                $scope.data = {};
                var data = {};
                $scope.categorias = [];
                $scope.gdp = [];
                $scope.debt = [];
                $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        console.log(res.data);
                        data = res.data;
                        $scope.data=data;
                        
                        for(var i=0;i<res.data.length;i++){
                            $scope.categorias.push($scope.data[i].province);
                            $scope.gdp.push(Number($scope.data[i]["gdp"]));
                            $scope.debt.push(Number($scope.data[i]["debt"]));
                            
                            console.log($scope.data[i].province + " " + $scope.data[i].year);
                        }
                    });
                                    console.log("Controller intialized");

                  
                        $http
                    .get("/api/v1/economic-situation-stats?" + "apikey=" + $scope.apikey)
                    .then(function(res) {
                        //Geocharts 
                        google.charts.load('current', {
                            'packages': ['geochart']
                        });
                        google.charts.setOnLoadCallback(drawMarkersMap);

                        function drawMarkersMap() {

                            var myData = [['Province','gdp','debt']];
                            res.data.forEach(function (d){
                                myData.push([d.province,Number(d["gdp"]),Number(d["debt"])]);
                            });

                            var data = google
                                            .visualization
                                            .arrayToDataTable(myData);

                             var options = {
                                region: 'ES',
                                displayMode: 'markers',
                                colorAxis: {colors: ['green', 'blue']}
                          };

                            var chart = new google.visualization.GeoChart(
                                        document.getElementById('chart_div'));

                            chart.draw(data, options);
                        }

                   
                    //HighCharts
     Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Economic Situatuion Stats in Spain'
    },


    yAxis: {
        title: {
            text: 'EUROS'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            pointStart: 2006
        }
    },

    series: [{
        name: 'gdp ',
        data: $scope.gdp 
    }, {
        name: 'debt',
        data: $scope.debt
    
    }]
     });
     //dygraphs
     /*
      g = new Dygraph(
    document.getElementById("graph"),
    // For possible data formats, see http://dygraphs.com/data.html
    // The x-values could also be dates, e.g. "2012/03/15"
    "X,Y,Z\n" +
    "1,0,3\n" +
    "2,2,6\n" +
    "3,4,8\n" +
    "4,6,9\n" +
    "5,8,9\n" +
    "6,10,8\n" +
    "7,12,6\n" +
    "8,14,3\n",
    {
      // options go here. See http://dygraphs.com/options.html
      legend: 'always',
      animatedZooms: true,
      title: 'Economic Situation Template'
    });
     /*
     $(document).ready(function () {
      var lastClickedGraph;
      document.addEventListener("mousewheel", function() { lastClickedGraph = null; });
      document.addEventListener("click", function() { lastClickedGraph = null; });
  
      var g3 = new Dygraph(document.getElementById("div_g3"),
           NoisyData, { errorBars : true, interactionModel : {
            'mousedown' : downV3,
            'mousemove' : moveV3,
            'mouseup' : upV3,
            'click' : clickV3,
            'dblclick' : dblClickV3,
            'mousewheel' : scrollV3
      }});
      document.getElementById("restore3").onclick = function() {
        restorePositioning(g3);
      };
     
     
    */ 
     
     

});
            }]);
