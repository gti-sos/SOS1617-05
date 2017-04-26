//En este caso no ponemos [] ya que machacaría la aplicación de nuevo
angular
//Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
 .module("ManagerApp")
 //app.controller(Nombre controlador,dependencias)..scope-->accede al modelo..http->hace peticiones a la API
 .controller("EconomicEditCtrl", ["$scope", "$http", "$routeParams", "$location",
  function($scope, $http, $routeParams, $location) {
   console.log("Edit Controller initialized ");

   function refresh() {
    //Siempre actualizamos los modelos dentro del callback
    $http
     .get("/api/v1/economic-situation-stats/" + $routeParams.province + "?apikey=cinco") //ya que está en el mismo servidor
     .then(function(response) {
      $scope.data = JSON.stringify(response.data, null, 2);
      $scope.updatedEconomicSituation = response.data[0];
      console.log($scope.updatedEconomicSituation, response.data[0]);
     });
   }



   //Actualizo recurso
   $scope.updateEconomicSituation = function() {
    $http
     .put("/api/v1/economic-situation-stats/" + $routeParams.province + "?apikey=cinco", $scope.updatedEconomicSituation)
     .then(function(response) {
      console.log("EconomicSituation updated");
      $location.path("/economic-situation-stats");

     });
   };
   refresh();
  }
 ]);
