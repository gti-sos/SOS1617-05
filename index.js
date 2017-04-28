var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var apiNacho = require('./apiNacho.js');
var apiAlberto = require('./apiAlberto.js');
var apiAntonio = require('./apiAntonio.js');

var port = (process.env.PORT || 10000); 
var BASE_API_PATH = "/api/v1"; 
var app = express();

//Función que comprueba la clave especificada en la URL (apiKey):
var ourKey = "cinco";
var checkKey = function (req, res) {
    if (!req.query.apikey) {
        console.log("ERROR: No key was specified");
        res.sendStatus(401);
        return false;
    }
    else if (req.query.apikey !== ourKey) {
        console.log("ERROR: Wrong key");
        res.sendStatus(403);
        return false;
    }
    return true;
}; 
app.use("/", express.static(path.join(__dirname, "public")));

//Frontends request:
app.use("/api/v1/frontendNacho", express.static(path.join(__dirname, "public/frontends/nacho")));
app.use("/api/v1/frontendAlberto", express.static(path.join(__dirname, "public/frontends/alberto")));
app.use("/api/v1/frontendAntonio", express.static(path.join(__dirname, "public/frontends/antonio")));

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security       


apiNacho.register(app,port,BASE_API_PATH, checkKey);  
apiAlberto.register(app,port,BASE_API_PATH,checkKey);  
apiAntonio.register(app,port,BASE_API_PATH,checkKey); 