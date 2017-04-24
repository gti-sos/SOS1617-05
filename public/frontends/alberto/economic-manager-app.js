//[]--->carga modulos en este caso cargaremos angular-root-->ngRoute
angular.module("EconomicManagerApp",["ngRoute"]).config(function($routeProvider){
    
    //Cuando un usuario acceda al recurso "/"" carge la vista list.html
    $routeProvider
    .when("/",{
        templateUrl : "list.html",
        controller: "ListCtrl"   //le asocio el objeto registrado en angular-->ListCtrl
    })
    .when("/economicSituation/:province",{
        templateUrl : "edit.html",
        controller:"EditCtrl"
    });
//Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
              console.log("App initialized and configured");
}); 