"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");

var path = require("path");
var DataStore = require("nedb");

var dbFileName = path.join(__dirname,"economicSituationStats.db");

var db = new DataStore({
   filename : dbFileName,
   autoload: true
});

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

db.find({},function(err,economicSituationStats){//{} te devuelve el array completo -->equivale al select *
    if(err)
        return 0;
    
    if(economicSituationStats.length===0){
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
        db.insert(datos);
        
    }else{
        console.log("INFO: DB has " + economicSituationStats.length+" economicSituation");
    }
    
    
    
    
    
});//encuentra el array en la base de datos.

var economicSituationStats = [
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

// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /economic-situation-stats");
    response.redirect(301, BASE_API_PATH + "/economic-situation-stats");
});


// GET a collection
app.get(BASE_API_PATH + "/economic-situation-stats", function (request, response) {
    console.log("INFO: New GET request to /economic-situation-stats");
   
   db.find({},function(err,economicSituationStats){
       if(err){
       return 0;
       }
      response.send(economicSituationStats);

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
         db.find({province:province},function(err, filteredEconomicSituation) {
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
            var economicSituationBeforeInsertion = economicSituationStats.filter((economicSituation) => {
                return (economicSituation.province.localeCompare(newEconomicSituation.province, "en", {'sensitivity': 'base'}) === 0);
            });
            if (economicSituationBeforeInsertion.length > 0) {
                console.log("WARNING: The economicSituation " + JSON.stringify(newEconomicSituation, 2, null) + " already extis, sending 409...");
                response.sendStatus(409); // conflict
            } else {
                console.log("INFO: Adding economicSituation " + JSON.stringify(newEconomicSituation, 2, null));
                db.insert(newEconomicSituation);

                response.sendStatus(201); // created
            }
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
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
    var provinceParam = request.params.province;
    
    db.update({province:provinceParam},updatedEconomicSituation);
  response.send(updatedEconomicSituation);
    //response.sendStatus(204);
        });
     
  

//DELETE over a collection
app.delete(BASE_API_PATH + "/economic-situation-stats/", function (request, response) {
    db.delete({},{multi:true},function(err, numDeleted) {
        if(err){
            return 0;
        }
    console.log("INFO: New DELETE request to /economic-situation-stats/");
    economicSituationStats.length = 0; // another way to do contacts=[] (since it do not create a new array)
    console.log("INFO: All the economicSituation have been succesfully deleted, sending 204...");
    response.sendStatus(204); // we do not include any enity
    });

});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/economic-situation-stats/:province", function (request, response) {
    var province = request.params.province;
    
    db.delete({province:province},function(err,numDeleted){
        if(err){
            return 0;
        }
    if (!province) {
        console.log("WARNING: New DELETE request to economic-situation-stats/:province without province, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: Deleting contact with province " + province + ", sending 204...");
        response.sendStatus(204);//(OK) No Content
    }
        
    });
    
});
    

app.listen(port, () => {
    
   console.log("Magic is happening on port " + port); 
    
});
