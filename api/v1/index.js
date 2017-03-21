var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

//Según comentó el profesor, todo lo que esté en la carpeta public se sube al servidor...entonces, por qué no hacer eso pero en vez de llamarle public le llamamos api ???
//no obstante seguiriamos teniendo el problema o la duda de si borrar la app que ya hay subida y el tema de tres archivos index.js en un mismo directorio...

var url = "mongodb://nachodb:nachodb@ds135690.mlab.com:35690/elections-voting-stats";
var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1"; //No hacen falta las carpetas (respuesta de Pablo en Piazza) porque esta ruta "simula" esa estructura de carpetas?
//y por tanto bastaría con tener un único index.js con las API's de los tres en la raiz y subir la app a Heroku igual 
//que hizo Alberto (quizas configurando en Heroku alguna url...)?
var db;
//db = path.join(__dirname, 'voting.db'); //NECESARIO ESTO O ALGO PARECIDO??? (TOMADO DEL EJEMPLO HECHO CON nedb)


MongoClient.connect(url, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }
    db = database.collection("voting"); // debe especificarse el nombre que se le haya dado a la colección en mlab.com
    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });

});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

//CÓMO HAGO PARA QUE SE "INCLUYA" AQUÍ CÓDIGO DE OTRO FICHERO??? (EL QUE CONTIENE LOS COMANDOS CURL)

// Según lo que se pide en la tarea 1.b esto no hace falta, no???? Pues está en el get a /loadInitialData !! 
//MongoDB no tiene método .find quizas???
/*db.find({},function (err, results) {
    console.log('INFO: Initialiting DB...');

    if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }


    if (results.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

        var people = [{
                "province": "Felipe",
                "phone": "954556356",
                "email": "felipe@example.com"
            },
            {
                "province": "Daniel",
                "phone": "954556357",
                "email": "daniel@example.com"
            },
            {
                "province": "Quique",
                "phone": "954556358",
                "email": "quique@example.com"
            },
            {
                "province": "Ibone",
                "phone": "954556359",
                "email": "ibone@example.com"
            }];
        db.insert(people);
    } else {
        console.log('INFO: DB has ' + results.length + ' results ');
    }
});
*/

// Base GET
app.get("/", function(request, response) { //ARREGLAR EL TEMA DE results !!!!! results / elections-voting-stats / voting ... CUAL???
    console.log("INFO: Redirecting to /elections-voting-stats");
    response.redirect(301, BASE_API_PATH + "/elections-voting-stats");
});


// Tarea 1.b feedback F04:
app.get(BASE_API_PATH + "/elections-voting-stats/loadInitialData", function(request, response) {
    console.log('INFO: Initialiting DB...');
    db.find({}).toArray(function(err, results) { //Se debe usar .toArray, MongoDB no funciona como nedb
        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            return 0;
        }

        if (results.length === 0) {
            console.log('INFO: Empty DB, loading initial data');

            var provinces = [{
                "province": "Tarragona",
                "year": "2016",
                "pp": "1",
                "podemos": "1",
                "psoe": "1",
                "cs": "1"
            }, {
                "province": "Asturias",
                "year": "2016",
                "pp": "3",
                "podemos": "2",
                "psoe": "2",
                "cs": "1"
            }, {
                "province": "Sevilla",
                "year": "2016",
                "pp": "5",
                "podemos": "4",
                "psoe": "3",
                "cs": "0"
            }];
            db.insert(provinces);
        }
        else {
            console.log('INFO: DB has ' + results.length + ' results ');
            response.sendStatus(200);
            //Se incluyen los elementos en la base de datos pero tras imprimir eso se queda cargando...SOLUCIÓN??? O es normal???
        }
    });
});


