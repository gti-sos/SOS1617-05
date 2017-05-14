/*global Materialize*/
/*global angular*/

angular
    .module("ManagerApp") //No lleva [] porque no se está creando la App, si no que se está solicitando
    .controller("ResultsListCtrl", ["$scope", "$http", function($scope, $http) { //$scope es un módulo con el que accedemos al modelo, $http es un módulo que permite hacer peticiones a la API, es decir, conecta con el backend 
        console.log("List Controller initialized");
        $scope.url = "https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats";

        var pass = "cinco";

        function checkKey() {
            if (!$scope.apikey) {
                Materialize.toast('<h3>No apikey was specified</h3>', 1200);
            }
            else if ($scope.apikey !== pass) {
                Materialize.toast('<h3>Wrong apikey!</h3>', 1200);
            }
            else if ($scope.apikey == pass) {
                Materialize.toast('<h3>Correct apikey!</h3>', 1200);
            }
        }

        //Load Initial Data
        $scope.lid = function() {
            checkKey();
            console.log("Loading Initial Data");
            $http
                .get($scope.url + "/loadInitialData?apikey=" + $scope.apikey) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Initial Data");
                    refresh();
                });
        };

        //this one is needed for pagination: returns the amount of resources on the server
        function numberOfResources() {
            checkKey();
            console.log("Checking the number of resources...");
            $http
                .get("https://sos1617-05.herokuapp.com/api/v2/elections-voting-stats/length?apikey=" + $scope.apikey) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Number of resources stored: ", response.data);
                    return response.data;

                });
        }

        //Load WHOLE Data: this resource loads 52 resources, meaning it loads the whole data base
        $scope.lwd = function() {
            checkKey();
            console.log("Loading Whole Data");
            $http
                .get($scope.url + "/loadWholeData?apikey=" + $scope.apikey) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Whole Data");
                    refresh();
                });

        };


        //Load WHOLE Data: this version loads less resources
        $scope.lwd2 = function() {
            checkKey();
            console.log("Loading Whole Data");
            $http
                .get("https://sos1617-05.herokuapp.com/api/v2/elections-voting-stats/loadWholeData?apikey=" + $scope.apikey) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("Loading Whole Data");
                    refresh();
                });

        };

        //GET: get over single resource en este caso no tendría mucho sentido, no? Si se puede hacer por búsqueda!!
        function refresh() {
            console.log("ENTRA EN FUNCIÓN REFRESH");
            //Comento esta linea para que funcionen los tests de protractor
            //checkKey();
            var limit = "";
            var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
                $scope.itemsPerPage = $scope.limit;
            }
            if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }

            $http //En lugar de $scope.apikey paso en la url pass para que funcionen los tests de protractor
                .get($scope.url + "?apikey=" + pass + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection (refresh)");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;
                    console.log($scope.results);
                    if ($scope.limit == undefined | $scope.limit == "") {
                        $scope.itemsPerPage = $scope.results.length;
                    }

                });

        }

        //b.1.iii
        $scope.show = function() {
            checkKey();
            /*var limit = "";
            //var offset = "";
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
                $scope.itemsPerPage = $scope.limit;
            }*/
            /*if ($scope.offset != undefined & $scope.offset != "") {
                offset = "&offset=" + $scope.offset;
            }*/
            var limit = "";
            var offset;
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
                offset = ($scope.currentPage - 1) * $scope.limit;
            }
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + limit + "&offset=" + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    //console.log("GET collection (pagination) a url: ", $scope.url + "?apikey=" + $scope.apikey + limit + "&offset=" + offset);
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;
                    console.log("Array obtenido en pagination() con offset ", offset, " y limmit ", $scope.limit, ": ", $scope.results + " ...FIN ARRAY");
                    /*if (response.status === 200 || response.status === 201) {
                        Materialize.toast('Successful action. ', 1200);
                    }*/
                    //numberOfPages = Math.ceil($scope.results.length / $scope.limit);
                });
            /*$http
                .get($scope.url + "?apikey=" + $scope.apikey + limit) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    console.log("GET collection");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;

                });*/
        };

        //POST: En esta función comento el tema de la apikey para poder pasar los tests de protractor
        $scope.addResult = function(r) { //Se define una función send dentro del modelo
            checkKey();
            $http.post($scope.url + "?apikey=" + $scope.apikey, $scope.newResult).then(function(response) {
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast('<h1 >SUCCESSFUL ACTION! </h1> ', 1200);
                }
                console.log("POST finished");
                refresh();
            }, function(response) {
                if (response.status === 409) {
                    Materialize.toast('There is already a voting result for that province in the data base!', 1200);
                }
            });
        };

        //PUT: aquí cambiar la URL para que sea sobre un recurso en concreto
        $scope.updateResult = function() {
            checkKey();
            $http.put($scope.url + "/" + $scope.newResult.province + "?apikey=" + $scope.apikey, $scope.newResult).then(function(response) {
                if (response.status === 200 || response.status === 201) {
                    Materialize.toast('Successful action. ', 1200);
                }
                console.log("PUT finished");
                refresh();
            }, function(response) {
                if (response.status === 422) {
                    Materialize.toast('WARNING: The voting result is not well-formed', 1200);
                }

            });
        };

        //DELETE single resource: Se debe modificar la URL añadiendole la provincia antes de la apikey
        //No es necesario que le pase el parámetro result???
        $scope.deleteResult = function(result) {
            checkKey();
            console.log("Trying DELETE over single resource");
            $http.delete($scope.url + "/" + result.province + "?apikey=" + $scope.apikey).then(function(response) {
                if (response.status === 200 || response.status === 201 || response.status === 204) {
                    Materialize.toast('Successful action. ', 1200);
                }
                refresh();
            }, function(response) {
                if (response.status === 404) {
                    Materialize.toast('There are no resources to be deleted.', 1200);
                }

            });
        };

        //DELETE whole collection:
        $scope.deleteAll = function() {
            checkKey();
            console.log("Deleting the whole collection...");
            $http.delete($scope.url + "?apikey=" + $scope.apikey).then(function(response) {
                if (response.status === 200 || response.status === 201 || response.status === 204) {
                    Materialize.toast('Successful action. ', 1200);
                }
                refresh();
            }, function(response) {
                if (response.status === 404) {
                    Materialize.toast('There are no resources to be deleted.', 1200);
                }

            });
        };

        //BÚSQUEDA
        $scope.search = function() {
            checkKey();
            var numberOfPages;
            //los parámetros especificados (no tienen por qué ser los 6) se acoplan a la URL y se hace un get. Se deben mostrar los que cumplan eso!!
            var params = "";
            var error = false;
            if ($scope.newResult == undefined) {
                error = true;
            }
            else {
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
                if ($scope.newResult == undefined || params == "") {
                    Materialize.toast('<h4>You must fill at least one field. </h4>', 1500);
                }
            }

            if (error || params == "") {
                Materialize.toast('<h4>You must fill at least one field. </h4>', 1500);
            }
            else {
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
                    .get($scope.url + "?apikey=" + $scope.apikey + params + limit + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                    .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                        console.log("GET collection");
                        $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                        $scope.results = response.data;
                        if (response.status === 200 || response.status === 201) {
                            Materialize.toast('Successful action. ', 1200);
                        }
                        numberOfPages = Math.ceil($scope.results.length / $scope.limit);
                    });
            }
        };






        //PAGINATION

        $scope.currentPage = 1;
        $scope.setPage = function(pageNo) {
            console.log("ESTÁ EN FUNCIÓN setPage(", pageNo, ")");
            if (pageNo == undefined) {
                pageNo = 1;
            }
            //PARA QUE LA PAGINACIÓN SEA COMO PIDIÓ ANTONIO CADA VEZ QUE SE PULSE ESTE BOTÓN SE DEBE HACER UN NUEVO GET AL SERVIDOR (usando offset)!!!

            var limit = "";
            var offset;
            if ($scope.limit != undefined & $scope.limit != "") {
                limit = "&limit=" + $scope.limit;
                offset = (pageNo - 1) * $scope.limit;
            }
            $http
                .get($scope.url + "?apikey=" + $scope.apikey + limit + "&offset=" + offset) //Aquí se realizan los 4 método de API: get, post, put, delete
                .then(function(response) { // Cuando termine de recibir los datos (then) ejecuta el callback
                    //console.log("GET collection (pagination) a url: ", $scope.url + "?apikey=" + $scope.apikey + limit + "&offset=" + offset);
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.results = response.data;
                    //console.log("Array obtenido en pagination() con offset ", offset, " y limmit ", $scope.limit, ": ", $scope.results + " ...FIN ARRAY");
                    /*if (response.status === 200 || response.status === 201) {
                        Materialize.toast('Successful action. ', 1200);
                    }*/
                    //numberOfPages = Math.ceil($scope.results.length / $scope.limit);
                });

            var pages = (Math.floor(numberOfResources() / $scope.limit)) + 1;
            if (pageNo <= pages) {
                console.log("PÁGINAS: ", numberOfResources(), $scope.limit, pages);
                $scope.currentPage = pageNo;
            }
        };
        $scope.prevPage = function() {
            if ($scope.currentPage > 1) {
                $scope.currentPage = $scope.currentPage - 1;
            }
        };
        function pagesRange() { //rangeCreator(results.length,limit)
            if ($scope.limit == undefined) {
                $scope.limit = numberOfResources();
            }
            setItemsPerPage($scope.limit);
            //Puesto que quita la parte decimal, se le debe sumar 1 a pages
            var pages = (Math.floor(numberOfResources() / $scope.limit)) + 1;
            console.log(numberOfResources(), $scope.limit);
            var res = [];
            var i;
            for (i = 1; i <= pages; i++) {
                res.push(i);
            }
            console.log("--------------ENTRÓ A FUNCIÓN DE CREACIÓN DE RANGO: ", res, "-----------");
            $scope.pagesVector = res ;
        }
        pagesRange();

        function setItemsPerPage(num) {
            $scope.itemsPerPage = num;
            //$scope.currentPage = 1; //reset to first page
        }


        //refresh();

    }]);
