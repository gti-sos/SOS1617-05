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

 

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


apiNacho.register(app,port,BASE_API_PATH);  
apiAlberto.register(app,port,BASE_API_PATH);  
apiAntonio.register(app,port,BASE_API_PATH); 


