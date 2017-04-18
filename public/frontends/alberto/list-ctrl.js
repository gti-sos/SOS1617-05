//En este caso no ponemos [] ya que machacaría la aplicación de nuevo
angular
//Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
 .module("EconomicManagerApp")
 //app.controller(Nombre controlador,dependencias)..scope-->accede al modelo..http->hace peticiones a la API
 .controller("ListCtrl",["$scope","$http",function($scope,$http){
console.log("Controller initialized(splited right)");
function refresh(){
//Siempre actualizamos los modelos dentro del callback
 $http
     .get("/api/v1/economic-situation-stats?apikey=cinco") //ya que está en el mismo servidor
     .then(function (response){
         $scope.economicSituationStats = response.data;

        });
}
//LOAD INITIAL DATA
   $scope.lid = function() {
            console.log("Loading Initial Data");
            $http
                .get("/api/v1/economic-situation-stats/loadInitialData?apikey=cinco" ) 
                .then(function(response) { 
                    console.log("Loading Initial Data");
                    refresh();
                });

        };





//Añadir nuevo recurso
$scope.addEconomicSituation = function (){
     $http
     .post("/api/v1/economic-situation-stats?apikey=cinco",$scope.newEconomicSituation) 
     .then(function (response){
         console.log("EconomicSituation added");
         refresh();
        });
};
//Actualizo recurso
 $scope.updateEconomicSituation = function() {
            $http.put("/api/v1/economic-situation-stats?apikey=cinco/" + $scope.newEconomicSituation.province + "?apikey=cinco" , $scope.newEconomicSituation).then(function(response) {
                console.log("EconomicSituation updated");
                refresh();
            });
        };


//borra todos los recursos
  $scope.deleteAll = function() {
            console.log("Deleting all collection...");
            $http.delete("/api/v1/economic-situation-stats?apikey=cinco").then(function(response) {
                refresh();
            });
        };

//borra un recurso concreto
$scope.deleteEconomicSituation = function (province){
    console.log("Deleting economicSituation " + province + "...");
    refresh();
};
refresh();
}]);


/*$scope.deleteEconomicSituation = function (economicSituation){
    console.log("Deleting economicSituation ...");
    $http.
    delete("api/v1/economic-situation-stats" + "/" + economicSituation.province + "?apikey=cinco").then(function(response){
    refresh();*/




