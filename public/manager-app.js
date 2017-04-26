//[]--->carga modulos en este caso cargaremos angular-root-->ngRoute
angular.module("ManagerApp", ["ngRoute"]).config(function($routeProvider) {

    //Cuando un usuario acceda al recurso "/"" carge la vista list.html
    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })
        .when("/api/v1/frontendNacho", {
            templateUrl: "frontends/nacho/list.html",
            controller: "ResultsListCtrl" //le asocio el objeto registrado en angular-->ListCtrl
        }).when("/elections-voting-results/:province", {
            templateUrl: "frontends/nacho/edit.html",
            controller: "ResultsEditCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)

        }).when("/economic-stats", {
            templateUrl: "frontends/alberto/list.html",
            controller: "ListCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)
        }).when("/economic-stats/:province", {
            templateUrl: "frontends/albertoedit.html",
            controller: "EditCtrl"
        });
    //Para crear el modulo.Lista de dependencias que quieres cargar,nombre de ng-app 
    console.log("App initialized and configured");
});
