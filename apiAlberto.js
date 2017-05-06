var exports = module.exports = {};

exports.register = function(app, port, BASE_API_PATH,checkKey) {

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


    /*
    // Base GET
    app.get("/", function (request, response) {
        console.log("INFO: Redirecting to /economic-situation-stats");
        response.redirect(301, BASE_API_PATH + "/economic-situation-stats");
    });
    */

    //El recurso debe contener una ruta /api/v1/XXXXX/loadInitialData que al hacer un GET cree 2 o más datos en la base de datos si está vacía.

    app.get(BASE_API_PATH + "/economic-situation-stats/loadInitialData", function(request, response) {
        if(!checkKey(request,response)) return;
       db2.find({}).toArray(function(err, economicSituationStats) {
            if (err) {
                console.log('WARNING: Error getting initial data from DB');
                return 0;
            }
            if (economicSituationStats.length === 0) {
                console.log("Adding...");
                
                    var granada = new Object();
                    granada.province = "Granada";
                    granada.year= "2010";
                    granada.gdp ="563.325";
                    granada.debt = "646.25";
                
                    var madrid = new Object();
                    madrid.province = "Madrid";
                    madrid.year = "2015";
                    madrid.gdp= "564.325";
                    madrid.debt= "123.56";
                
                    var cadiz = new Object();
                    cadiz.province = "Cadiz";
                    cadiz.year= "2007";
                    cadiz.gdp= "598.365";
                    cadiz.debt = "895.36";
             
                    var zaragoza = new Object();
                    zaragoza.province= "Zaragoza";
                    zaragoza.year ="2008";
                    zaragoza.gdp="563.325";
                    zaragoza.debt= "236.56";
               
                    var madrid2 = new Object;
                    madrid2.province = "Madrid";
                    madrid2.year =  "2007";
                    madrid2.gdp= "365.256";
                    madrid2.debt = "874.25";
                    
                    var huelva = new Object();
                    huelva.province = "Huelva";
                    huelva.year =  "2008";
                    huelva.gdp= "9.391.749";
                    huelva.debt = "230.679";
                    
                    var segovia = new Object();
                    segovia.province = "Segovia";
                    segovia.year =  "2008";
                    segovia.gdp= "3.795.363";
                    segovia.debt = "50.262";

                    var navarra = new Object();
                    navarra.province = "Navarra";
                    navarra.year =  "2008";
                    navarra.gdp= "17.722.300";
                    navarra.debt = "235.765"; 
                    
                    var huesca = new Object();
                    huesca.province = "Huesca";
                    huesca.year =  "2009";
                    huesca.gdp= "836.26";
                    huesca.debt = "895.36"; 

                 db2.insert(granada);
                 db2.insert(madrid);
                 db2.insert(cadiz);
                 db2.insert(zaragoza);
                 db2.insert(madrid2);
                 db2.insert(huelva);
                 db2.insert(segovia);
                 db2.insert(navarra);
                 db2.insert(huesca);
                 
                response.sendStatus(201); // created
                
              
            }
            else {
                console.log("DataBase IS NOT EMPTY. DB has " + economicSituationStats.length + "results");
                response.sendStatus(200); //OK
            }

        });
    });
  
                
               /* var datos = [{
                    "province": "Granada",
                    "year": "2010",
                    "gdp": "563.325",
                    "debt": "646.25"
                }, {
                    "province": "Madrid",
                    "year": "2015",
                    "gdp": "564.325",
                    "debt": "123.56"
                }, {
                    "province": "Cadiz",
                    "year": "2007",
                    "gdp": "598.365",
                    "debt": "895.36"
                }, {
                    "province": "Zaragoza",
                    "year": "2008",
                    "gdp": "563.325",
                    "debt": "236.56"
                }, {
                    "province": "Madrid",
                    "year": "2007",
                    "gdp": "365.256",
                    "debt": "874.25"
                }];*/
             /*  db2.insert(datos);
                response.sendStatus(201); // created*/
//Búsqueda
/*
var search = function (economicSituationStats,from,to,nuevoarray){
    var i = 0;
    var fromyear = parseInt(from);
    var toyear = parseInt(to);
    
    while(i<economicSituationStats.length){
         var year = economicSituationStats[i].year;
    if(year>=fromyear && year<=toyear){
        nuevoarray.push(economicSituationStats[i]);
    }
   i++;
    }
    return nuevoarray;
    
};*/

// GET a collection --> Acceder a todas las estadísticas
    app.get(BASE_API_PATH + "/economic-situation-stats", function(request, response) {
        console.log("INFO: New GET request to /economic-situation-stats");
        if(!checkKey(request,response))return;

            var from = request.query.from;
            var to =  request.query.to;
            var limit =  request.query.limit;
            var offset = request.query.offset;
            var province = request.query.province;
            var year = request.query.year;
            var gdp = request.query.gdp;
            var debt = request.query.debt;
            
       
                if (province == undefined && year == undefined  && gdp == undefined && debt ==undefined) { 
                    console.log("Ningún parámetro");

                     db2.find({}).toArray(function (err, filteredEconomicSituationStats){
                            if (err) {
                          console.error('WARNING: Error getting data from DB');
                       response.sendStatus(500); //internal server error
                }else{
                 console.log("Sending..." + JSON.stringify(filteredEconomicSituationStats,2,null));
                var economicSituationStats = filteredEconomicSituationStats;
  
                           if (from != undefined || to != undefined) { 

                             economicSituationStats=[];
                        var i=0;
                        while( i < filteredEconomicSituationStats.length){
                            if (filteredEconomicSituationStats[i].year >= Number(from) && filteredEconomicSituationStats[i].year <= Number(filteredEconomicSituationStats.to)) {
                                economicSituationStats.push(filteredEconomicSituationStats[i]);
                            }
                            i++;
                        }
                    }
           
                        if(offset != undefined && limit !=undefined){
                            economicSituationStats = economicSituationStats.slice(Number(offset), Number(offset) + Number(limit));
                        }
                     
                            

                                response.send(economicSituationStats);
                            }
                       
                
           
        });
                }else{
                    console.log("Existen parámetros");
                    
                     db2.find({}).toArray(function(err, filteredEconomicSituationStats) {
                         var economicSituationStats = [];
                          var i=0;
                while(i < filteredEconomicSituationStats.length) {
                    if (( province == undefined || filteredEconomicSituationStats[i].province == province) &&
                        ( gdp == undefined || filteredEconomicSituationStats[i].gdp == gdp) &&
                        ( debt == undefined || filteredEconomicSituationStats[i].debt == debt)){
                        economicSituationStats.push(filteredEconomicSituationStats[i]);
                    }
                    i++;
                }
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); //internal server error
            }
            else {
               /* 
                if(economicSituationStats.length===0){
                    response.sendStatus(404);
                }*/
              console.log("Sending..." + JSON.stringify(filteredEconomicSituationStats,2,null));
             var economicSituationStats2=economicSituationStats;
             if(from!=undefined || to!=undefined){
                 economicSituationStats2=[];
                var i1=0;
             while(i1<economicSituationStats.length){
                 if(economicSituationStats[i1].year >= Number(from) && filteredEconomicSituationStats[i1].year <= Number(to)){
                     economicSituationStats2.push(economicSituationStats[i1]);
                 }
                 i1++;
             }  
             }
            if (offset != undefined && limit != undefined) { 
                        economicSituationStats2 = economicSituationStats2.slice(Number(offset), Number(offset) + Number(limit));
                        
            }
             response.send(economicSituationStats2);
            }
                });
                  }
    });

