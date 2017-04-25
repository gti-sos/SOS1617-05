/*//CONSULTAR: https://docs.angularjs.org/api/ng/service/$http

angular
    .module("ResultsManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend -->
        console.log("Edit Controller initialized");

        //Sería interesante concatenar la apikey a la URL en cada método por si hubiera que agregarle algo a la URL, no???
        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";

        //Como implementar búsqueda y paginación aquí? Para busqueda añadir un tercer botón en la primera fila (dónde se escribe) que diga search?
        //En ese caso no sería obligatorio introducir todos los campos...los introducidos se añadirían a la URL como: ?xxx=yyy&zzz=vvv



        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {



            $http
                .get($scope.url + "/" + $routeParams.province + "?apikey=" + $scope.apikey) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET single resource to be updated");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.updatedResult = response.data;

                });

        }


        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            $http.put($scope.url + "/" + $routeParams.province + "?apikey=" + $scope.apikey, $scope.updateResult).then(function(response) {
                console.log("Result updated");
                $location.path("/");
            });
        };



    }]); */

angular
    .module("ResultsManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend -->
        console.log("Edit Controller initialized");

        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";
        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {



            $http
                .get($scope.url + "/" + $routeParams.province + "?apikey=cinco" ) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET single resource to be updated");
                    $scope.updatedResult = response.data[0];
                    console.log($scope.updatedResult, response.data);

                });

        }


        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            $http.put($scope.url + "/" + $routeParams.province + "?apikey=cinco" , $scope.updateResult).then(function(response) {
                console.log("Result updated");
                $location.path("/");
            });
        };

    refresh();

    }]);