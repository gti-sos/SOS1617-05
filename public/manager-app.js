//[]--->carga modulos en este caso cargaremos angular-root-->ngRoute
angular.module("ManagerApp", ["ngRoute"]).config(function($routeProvider) {

    //Cuando un usuario acceda al recurso "/"" carge la vista list.html
    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })//NACHO
        .when("/elections-voting-stats", {
            templateUrl: "frontends/nacho/list.html",
            controller: "ResultsListCtrl" //le asocio el objeto registrado en angular-->ListCtrl
        }).when("/elections-voting-stats/:province", {
            templateUrl: "frontends/nacho/edit.html",
            controller: "ResultsEditCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)
           //ALBERTO
        }).when("/economic-situation-stats", {
            templateUrl: "frontends/alberto/list.html",
            controller: "EconomicListCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)
        }).when("/economic-situation-stats/:province", {
            templateUrl: "frontends/alberto/edit.html",
            controller: "EconomicEditCtrl"
        }).when("/economic-situation-stats/analytics",{
            templateUrl: "frontends/alberto/widgets.html",
            controller: "EconomicWidgetsCtrl"
        });
    //Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
    console.log("App initialized and configured");
});
