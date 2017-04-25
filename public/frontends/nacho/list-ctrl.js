//CONSULTAR: https://docs.angularjs.org/api/ng/service/$http

angular
    .module("ResultsManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend -->
        console.log(" List Controller initialized");
        //Sería interesante concatenar la apikey a la URL en cada método por si hubiera que agregarle algo a la URL, no???
        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";

        var pass = "cinco";

        function chekKey() {
            if (!$scope.apikey) {
                alert("No apikey was specified");
            }
            else if ($scope.apikey !== pass) {
                alert("Wrong apikey!");
            }
            else if ($scope.apikey == pass) {
                alert("Correct apikey!");
            }
        }
        //Como implementar búsqueda y paginación aquí? Para busqueda añadir un tercer botón en la primera fila (dónde se escribe) que diga search?
        //En ese caso no sería obligatorio introducir todos los campos...los introducidos se añadirían a la URL como: ?xxx=yyy&zzz=vvv

        //Load Initial Data
        $scope.lid = function() {
            chekKey();
            console.log("Loading Initial Data");
            $http
                .get($scope.url + "/loadInitialData?apikey=" + pass) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Initial Data");
                    /*$scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
            <        $scope.results = response.data;*/
                    refresh();
                    //Añadir aquí también llamada a la función refresh porque el get que se hace aquí es a la URL de loadInitialData, la cual no devuelve JSON de los objetos añadidos
                });

        };

        //Load WHOLE Data
        $scope.lwd = function() {
            chekKey();
            console.log("Loading Whole Data");
            $http
                .get($scope.url + "/loadWholeData?apikey=" + pass) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Whole Data");
                    /*$scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
            <        $scope.results = response.data;*/
                    refresh();
                    //Añadir aquí también llamada a la función refresh porque el get que se hace aquí es a la URL de loadInitialData, la cual no devuelve JSON de los objetos añadidos
                });

        };

        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {
            chekKey();
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }

            $http
                .get($scope.url + "?apikey=" + pass + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;

                });

        }

        //b.1.iii
        $scope.show = function() {
            chekKey();
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }

            $http
                .get($scope.url + "?apikey=" + pass + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;

                });
        };

        //POST
        $scope.addResult = function() { //Se define una función send dentro del modelo
            $http.post($scope.url + "?apikey=" + pass, $scope.newResult).then(function(response) {
                if (response.status === 409) {
                    alert("There is already a voting result for that province in the data base!");
                }
                else {
                    console.log("POST finished");
                }
                refresh();
            });
        };

        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            //chekKey();
            $http.put($scope.url + "/" + $scope.newResult.province + "?apikey=" + pass, $scope.newResult).then(function(response) {
                console.log("PUT finished");
                refresh();
            });
        };

        //DELETE single resource: Se debe modificar la URL añadiendole la provincia antes de la apikey
        //No es necesario que le pase el parámetro result???
        $scope.deleteResult = function(result) {
            chekKey();
            console.log("Trying DELETE over single resource");
            $http.delete($scope.url + "/" + result.province + "?apikey=" + pass).then(function(response) {
                refresh();
            });
        };

        //DELETE whole collection:
        $scope.deleteAll = function() {
            chekKey();
            console.log("Deleting the whole collection...");
            $http.delete($scope.url + "?apikey=" + pass).then(function(response) {
                refresh();
            });
        };

        //BÚSQUEDA
        $scope.search = function() {
            chekKey();
            var numberOfPages;
            //los parámetros especificados (no tienen por qué ser los 6) se acoplan a la URL y se hace un get. Se deben mostrar los que cumplan eso!!
            var params = "";

            //Diferencias entre usar == y === ?
            if ($scope.newResult.province !== undefined && $scope.newResult.province !== "") {
                params = params + "&province=" + $scope.newResult.province;
            }
            if ($scope.newResult.year !== undefined && $scope.newResult.year !== "") {
                params = params + "&year=" + $scope.newResult.year;
            }
            if ($scope.newResult.pp !== undefined && $scope.newResult.pp !== "") {
                params = params + "&pp=" + $scope.newResult.pp;
            }
            if ($scope.newResult.podemos !== undefined && $scope.newResult.podemos !== "") {
                params = params + "&podemos=" + $scope.newResult.podemos;
            }
            if ($scope.newResult.psoe !== undefined && $scope.newResult.psoe !== "") {
                params = params + "&psoe=" + $scope.newResult.psoe;
            }
            if ($scope.newResult.cs !== undefined && $scope.newResult.cs !== "") {
                params = params + "&cs=" + $scope.newResult.cs;
            }

            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }

            console.log(params);
            $http
                .get($scope.url + "?apikey=" + pass + params + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;
                    
                    numberOfPages = Math.ceil($scope.results.length / $scope.limit);
                });

        };

        //PAGINATION

        $scope.viewby = 10;
        $scope.totalItems = function() {
            return $scope.data.length;
        };
        $scope.currentPage = 4;
        $scope.itemsPerPage = function() {
            return $scope.limit;
        };
        $scope.maxSize = 5; //Number of pager buttons to show


        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function(num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first paghe
        };


        /*angular.module('plunker', ['ui.bootstrap']);
        var PaginationDemoCtrl = function($scope) {
            $scope.viewby = 10;
            $scope.totalItems = function() {
                return $scope.data.length;
            };
            $scope.currentPage = 4;
            $scope.itemsPerPage = function() {
                return $scope.limit;
            };
            $scope.maxSize = 5; //Number of pager buttons to show

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
                console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function(num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first paghe
            }
        }; */

        //b.1.iii -> Según lo que se dice en esta tarea, esta llamada por defecto no haría falta
        //refresh(); //Esto aquí o fuera? Si ya está en todos los demás...para qué ponerlo aquí??? Para el get inicial en el que no se llama a ninguna otra función???
    }]);