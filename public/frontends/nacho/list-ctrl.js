//CONSULTAR: https://docs.angularjs.org/api/ng/service/$http

angular
    .module("ResultsManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend -->
        console.log("Controller initialized");

        //Sería interesante concatenar la apikey a la URL en cada método por si hubiera que agregarle algo a la URL, no???
        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";

        //Como implementar búsqueda y paginación aquí? Para busqueda añadir un tercer botón en la primera fila (dónde se escribe) que diga search?
        //En ese caso no sería obligatorio introducir todos los campos...los introducidos se añadirían a la URL como: ?xxx=yyy&zzz=vvv

        //Load Initial Data
        $scope.lid = function() {
            console.log("Loading Initial Data");
            $http
                .get($scope.url + "/loadInitialData?apikey=cinco") //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Initial Data");
                    /*$scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
            <        $scope.results = response.data;*/
                    refresh();
                    //Añadir aquí también llamada a la función refresh porque el get que se hace aquí es a la URL de loadInitialData, la cual no devuelve JSON de los objetos añadidos
                });

        }

        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {
            $http
                .get($scope.url + "?apikey=cinco") //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;

                });

        }

        //POST
        $scope.addResult = function() { //Se define una función send dentro del modelo
            $http.post($scope.url + "?apikey=cinco", $scope.newResult).then(function(response) {
                console.log("POST finished");
                refresh();
            });
        }

        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            $http.put($scope.url + "/" + $scope.newResult.province + "?apikey=cinco", $scope.newResult).then(function(response) {
                console.log("PUT finished");
                refresh();
            });
        }

        //DELETE single resource: Se debe modificar la URL añadiendole la provincia antes de la apikey
        //No es necesario que le pase el parámetro result???
        $scope.deleteResult = function(result) {
            console.log("Trying DELETE over single resource");
            $http.delete($scope.url + "/" + result.province + "?apikey=cinco").then(function(response) {
                refresh();
            });
        }

        //DELETE whole collection:
        $scope.deleteAll = function() {
            console.log("Deleting the whole collection...");
            $http.delete($scope.url + "?apikey=cinco").then(function(response) {
                refresh();
            });
        }

        //BÚSQUEDA
        $scope.search = function() {
            //los parámetros especificados (no tienen por qué ser los 6) se acoplan a la URL y se hace un get. Se deben mostrar los que cumplan eso!!
            var params = "";


            if ($scope.newResult.province !== undefined) {
                params = params + "&province=" + $scope.newResult.province;
            }
            if ($scope.newResult.year !== undefined) {
                params = params + "&year=" + $scope.newResult.year;
            }
            if ($scope.newResult.pp !== undefined) {
                params = params + "&pp=" + $scope.newResult.pp;
            }
            if ($scope.newResult.podemos !== undefined) {
                params = params + "&podemos=" + $scope.newResult.podemos;
            }
            if ($scope.newResult.psoe !== undefined) {
                params = params + "&psoe=" + $scope.newResult.psoe;
            }
            if ($scope.newResult.cs !== undefined) {
                params = params + "&cs=" + $scope.newResult.cs;
            }

            console.log(params);
            $http
                .get($scope.url + "?apikey=cinco" + params) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;

                });

        }


        refresh(); //Esto aquí o fuera? Si ya está en todos los demás...para qué ponerlo aquí???
    }]);