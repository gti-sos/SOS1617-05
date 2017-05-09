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
    .module("ManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("ResultsEditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend -->
        console.log("Edit Controller initialized");
        var pass = "cinco";

        function chekKey() {
            if (!$scope.apikey) {
                Materialize.toast('No apikey was specified',1000);
            }
            else if ($scope.apikey !== pass) {
                Materialize.toast('Wrong apikey!',1000);
            }
            else if ($scope.apikey == pass) {
                Materialize.toast('Correct apikey!');
            }
        }
        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";
        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {
            //chekKey();


            $http
                .get($scope.url + "/" + $routeParams.province + "?apikey=cinco") //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET single resource to be updated");
                    $scope.updatedResult = response.data[0];
                    console.log($scope.updatedResult, response.data);

                });

        }


        /* //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            $http.put($scope.url + "/" + $routeParams.province + "?apikey=cinco", $scope.updateResult).then(function(response) {
                console.log("Result updated");
                $location.path("/");
            });
        }; */

        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            //chekKey();
            console.log("PREVIO: ", $routeParams.province, $scope.updatedResult);

            var obj = new Object();
            obj.province = $scope.updatedResult.province;
            obj.year = $scope.updatedResult.year;
            obj.pp = $scope.updatedResult.pp;
            obj.podemos = $scope.updatedResult.podemos;
            obj.psoe = $scope.updatedResult.psoe;
            obj.cs = $scope.updatedResult.cs;

            $http.put($scope.url + "/" + $routeParams.province + "?apikey=cinco", obj).then(function(response) {
                Materialize.toast(response.status,1000);
                console.log("URL: ", $scope.url + "/" + $routeParams.province + "?apikey=cinco");
                console.log("PUT finished", $routeParams.province, $scope.updatedResult);
                $location.path("/elections-voting-stats");

            }, function(response) {
                if (response.status === 422) {
                    Materialize.toast('WARNING: The voting result is not well-formed',1000);
                }
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast('Successful action. ',1000);
                }
            });
        };



        refresh();

    }]);