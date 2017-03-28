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
                    console.error('INFO: data updated for result: ' + updatedResult.province);
                    response.sendStatus(200);
                }

            }); //Y YA CON ESTE CÓDIGO (se trabaja sobre results) SE MODIFICA LA BASE DE DATOS? O  FALTA ALGO MÁS????
        }

    }
});


//DELETE over a collection: hay diferentes maneras de hacerlo
app.delete(BASE_API_PATH + "/elections-voting-stats", function(request, response) {
    console.log("INFO: New DELETE request to /elections-voting-stats");
    db.remove({}, {
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
                console.log("INFO: All the contacts (" + removed + ") have been succesfully deleted");
                response.sendStatus(204); // no content
            }
            else {
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
    else {
        db.remove({
            province: province
        }, function(err, removed) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (removed === 1) {
                    console.log("INFO: All the contacts (" + removed + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
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


/*---------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/




//API Alberto

var mdbURL = "mongodb://albgarvar2:sos161705@ds137230.mlab.com:37230/economic-situation-stats";

var MongoClient2 = require("mongodb").MongoClient;

var db2;
MongoClient2.connect(mdbURL, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }
    db2 = database.collection("economicSituationStats");


});



// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /economic-situation-stats");
    response.redirect(301, BASE_API_PATH + "/economic-situation-stats");
});


//El recurso debe contener una ruta /api/v1/XXXXX/loadInitialData que al hacer un GET cree 2 o más datos en la base de datos si está vacía.

app.get(BASE_API_PATH + "/economic-situation-stats/loadInitialData",function(request, response) {
     db2.find({}).toArray(function(err,economicSituationStats){
       if(err){
           console.log('WARNING: Error getting initial data from DB');
       return 0;
       }
       if(economicSituationStats.length===0){
          console.log("Adding...");
          var datos = [
    {
        "province": "Granada",
        "year": "2010",
        "gdp": "563.325",
        "debt":"646.25"
    },
    {
         "province": "Madrid",
        "year": "2015",
        "gdp": "564.325",
        "debt":"123.56"
    },
    {
        "province": "Cadiz",
        "year": "2007",
        "gdp": "598.365",
        "debt":"895.36"
    },
    {
        "province": "Zaragoza",
        "year": "2008",
        "gdp": "563.325",
        "debt":"236.56"
    }
];
        db2.insert(datos);
         response.sendStatus(201); // created
       }else{
        console.log("DataBase IS NOT EMPTY. DB has " + economicSituationStats.length + "results");
         response.sendStatus(200);
       }
       
     });
});
    





// GET a collection
app.get(BASE_API_PATH + "/economic-situation-stats", function (request, response) {
    console.log("INFO: New GET request to /economic-situation-stats");
   
   db2.find({}).toArray(function(err,economicSituationStats){
       if(err){
       console.error('WARNING: Error getting data from DB');
       response.sendStatus(500);
       }else{
     console.log("INFO: Sending contacts: " + JSON.stringify(economicSituationStats, 2, null));
           response.send(economicSituationStats);
       }
   });
});


// GET a single resource
app.get(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
    var province = request.params.province;
         if (!province) {
        console.log("WARNING: New GET request to /economic-situation-stats/:province without province, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /economic-situation-stats/" + province);
         db2.find({province:province}).toArray(function(err, filteredEconomicSituation) {
        if(err){
            console.error('WARNING: Error getting data form DB');
            response.sendStatus(500);//internal server error
        }
        else{
       if (filteredEconomicSituation.length > 0) {
           var economicSituation = filteredEconomicSituation[0];
            console.log("INFO: Sending economicSituation: " + JSON.stringify(economicSituation, 2, null));
            response.send(economicSituation);
        } else {
            console.log("WARNING: There are not any economicSituation with province " + province);
            response.sendStatus(404); // not found
         }
         
        }
        
    });
    
    }
   
});


//POST over a collection
app.post(BASE_API_PATH + "/economic-situation-stats", function (request, response) {
    var newEconomicSituation = request.body;
    if (!newEconomicSituation) {
        console.log("WARNING: New POST request to /economic-situation-stats without economicSituation, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /economic-situation-stats with body: " + JSON.stringify(newEconomicSituation, 2, null));
        if (!newEconomicSituation.province || !newEconomicSituation.year || !newEconomicSituation.gdp || !newEconomicSituation.debt) {
            console.log("WARNING: The EconomicSituation " + JSON.stringify(newEconomicSituation, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db2.find({}).toArray(function(err, economicSituationStats) {
                if(err){
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500);// internal server error
                }else{
            
            var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                return (economicSituation.province.localeCompare(newEconomicSituation.province, "en", {'sensitivity': 'base'}) === 0);
            });
            if (economicSituationBeforeInsertion.length > 0) {
                console.log("WARNING: The economicSituation " + JSON.stringify(newEconomicSituation, 2, null) + " already extis, sending 409...");
                response.sendStatus(409); // conflict
            } else {
                console.log("INFO: Adding economicSituation " + JSON.stringify(newEconomicSituation, 2, null));
                db2.insert(newEconomicSituation);

                response.sendStatus(201); // created
            }
       }
    });
    
    }
    
}

});


//POST over a single resource
app.post(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
    var province = request.params.province;
    console.log("WARNING: New POST request to /economic-situation-stats/" + province + ",sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/economic-situation-stats", function (request, response) {
    console.log("WARNING: New PUT request to /economic-situation-stats, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
    var updatedEconomicSituation = request.body;
    var province = request.params.province;
     if (!updatedEconomicSituation) {
        console.log("WARNING: New PUT request to /economic-situation-stats/ without province, sending 400...");
        response.sendStatus(400); // bad request
     }else{
 console.log("INFO: New PUT request to /economic-situation-stats/" + province + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));     
    if (!updatedEconomicSituation.province || !updatedEconomicSituation.year || !updatedEconomicSituation.gdp ||!updatedEconomicSituation.debt) {
            console.log("WARNING: The economicSituation " + JSON.stringify(updatedEconomicSituation, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db2.find({}).toArray(function (err, economicSituationStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                        return (economicSituation.province.localeCompare(province, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (economicSituationBeforeInsertion.length > 0) {
                        db.update({province: province}, updatedEconomicSituation);
                        console.log("INFO: Modifying economicSituation with province " + province + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));
                        response.send(updatedEconomicSituation); // return the updated economic situation
                    } else {
                        console.log("WARNING: There are not any economicSituation with province " + province);
                        response.sendStatus(404); // not found
}
}
            });
            
        }
        
     }
     
     });

//DELETE over a collection
app.delete(BASE_API_PATH + "/economic-situation-stats", function (request, response) {
console.log("INFO: New DELETE request to /economic-situation-stats");
 db2.remove({},{multi:true},function(err, numRemoved) {
        if(err){
         console.error('WARNING: Error removing data from DB');
         response.sendStatus(500); // internal server error
        }else{
            if(numRemoved>0){
                    console.log("INFO: All the economicSituation ("+ numRemoved + ") have been succesfully deleted, sending 204...");
            response.sendStatus(204);
            }else{
                console.log("WARNING: There are not economicSituation to delete");
                response.sendStatus(404); // not found
            
        }
        }
    });

});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
    var province = request.params.province;
     if (!province) {
        console.log("WARNING: New DELETE request to economic-situation-stats/:province without province, sending 400...");
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New DELETE request to /economic-situation-stats/" + province);
        db2.remove({province:province},{},function(err,numRemoved){
        if(err){
       console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
        console.log("INFO: EconomicSituation removed: " + numRemoved);
        if(numRemoved ===1){
            console.log("INFO: The economicSituation with province " + province + " has been succesfully deleted, sending 204...");
        response.sendStatus(204);//(OK) No Content
        }else{
            console.log("WARNING: There are not economicSituationStats to delete");
            response.sendStatus(404);
        }
    }
        
    });
    }
    
});
/*---------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/
//API DE ANTONIO
var mdbURL = "mongodb://antoniops:ANpeso96@ds143990.mlab.com:43990/employment-stats";

var MongoClient2 = require("mongodb").MongoClient;

var db2;
MongoClient2.connect(mdbURL, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }
    db2 = database.collection("economicSituationStats");


});

// Base GET
app.get("/", function (request, response) {
    
    console.log("INFO: Redirecting to /employment-stats");
    response.redirect(301, BASE_API_PATH + "/employment-stats");
    
});

// Tarea 1.b feedback F04:
app.get(BASE_API_PATH + "/employment-stats/loadInitialData", function(request, response) {
    console.log('INFO: Initialiting DB...');
    db.find({}).toArray(function(err, results) { //Se debe usar .toArray, MongoDB no funciona como nedb
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

    app.get(BASE_API_PATH + "/employment-stats", function(request, response) {
    console.log("INFO: New GET request to /employment-stats");
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
    
    app.get(BASE_API_PATH + "/employment-stats/:province", function(request, response) {
    console.log("INFO : new GET request to /employment-stats/:province");
    var province = request.params.province;

    if (!province) {
        console.log("WARNING: New GET request to /elections-voting-stats/:province without province, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /employment-stats/" + province);
        db.find({
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
    /*if(!name){
        console.log("WARNING: New request to /contacts/:name without name");
        response.sendStatus(404);
    }else{
        console.log("INFO: New request to /contacts/" + name);
        var filteredContacts = contacts.filter((contact) =>{
             return contact.name === name; 
        });
        if(filteredContacts.length > 0){
            var contact = filteredContacts[0];
            console.log("INFO: Sending contact: " + JSON.stringify(contact,2,null));
            response.send(contact);
        }else{
            console.log("WARNING: There are not any contact with name " + name);
            response.sendStatus(404);
        }
    }*/


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


//POST over a single resource
app.post(BASE_API_PATH + "/employment-stats/:province", function (request, response) {
    response.sendStatus(405);
});


//PUT over a collection
app.put(BASE_API_PATH + "/employment-stats", function (request, response) {
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

            }); 
        }

    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/employment-stats", function(request, response) {
    console.log("INFO: New DELETE request to /elections-voting-stats");
    db.remove({}, {multi: true}, function (err, removed) {
        console.log("ELIMINADOS: "+removed); //numRemoved es un "array" cuyo SEGUNDO ELEMENTO ("n") indica el número de objetos eliminados!!!
                                                //Por tanto, como se toma el valor de una propiedad en JSON????
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (removed > 0) {
                console.log("INFO: All the provinces (" + removed + ") have been succesfully deleted");
                response.sendStatus(204); // no content
            } else {
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
    else{
        db.remove({province:province},function(err,removed){
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }else{
                if (removed === 1) {
                    console.log("INFO: All the provinces (" + removed + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no provinces to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }

});

