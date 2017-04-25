angular.module("ResultsManagerApp", ["ngRoute"]).config(function($routeProvider) {

    $routeProvider.when("/", {
        templateUrl: "list.html",
        controller: "ListCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)
    }).when("/results/:province", {
        templateUrl: "edit.html",
        controller: "EditCtrl" //Se asocia a un objeto que se supone que ya está registrado en Angular (el controlador)

    })

    console.log("App initialized");
});