/*
    // GET a single resource--->Acceder a todas las estadísticas de una provincia 
    app.get(BASE_API_PATH + "/economic-situation-stats/:province", function(request, response) {
        if(!checkKey(request,response)) return;
        var province = request.params.province;
        if (!province) {
            console.log("WARNING: New GET request to /economic-situation-stats/:province without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /economic-situation-stats/" + province);
            db2.find({
                province: province
            }).toArray(function(err, filteredEconomicSituation) {
                if (err) {
                    console.error('WARNING: Error getting data form DB');
                    response.sendStatus(500); //internal server error
                }
                else {
                    if (filteredEconomicSituation.length > 0) {
                        var economicSituation = filteredEconomicSituation;
                        console.log("INFO: Sending economicSituation: " + JSON.stringify(economicSituation, 2, null)); //
                        response.send(economicSituation);
                    }
                    else {
                        console.log("WARNING: There are not any economicSituation with province " + province);
                        response.sendStatus(404); // not found
                    }

                }

            });

        }

    });

*/

   
    //Acceder a un año concreto
    app.get(BASE_API_PATH + "/economic-situation-stats/:year", function (request, response) {
    if(!checkKey(request,response)) return;
    var province = request.params.year;
    var year = request.params.year;
    
    if(isNaN(request.params.year.charAt(0))){
        
        
        
        if (!province) {
            console.log("WARNING: New GET request to /economic-situation-stats/:province without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /economic-situation-stats/" + province);
            db2.find({
                province: province
            }).toArray(function(err, filteredEconomicSituation) {
                if (err) {
                    console.error('WARNING: Error getting data form DB');
                    response.sendStatus(500); //internal server error
                }else if (filteredEconomicSituation.length > 0) {
                        var economicSituation = filteredEconomicSituation;
                        console.log("INFO: Sending economicSituation: " + JSON.stringify(economicSituation, 2, null)); //
                        response.send(economicSituation);
                    }else {
                        console.log("WARNING: There are not any economicSituation with province " + province);
                        response.sendStatus(404); // not found
                    }

                
              });
            

}

   



    }else{

        
             if (!year) {
            console.log("WARNING: New GET request to /economic-situation-stats/:year without year, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /economic-situation-stats/:year" + year);
             db2.find({year:year}).toArray(function(err, filteredEconomicSituation) {
            if(err){
                console.error('WARNING: Error getting data form DB');
                response.sendStatus(500);//internal server error
            }
            else if (filteredEconomicSituation.length > 0) {
               var economicSituation = filteredEconomicSituation;
                console.log("INFO: Sending economicSituation: " + JSON.stringify(economicSituation, 2, null));//
                response.send(economicSituation);
            } else {
                console.log("WARNING: There are not any economicSituation with year " + year);
                response.sendStatus(404); // not found
             
             
            }
            
        });
        
        }
       
    }});
 // Acceder a una estadística concreta --> de una provincia en un año concreto
    app.get(BASE_API_PATH + "/economic-situation-stats/:province/:year", function(request, response) {
                if(!checkKey(request,response)) return;
        var province = request.params.province;
        var year = request.params.year;
        if (!province) {
            console.log("WARNING: New GET request to /economic-situation-stats/:province without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else if (!year) {
            console.log("WARNING: New GET request to /economic-situation-stats/:province/:year without year, sending 400...");
            response.sendStatus(400); // bad request 

        }
        else {
            console.log("INFO: New GET request to /economic-situation-stats/" + province + year);
            db2.find({
                province: province,
                year: year
            }).toArray(function(err, filteredEconomicSituation) {
                if (err) {
                    console.error('WARNING: Error getting data form DB');
                    response.sendStatus(500); //internal server error
                }
                else {
                    if (filteredEconomicSituation.length > 0) {
                        var economicSituation = filteredEconomicSituation[0];
                        console.log("INFO: Sending economicSituation: " + JSON.stringify(economicSituation, 2, null));
                        response.send(economicSituation);
                    }
                    else {
                        console.log("WARNING: There are not any economicSituation with year " + year);
                        response.sendStatus(404); // not found
                    }

                }

            });

        }

    });

    

    //POST over a collection--->Crear una nueva estadística
    app.post(BASE_API_PATH + "/economic-situation-stats", function(request, response) {
                if(!checkKey(request,response)) return;
        var newEconomicSituation = request.body;
        if (!newEconomicSituation) {
            console.log("WARNING: New POST request to /economic-situation-stats without economicSituation, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New POST request to /economic-situation-stats with body: " + JSON.stringify(newEconomicSituation, 2, null));
            if (!newEconomicSituation.province || !newEconomicSituation.year || !newEconomicSituation.gdp || !newEconomicSituation.debt) {
                console.log("WARNING: The EconomicSituation " + JSON.stringify(newEconomicSituation, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                db2.find({}).toArray(function(err, economicSituationStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {

                        var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                            return (economicSituation.province.localeCompare(newEconomicSituation.province, "en", {
                                'sensitivity': 'base'
                            }) === 0);
                        });
                        if (economicSituationBeforeInsertion.length > 0) {
                            console.log("WARNING: The economicSituation " + JSON.stringify(newEconomicSituation, 2, null) + " already extis, sending 409...");
                            response.sendStatus(409); // conflict
                        }
                        else {
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
    app.post(BASE_API_PATH + "/economic-situation-stats/:province", function(request, response) {
                if(!checkKey(request,response)) return;
        var province = request.params.province;
        console.log("WARNING: New POST request to /economic-situation-stats/" + province + ",sending 405...");
        response.sendStatus(405); // method not allowed
    });


    //PUT over a collection
    app.put(BASE_API_PATH + "/economic-situation-stats", function(request, response) {  
        if(!checkKey(request,response)) return;

        console.log("WARNING: New PUT request to /economic-situation-stats, sending 405...");
        response.sendStatus(405); // method not allowed
    });


    //PUT over a single resource--->Actualizar una estadística
    app.put(BASE_API_PATH + "/economic-situation-stats/:province", function(request, response) {
                        if(!checkKey(request,response)) return;
        var updatedEconomicSituation = request.body;
        var province = request.params.province;
        if (!updatedEconomicSituation || updatedEconomicSituation.province!=province) {
            console.log("WARNING: New PUT request to /economic-situation-stats/ without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /economic-situation-stats/" + province + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));
            if (!updatedEconomicSituation.province || !updatedEconomicSituation.year || !updatedEconomicSituation.gdp || !updatedEconomicSituation.debt) {
                console.log("WARNING: The economicSituation " + JSON.stringify(updatedEconomicSituation, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                db2.find({}).toArray(function(err, economicSituationStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                            return (economicSituation.province.localeCompare(province, "en", {
                                'sensitivity': 'base'
                            }) === 0);
                        });
                        if (economicSituationBeforeInsertion.length > 0) {
                            db2.update({
                                province: province
                            }, updatedEconomicSituation);
                            console.log("INFO: Modifying economicSituation with province " + province + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));
                            response.send(updatedEconomicSituation); // return the updated economic situation
                        }
                        else {
                            console.log("WARNING: There are not any economicSituation with province " + province);
                            response.sendStatus(404); // not found
                        }
                    }
                });

            }

        }

    });

    //PUT over a single resource-->por provincia y año
    app.put(BASE_API_PATH + "/economic-situation-stats/:province/:year", function(request, response) {
                if(!checkKey(request,response)) return;

        var updatedEconomicSituation = request.body;
        var province = request.params.province;
        var year = request.params.year;
        if (!updatedEconomicSituation || updatedEconomicSituation.province!=province || updatedEconomicSituation.year!=year) {
            console.log("WARNING: New PUT request to /economic-situation-stats/ without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /economic-situation-stats/" + province + "/" + year + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));
            if (!updatedEconomicSituation.province || !updatedEconomicSituation.year || !updatedEconomicSituation.gdp || !updatedEconomicSituation.debt) {
                console.log("WARNING: The economicSituation " + JSON.stringify(updatedEconomicSituation, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                db2.find({}).toArray(function(err, economicSituationStats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                            return (economicSituation.year.localeCompare(year, "en", {
                                'sensitivity': 'base'
                            }) === 0);
                        });
                        if (economicSituationBeforeInsertion.length > 0) {
                            db2.update({
                                province: province,
                                year: year
                            }, updatedEconomicSituation);
                            console.log("INFO: Modifying economicSituation with province " + province + "/" + year + " with data " + JSON.stringify(updatedEconomicSituation, 2, null));
                            response.send(updatedEconomicSituation); // return the updated economic situation
                        }
                        else {
                            console.log("WARNING: There are not any economicSituation with province " + province);
                            response.sendStatus(404); // not found
                        }
                    }
                });

            }

        }

    });

    //DELETE over a collection
    app.delete(BASE_API_PATH + "/economic-situation-stats", function(request, response) {
                if(!checkKey(request,response)) return;

        console.log("INFO: New DELETE request to /economic-situation-stats");
        db2.remove({}, {
            multi: true
        }, function(err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (numRemoved.n > 0) {
                    console.log("INFO: All the economicSituation (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204); //No content
                }
                else {
                    console.log("WARNING: There are not economicSituation to delete");
                    response.sendStatus(404); // not found

                }
            }
        });

    });


    //DELETE over a single resource--->Borrar una provincia
    app.delete(BASE_API_PATH + "/economic-situation-stats/:province", function(request, response) {
                if(!checkKey(request,response)) return;
        var province = request.params.province;
        if (!province) {
            console.log("WARNING: New DELETE request to economic-situation-stats/:province without province, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /economic-situation-stats/" + province);
            db2.remove({
                province: province
            }, {}, function(err, result) {
                var numRemoved = JSON.parse(result);

                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    console.log("INFO: EconomicSituation removed: " + numRemoved.n);
                    if (numRemoved.n === 1) {
                        console.log("INFO: The economicSituation with province " + province + " has been succesfully deleted, sending 204...");
                        response.sendStatus(204); //(OK) No Content
                    }
                    else {
                        console.log("WARNING: There are not economicSituationStats to delete");
                        response.sendStatus(404);
                    }
                }

            });
        }

    });

    //DELETE over a single resource--->Borrar una provincia en un año concreto
    app.delete(BASE_API_PATH + "/economic-situation-stats/:province/:year", function(request, response) {
                if(!checkKey(request,response)) return;
        var province = request.params.province;
        var year = request.params.year;
        if (!province || !year) {
            console.log("WARNING: New DELETE request to economic-situation-stats/:province/:year without province or without year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /economic-situation-stats/" + province + "/" + year);
            db2.remove({
                province: province,
                year: year
            }, {}, function(err, result) {
                var numRemoved = JSON.parse(result);

                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    console.log("INFO: EconomicSituation removed: " + numRemoved.n);
                    if (numRemoved.n === 1) {
                        console.log("INFO: The economicSituation with province " + province + " and year " + year + " has been succesfully deleted, sending 204...");
                        response.sendStatus(204); //(OK) No Content
                    }
                    else {
                        console.log("WARNING: There are not economicSituationStats to delete");
                        response.sendStatus(404);
                    }
                }

            });
        }

    });
};

