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
$scope.addEconomicSituation = function (){
     $http
     .post("/api/v1/economic-situation-stats?apikey=cinco",$scope.newEconomicSituation) 
     .then(function (response){
         console.log("EconomicSituation added");
         refresh();
        });
};
$scope.deleteEconomicSituation = function (province){
    console.log("Deleting economicSituation " + province + "...");
    refresh();
};
refresh();
}]);
                