// GET a collection
app.get(BASE_API_PATH + "/elections-voting-stats", function(request, response) {
    console.log("INFO: New GET request to /elections-voting-stats");
    db.find({}).toArray(function(err, results) {
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
app.get(BASE_API_PATH + "/elections-voting-stats/:province", function(request, response) {
    console.log("INFO : new GET request to /elections-voting-stats/:province");
    var province = request.params.province;

    if (!province) {
        console.log("WARNING: New GET request to /elections-voting-stats/:province without province, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /elections-voting-stats/" + province);
        db.find({
            province: province
        }).toArray(function(err, docs) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500);
            }
            else {
                if (docs.length === 0) { //LA VERSIÓN DEL PROF. ES IGUAL PERO METE ESTAS DOS SENTENCIAS else if DENTRO DE UN else
                    console.log("WARNING: There are not any voting results for province " + province);
                    response.sendStatus(404);
                }
                else {
                    console.log("INFO: Sending voting results: " + JSON.stringify(docs[0], 2, null));
                    response.send(docs[0]);
                }
            }
        });
    }
});


//POST over a collection 
app.post(BASE_API_PATH + "/elections-voting-stats", function(request, response) {
    var newResult = request.body; //Lo obtiene del cuerpo del mensaje http

    if (!newResult) {
        console.log("WARNING: There was not result found on the POST request. ");
        response.sendStatus(400);
    }
    else {
        if (!newResult.province || !newResult.year || !newResult.pp || !newResult.podemos || !newResult.psoe || !newResult.cs) {
            console.log("WARNING: The voting results " + JSON.stringify(newResult, 2, null) + " is incorrect");
            response.sendStatus(422);
        }
        else {
            db.find({}).toArray(function(err, results) {
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
                    db.insert(results); //Comprobar el comportamiento de esta sentencia...
                    console.log("INFO: result created successfully for " + newResult.province);
                    response.sendStatus(201); //Código que informa de resultado creado
                }

            });
        }
    }
});


//POST over a single resource: NO PERMITIDO SEGÚN LA TABLA AZUL, método no permitido
app.post(BASE_API_PATH + "/elections-voting-stats/:province", function(request, response) {
    console.log("WARNING: Not allowed method.");
    response.sendStatus(405);
});


//PUT over a collection: NO PERMITIDO SEGÚN LA TABLA AZUL, método no permitido
app.put(BASE_API_PATH + "/elections-voting-stats", function(request, response) {
    console.log("WARNING: Not allowed method.");
    response.sendStatus(405);
});


//PUT over a single resource: updates a single resource (result)
app.put(BASE_API_PATH + "/elections-voting-stats/:province", function(request, response) {
    var province = request.params.province;
    var updatedResult = request.body;
    if (!updatedResult) {
        console.log("WARNING: New PUT request to /elections-voting-stats/ without results");
        response.sendStatus(400); // bad request
    }
    else {
        if (!updatedResult.province || !updatedResult.year || !updatedResult.pp || !updatedResult.podemos || !updatedResult.psoe || !updatedResult.cs) {
            console.log("WARNING: The voting results " + JSON.stringify(updatedResult, 2, null) + " is incorrect");
            response.sendStatus(422);
        }
        else {
            db.find({}).toArray(function(err, results) {
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
                    db.insert(results);
                    console.error('INFO: data updated for result: '+ updatedResult.province);
                    response.sendStatus(200);
                }

            }); //Y YA CON ESTE CÓDIGO (se trabaja sobre results) SE MODIFICA LA BASE DE DATOS? O  FALTA ALGO MÁS????
        }

    }
});


//DELETE over a collection: hay diferentes maneras de hacerlo
app.delete(BASE_API_PATH + "/elections-voting-stats", function(request, response) {
    console.log("INFO: New DELETE request to /elections-voting-stats");
    db.remove({}, {multi: true}, function (err, removed) {
        console.log("ELIMINADOS: "+removed); //numRemoved es un "array" cuyo SEGUNDO ELEMENTO ("n") indica el número de objetos eliminados!!!
                                                //Por tanto, como se toma el valor de una propiedad en JSON????
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (removed > 0) {
                console.log("INFO: All the contacts (" + removed + ") have been succesfully deleted");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/elections-voting-stats/:province", function(request, response) {
    var province = request.params.province;
    if (!province) {
        console.log("WARNING: New DELETE request to /elections-voting-stats/province without especified province");
        response.sendStatus(400); // bad request
    }
    else{
        db.remove({province:province},function(err,removed){
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }else{
                if (removed === 1) {
                    console.log("INFO: All the contacts (" + removed + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
    /*var l1 = results.length;
    results = results.filter((contact) => { //Se queda con los que NO se llamen 'province'
        return contscts.province !== province;
    })
    var l2 = results.length;
    if (l1 === l2) { //Mismo tamanio tanto antes como después de la eliminación: no existe objeto con ese nombre
        response.sendStatus(404)
    }
    else {
        response.sendStatus(204);
    }*/
});