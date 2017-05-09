//En este caso no ponemos [] ya que machacaría la aplicación de nuevo
angular
//Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
    .module("ManagerApp")
    //app.controller(Nombre controlador,dependencias)..scope-->accede al modelo..http->hace peticiones a la API
    .controller("EconomicListCtrl", ["$scope", "$http", function($scope, $http) {
        console.log("List controller initialized ");

        //Apikey
        var password = "cinco";

        function confirmApikey() {
            if (!$scope.apikey) {
                Materialize.toast("<h1>Enter an apikey<h1>",4000);
            }
            else if ($scope.apikey !== password) {
                Materialize.toast("<h1>Wrong apikey!, enter a correct apikey<h1>",4000);
            }
            else if ($scope.apikey == password) {
                Materialize.toast("<h1>Correct apikey!<h1>",4000);
            }
        }

        function refresh() {
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }
            if ($scope.limit != undefined & $scope.limit != "") {
                $scope.itemsPerPage = $scope.limit;
            }
            //Siempre actualizamos los modelos dentro del callback
            $http
                .get("/api/v1/economic-situation-stats?apikey=" + password + limit + offset) //ya que está en el mismo servidor
                .then(function(response) {
                    console.log("GET collection (refresh)");
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.economicSituationStats = response.data;
                    console.log($scope.economicSituationStats);
                    if ($scope.limit == undefined | $scope.limit == "") {
                        $scope.itemsPerPage = $scope.economicSituationStats.length;
                    }
                });
        }
   

        //Muestra lista de recursos
        $http
            .get("/api/v1/economic-situation-stats?apikey=" + password) //ya que está en el mismo servidor
            .then(function(response) {
                console.log("GET");
                $scope.data = JSON.stringify(response.data, null, 2);
                $scope.economicSituationStats = response.data;
                refresh();
            });




        //LOAD INITIAL DATA
        $scope.lid = function() {
            confirmApikey();
            console.log("Loading Initial Data");
            $http
                .get("/api/v1/economic-situation-stats/loadInitialData?apikey=" + $scope.apikey)
                .then(function(response) {
                    console.log("Loading Initial Data");
                    refresh();
                });

        };

 


//Añadir nuevo recurso
$scope.addEconomicSituation = function (){
  //PARA QUE FUNCIONE PROTRACTOR  
     confirmApikey();
     $http//$scope.apikey por password para protractor
     .post("/api/v1/economic-situation-stats?apikey=" + $scope.apikey,$scope.newEconomicSituation) 
     .then(function (response){
         if(response.status === 200 || response.status === 201){
            //Para poder pasar el test de protractor:comento:
            Materialize.toast("<h2>Correct operation<h2>",5000);
         }
         console.log("EconomicSituation added");
         refresh();
        }, function(response){
            if(response.status===409){
                Materialize.toast("<h2>wrong action<h2>",5000);
            }
        });
};
//Actualizo recurso
 $scope.updateEconomicSituation = function() {
     confirmApikey();
            $http.put("/api/v1/economic-situation-stats/" + $scope.newEconomicSituation.province + "?apikey=" + $scope.apikey , $scope.newEconomicSituation)
            .then(function(response) {
                console.log("EconomicSituation updated");
                refresh();
            }, function(response) {
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast("Successful execution");
                }
                else if (response.status == 422) {
                    Materialize.toast("ATTENTION: the economic situation  is not well formed");
                }
            });
        };
        

        //borra todos los recursos
        $scope.deleteAll = function() {
            confirmApikey();
            console.log("Deleting all collection...");
            $http.delete("/api/v1/economic-situation-stats?apikey=" + $scope.apikey).then(function(response) {
                refresh();
                },function(response) {
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast("<h2>Successful execution<h2>",5000);
                }
                else if (response.status == 404) {
                    Materialize.toast("<h2>There are not economicSituation<h2>",5000);
                }
            });
        };

//borra un recurso concreto
$scope.deleteEconomicSituation = function (economicSituation){
    confirmApikey();
    console.log("Deleting economicSituation ");
    $http.
    delete("/api/v1/economic-situation-stats/" + economicSituation.province + "?apikey=" + $scope.apikey).then(function(response){
    refresh();
    }, function(response) {
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast("<h2>Successful execution<h2>",5000);
                }
                else if (response.status == 404) {
                    Materialize.toast("<h2>There are not economicSituation<h2>",5000);
                }
});
};

        //Búsqueda

        $scope.search = function() {
            confirmApikey();
            var results = "";

            if ($scope.newEconomicSituation.province !== undefined && $scope.newEconomicSituation.province !== "") {
                results = results + "&province=" + $scope.newEconomicSituation.province;
            }

            if ($scope.newEconomicSituation.year !== undefined && $scope.newEconomicSituation.year !== "") {
                results = results + "&year=" + $scope.newEconomicSituation.year;
            }

            if ($scope.newEconomicSituation.gdp != undefined && $scope.newEconomicSituation.gdp !== "") {
                results = results + "&gdp=" + $scope.newEconomicSituation.gdp;
            }
            if ($scope.newEconomicSituation.debt != undefined && $scope.newEconomicSituation.debt !== "") {
                results = results + "&debt=" + $scope.newEconomicSituation.debt;

            }
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }
            
             console.log(results);
           $http
         .get("/api/v1/economic-situation-stats?apikey=" + $scope.apikey + results + limit + offset) //ya que está en el mismo servidor
         .then(function (response){
         console.log("GET");
         $scope.data = JSON.stringify(response.data,null,2);
         $scope.economicSituationStats = response.data;
         var numberOfPages = Math.ceil($scope.results.length / $scope.limit);
                }, function(response) {
                    if (response.status === 200 || response.status === 201) {
                        Materialize.toast("<h2>Successful execution<h2>",5000);
                    }
         
        
             
                });

        };

        $scope.enter = function() {
            confirmApikey();
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }
            $http
                .get("/api/v1/economic-situation-stats?apikey=" + $scope.apikey + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.economicSituationStats = response.data;
                    refresh();

                });
        };
        //Paginación
        /*(COMENTADO PARA PROTRACTOR)
        $scope.viewby = 10;
        $scope.totalItems = function() {
            return $scope.data.length;
        };
        $scope.currentPage = 1;
        $scope.itemsPerPage = function() {
            return $scope.limit;
        };
        $scope.maxSize = 5; //Number of pager buttons to show


        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
        };
*/
//NUEVO PARA QUE FUNCIONE BIEN:
 $scope.viewby = 10;
        $scope.totalItems = function() {
            return $scope.data.length;
        };
        $scope.currentPage = 1;
        $scope.maxSize = 5; 

        $scope.setPage = function(pageNo) {

            var pages = (Math.floor($scope.economicSituationStats.length / $scope.limit)) + 1;
            if (pageNo <= pages) {
                console.log("Páginas: ",$scope.economicSituationStats.length , $scope.limit,pages);
                $scope.currentPage = pageNo;
            }
        };
        $scope.prevPage = function() {
            if ($scope.currentPage > 1) {
                $scope.currentPage = $scope.currentPage - 1;
            }
        };
        $scope.rangeCreator = function(ar, ab) { //Puesto que quita la parte decimal, se le debe sumar 1 a page
            if(ab==undefined){
                ab=$scope.economicSituationStats.length;
            }
            setItemsPerPage(ab);
            var pages = (Math.floor(ar / ab)) + 1;
            console.log(ar, ab);
            var res = [];
            var i;
            for (i = 1; i <= pages; i++) {
                res.push(i);
            }
            return res;
        };
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        function setItemsPerPage(num) {
            $scope.itemsPerPage = num;
        }




    }]);
