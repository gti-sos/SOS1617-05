var exports = module.exports = {};

exports.register = function(app, port, BASE_API_PATH) {

    var mdbURL3 = "mongodb://antoniops:ANpeso96@ds143990.mlab.com:43990/employment-stats";

    var MongoClient3 = require("mongodb").MongoClient;

    var db3;
    MongoClient3.connect(mdbURL3, {
        native_parser: true
    }, function(err, database) {
        if (err) {
            console.log("CAN NOT CONNECT TO DB: " + err);
            process.exit(1);
        }
        db3 = database.collection("employment-stats");


    });


    // Tarea 1.b feedback F04:
    app.get(BASE_API_PATH + "/employment-stats/loadInitialData", function(request, response) {
        console.log('INFO: Initialiting DB...');
        db3.find({}).toArray(function(err, results) { //Se debe usar .toArray, MongoDB no funciona como nedb
            if (err) {
                console.error('WARNING: Error while getting initial data from DB');
                return 0;
            }

            if (results.length === 0) {
                console.log('INFO: Empty DB, loading initial data');

                var provinces = [{
                    "province": "Albacete",
                    "year": "2016",
                    "trimester": "4",
                    "unemploymentTax": "23,31",
                }, {
                    "province": "Alicante",
                    "year": "2016",
                    "trimester": "4",
                    "unemploymentTax": "18,21",
                }, {
                    "province": "Almeria",
                    "year": "2016",
                    "trimester": "4",
                    "unemploymentTax": "24,84"
                }];
                db3.insert(provinces);
            }
            else {
                console.log('INFO: DB has ' + results.length + ' results ');
                response.sendStatus(200);
                //Se incluyen los elementos en la base de datos pero tras imprimir eso se queda cargando...SOLUCIÓN??? O es normal???
            }
        });
    });

    // GET a collection

    app.get(BASE_API_PATH + "/employment-stats", function(request, response) {
        console.log("INFO: New GET request to /employment-stats");
        db3.find({}).toArray(function(err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500);
            }
            else {
                console.log("INFO: Sending contacts: " + JSON.stringify(results, 2, null));
                response.send(results);
            }
        });
    });




    // GET a single resource

    app.get(BASE_API_PATH + "/employment-stats/:province", function(request, response) {
        console.log("INFO : new GET request to /employment-stats/:province");
        var province = request.params.province;

        if (!province) {
            console.log("WARNING: New GET request to /elections-voting-stats/:province without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /employment-stats/" + province);
            db3.find({
                province: province
            }).toArray(function(err, docs) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500);
                }
                else {
                    if (docs.length === 0) {
                        console.log("WARNING: There are not any information about " + province);
                        response.sendStatus(404);
                    }
                    else {
                        console.log("INFO: Sending results: " + JSON.stringify(docs[0], 2, null));
                        response.send(docs[0]);
                    }
                }
            });
        }
    });


    //POST over a collection
    app.post(BASE_API_PATH + "/employment-stats", function(request, response) {
        var newResult = request.body; //Lo obtiene del cuerpo del mensaje http

        if (!newResult) {
            console.log("WARNING: There was not result found on the POST request. ");
            response.sendStatus(400);
        }
        else {
            if (!newResult.province || !newResult.year || !newResult.cuatrimester || !newResult.unemploymentTax) {
                console.log("WARNING: The results " + JSON.stringify(newResult, 2, null) + " are incorrect");
                response.sendStatus(422);
            }
            else {
                db3.find({}).toArray(function(err, results) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else if (results.indexOf(newResult.province) > -1) { //Resultado para dicha provincia ya existe...NO FUNCIONA BIEN!!!
                        console.log("WARNING: There is already a result with province field: " + newResult.province);
                        response.sendStatus(409);
                    }
                    else {
                        //results.push(newResult); //Teniendo la de abajo esta sobra???
                        db3.insert(results); //Comprobar el comportamiento de esta sentencia...
                        console.log("INFO: result created successfully for " + newResult.province);
                        response.sendStatus(201); //Código que informa de resultado creado
                    }

                });
            }
        }
    });


    //POST over a single resource
    app.post(BASE_API_PATH + "/employment-stats/:province", function(request, response) {
        response.sendStatus(405);
    });


    //PUT over a collection
    app.put(BASE_API_PATH + "/employment-stats", function(request, response) {
        response.sendStatus(405);
    });


    //PUT over a single resource

    app.put(BASE_API_PATH + "/employment-stats/:province", function(request, response) {
        var province = request.params.province;
        var updatedResult = request.body;
        if (!updatedResult) {
            console.log("WARNING: New PUT request to /employment-stats/ without results");
            response.sendStatus(400); // bad request
        }
        else {
            if (!updatedResult.province || !updatedResult.year || !updatedResult.cuatrimester || !updatedResult.unemploymentTax) {
                console.log("WARNING: The results " + JSON.stringify(updatedResult, 2, null) + " are incorrect");
                response.sendStatus(422);
            }
            else {
                db3.find({}).toArray(function(err, results) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        results = results.map((c) => { //Se puede hacer también con un bucle for
                            if (c.province === province) {
                                return updatedResult;
                            }
                            else {
                                return c;
                            }
                        });
                        //AÑADE PERO NO BORRA EL OBJETO ANTERIOR CON DICHO NOMBRE DE PROVINCIA!!!!!!
                        db3.insert(results);
                        console.error('INFO: data updated for result: ' + updatedResult.province);
                        response.sendStatus(200);
                    }

                });
            }

        }
    });


    //DELETE over a collection
    app.delete(BASE_API_PATH + "/employment-stats", function(request, response) {
        console.log("INFO: New DELETE request to /elections-voting-stats");
        db3.remove({}, {
            multi: true
        }, function(err, removed) {
            console.log("ELIMINADOS: " + removed); //numRemoved es un "array" cuyo SEGUNDO ELEMENTO ("n") indica el número de objetos eliminados!!!
            //Por tanto, como se toma el valor de una propiedad en JSON????
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (removed > 0) {
                    console.log("INFO: All the provinces (" + removed + ") have been succesfully deleted");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no provinces to delete");
                    response.sendStatus(404); // not found
                }
            }
        });

    });


    //DELETE over a single resource
    app.delete(BASE_API_PATH + "/employment-stats/:province", function(request, response) {
        var province = request.params.province;
        if (!province) {
            console.log("WARNING: New DELETE request to /employment-stats/province without especified province");
            response.sendStatus(400); // bad request
        }
        else {
            db3.remove({
                province: province
            }, function(err, removed) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (removed === 1) {
                        console.log("INFO: All the provinces (" + removed + ") have been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                    else {
                        console.log("WARNING: There are no provinces to delete");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }

    });

}
